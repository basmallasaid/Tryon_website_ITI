import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api';
const RESULTS_DIR = 'tests/e2e/test-results/flow2';
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

const SS = async (page, name) => {
  await page.screenshot({ path: path.join(RESULTS_DIR, `${name}.png`), fullPage: true });
};

const NEW_EMAIL = `qatest_new_${Date.now()}@test.com`;
const NEW_PASS = 'NewUser123!';

async function apiRegister(page, email, password, firstName, lastName) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  const result = await page.evaluate(async (data) => {
    const apiUrl = 'http://localhost:5000/api';
    try {
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, confirmPassword: data.password }),
      });
      if (!res.ok) return { error: `HTTP ${res.status}: ${await res.text()}` };
      const signupData = await res.json();

      await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${signupData.token}` },
        body: JSON.stringify({ firstName: data.firstName, lastName: data.lastName }),
      });

      const authData = { id: signupData._id, email: signupData.email, token: signupData.token, role: 'user' };
      localStorage.setItem('auth', JSON.stringify(authData));
      return { ok: true };
    } catch (e) { return { error: e.message }; }
  }, { email, password, firstName, lastName });
  console.log(`Register result: ${result.ok ? 'SUCCESS' : result.error}`);
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
}

async function apiLogin(page, email, password) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  const result = await page.evaluate(async ({ email, password, apiUrl }) => {
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return { error: `HTTP ${res.status}` };
      const data = await res.json();
      const userRes = await fetch(`${apiUrl}/users/${data._id}`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = userRes.ok ? await userRes.json() : {};
      const apiUser = userData?.user || userData;
      const authData = { id: data._id, email: data.email, token: data.token, role: 'user', ...apiUser };
      localStorage.setItem('auth', JSON.stringify(authData));
      return { ok: true };
    } catch (e) { return { error: e.message }; }
  }, { email, password, apiUrl: API_URL });
  console.log(`Login result: ${result.ok ? 'SUCCESS' : result.error}`);
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
}

// ═══════════════════════════════════════════════════════════════
// FLOW 2: NEW ACCOUNT — FULL E2E
// ═══════════════════════════════════════════════════════════════
test.describe.serial('FLOW 2: NEW ACCOUNT', () => {
  // ── 2.1 REGISTER ──
  test('2.1 - Register new account', async ({ page }) => {
    await apiRegister(page, NEW_EMAIL, NEW_PASS, 'QATest', 'NewUser');

    const auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();
    expect(auth?.token).toBeTruthy();
    console.log(`Registered: ${NEW_EMAIL}`);
    await SS(page, '2.1-registered');
  });

  // ── 2.2 HOME PAGE AS NEW USER ──
  test('2.2 - Home page loads for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(100);
    await SS(page, '2.2-home-new-user');
  });

  // ── 2.3 EMPTY STATES ──
  test('2.3 - Wardrobe empty state', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/wardrobe`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '2.3-wardrobe-empty');
    console.log(`Wardrobe page content length: ${bodyText?.length}`);
  });

  test('2.4 - Favorites empty state', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/favorites`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '2.4-favorites-empty');
    console.log(`Favorites page content length: ${bodyText?.length}`);
  });

  // ── 2.5 ALL PAGES ACCESSIBLE ──
  test('2.5 - All pages accessible for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);

    const routes = [
      '/', '/stores', '/tryOn', '/matching', '/recommendations',
      '/wardrobe', '/favorites', '/pricing', '/avatar', '/recycle',
      '/editprofile', '/contact-us', '/about', '/about-tryon', '/about-recycle',
    ];

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);

      const url = page.url();
      const redirectedToLogin = url.includes('/login');
      const bodyText = await page.locator('body').textContent();

      if (redirectedToLogin) {
        console.log(`${route}: REDIRECTED TO LOGIN`);
      } else {
        expect(bodyText?.length).toBeGreaterThan(10);
        console.log(`${route}: OK (${bodyText?.length} chars)`);
      }
    }
    await SS(page, '2.5-all-pages');
  });

  // ── 2.6 PROFILE EDIT ──
  test('2.6 - Edit profile page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/editprofile`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log(`Profile inputs: ${inputCount}`);
    await SS(page, '2.6-editprofile-new');
  });

  // ── 2.7 DARK MODE ──
  test('2.7 - Dark mode for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const themeBtn = page.locator('nav button, header button').filter({ has: page.locator('svg') }).first();
    if (await themeBtn.isVisible().catch(() => false)) {
      await themeBtn.click({ force: true });
      await page.waitForTimeout(1000);
      const htmlClass = await page.locator('html').getAttribute('class');
      console.log(`Dark mode class: "${htmlClass}"`);
      await SS(page, '2.7-dark-mode-new');

      await themeBtn.click({ force: true });
      await page.waitForTimeout(1000);
    }
  });

  // ── 2.8 LANGUAGE SWITCHING ──
  test('2.8 - Language switching for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const langBtn = page.locator('button').filter({ hasText: /EN|AR/ }).first();
    if (await langBtn.isVisible().catch(() => false)) {
      await langBtn.click();
      await page.waitForTimeout(500);

      const arOption = page.locator('button, div[role="option"], li').filter({ hasText: /Arabic|عربي/ }).first();
      if (await arOption.isVisible().catch(() => false)) {
        await arOption.click();
        await page.waitForTimeout(1500);

        const dir = await page.locator('html').getAttribute('dir');
        expect(dir).toBe('rtl');
        await SS(page, '2.8-arabic-new');
        console.log('AR switch successful');

        await langBtn.click();
        await page.waitForTimeout(500);
        const enOption = page.locator('button, div[role="option"], li').filter({ hasText: /English|إنجليزي/ }).first();
        if (await enOption.isVisible().catch(() => false)) {
          await enOption.click();
          await page.waitForTimeout(1500);
        }
      }
    }
  });

  // ── 2.9 SESSION PERSISTENCE ──
  test('2.9 - Session persists for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);

    let auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();

    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();
  });

  // ── 2.10 LOGOUT AND RE-LOGIN ──
  test('2.10 - Logout and re-login', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);

    await page.evaluate(() => localStorage.removeItem('auth'));
    let auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeNull();

    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();
    expect(auth?.token).toBeTruthy();
    await SS(page, '2.10-relogin');
  });

  // ── 2.11 STORES PAGE ──
  test('2.11 - Stores page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '2.11-stores-new');
    console.log(`Stores page length: ${bodyText?.length}`);
  });

  // ── 2.12 TRYON PAGE ──
  test('2.12 - TryOn page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/tryOn`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '2.12-tryon-new');
    console.log(`TryOn page length: ${bodyText?.length}`);
  });

  // ── 2.13 RECYCLE PAGE ──
  test('2.13 - Recycle page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/recycle`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '2.13-recycle-new');
    console.log(`Recycle page length: ${bodyText?.length}`);
  });

  // ── 2.14 MATCHING PAGE ──
  test('2.14 - Matching page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/matching`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '2.14-matching-new');
    console.log(`Matching page length: ${bodyText?.length}`);
  });

  // ── 2.15 RECOMMENDATIONS PAGE ──
  test('2.15 - Recommendations page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/recommendations`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '2.15-recommendations-new');
    console.log(`Recommendations page length: ${bodyText?.length}`);
  });

  // ── 2.16 PRICING PAGE ──
  test('2.16 - Pricing page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    const hasPricing = bodyText?.includes('price') || bodyText?.includes('Price') || bodyText?.includes('month') || bodyText?.includes('plan');
    expect(hasPricing).toBe(true);
    await SS(page, '2.16-pricing-new');
  });

  // ── 2.17 AVATAR PAGE ──
  test('2.17 - Avatar page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/avatar`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '2.17-avatar-new');
    console.log(`Avatar page length: ${bodyText?.length}`);
  });

  // ── 2.18 CONTACT US ──
  test('2.18 - Contact Us page for new user', async ({ page }) => {
    await apiLogin(page, NEW_EMAIL, NEW_PASS);
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    const hasForm = bodyText?.includes('contact') || bodyText?.includes('Contact') || bodyText?.includes('message');
    expect(hasForm).toBe(true);
    await SS(page, '2.18-contact-new');
  });
});
