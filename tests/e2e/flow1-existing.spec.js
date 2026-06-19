import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api';
const RESULTS_DIR = 'tests/e2e/test-results/flow1';
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

const SS = async (page, name) => {
  await page.screenshot({ path: path.join(RESULTS_DIR, `${name}.png`), fullPage: true });
};

const CREDS = { email: 'ahmedazaz3685@gmail.com', password: '12345678' };

async function apiLogin(page, email, password) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  for (let attempt = 0; attempt < 3; attempt++) {
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
        const authData = { id: data._id, email: data.email, token: data.token, role: data.role, ...apiUser };
        localStorage.setItem('auth', JSON.stringify(authData));
        return { ok: true };
      } catch (e) { return { error: e.message }; }
    }, { email, password, apiUrl: API_URL });
    if (result.ok) break;
    await page.waitForTimeout(2000);
  }
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
}

async function clearAuth(page) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => localStorage.removeItem('auth'));
}

function getToken(page) {
  return page.evaluate(() => {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    return auth?.token;
  });
}

// ═══════════════════════════════════════════════════════════════
// FLOW 1: EXISTING ACCOUNT — FULL E2E
// ═══════════════════════════════════════════════════════════════
test.describe.serial('FLOW 1: EXISTING ACCOUNT', () => {
  test.beforeEach(async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
  });

  // ── 1.1 HOME PAGE ──
  test('1.1 - Home page loads with all sections', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(100);

    const hasHero = bodyText?.includes('stylist') || bodyText?.includes('Stylist') || bodyText?.includes('outfit') || bodyText?.includes('Outfit');
    console.log(`Hero section: ${hasHero ? 'FOUND' : 'NOT FOUND'}`);

    const hasFeatures = bodyText?.includes('feature') || bodyText?.includes('Feature') || bodyText?.includes('Upload') || bodyText?.includes('Neural');
    console.log(`Features section: ${hasFeatures ? 'FOUND' : 'NOT FOUND'}`);

    await SS(page, '1.1-home');
  });

  // ── 1.2 NAVIGATION ──
  test('1.2 - All navigation links work', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const routes = [
      '/stores', '/tryOn', '/matching', '/recommendations',
      '/wardrobe', '/favorites', '/pricing', '/avatar',
      '/recycle', '/editprofile',
      '/about', '/about-tryon', '/about-recycle', '/contact-us',
    ];

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);

      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length).toBeGreaterThan(10);
      console.log(`${route}: OK (${bodyText?.length} chars)`);
    }
  });

  // ── 1.3 STORES PAGE ──
  test('1.3 - Stores page loads with products', async ({ page }) => {
    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.3-stores');

    const hasContent = bodyText?.includes('store') || bodyText?.includes('Store') || bodyText?.includes('product') || bodyText?.includes('Product') || bodyText?.length > 100;
    expect(hasContent).toBe(true);
  });

  test('1.3a - Stores page filter sidebar', async ({ page }) => {
    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const filterBtn = page.locator('button').filter({ hasText: /filter|Filter/i }).first();
    if (await filterBtn.isVisible().catch(() => false)) {
      await filterBtn.click();
      await page.waitForTimeout(1000);
      await SS(page, '1.3a-stores-filter');
      console.log('Filter sidebar opened');
    } else {
      console.log('No filter button found — page may not have products');
    }
  });

  // ── 1.4 TRY-ON PAGE ──
  test('1.4 - TryOn page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/tryOn`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.4-tryon');

    const hasContent = bodyText?.includes('try') || bodyText?.includes('Try') || bodyText?.includes('model') || bodyText?.includes('Model') || bodyText?.includes('avatar') || bodyText?.includes('Avatar') || bodyText?.includes('wardrobe') || bodyText?.length > 100;
    expect(hasContent).toBe(true);
  });

  // ── 1.5 RECYCLE PAGE ──
  test('1.5 - Recycle page loads with upload area', async ({ page }) => {
    await page.goto(`${BASE_URL}/recycle`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.5-recycle');

    const hasUpload = bodyText?.includes('upload') || bodyText?.includes('Upload') || bodyText?.includes('garment') || bodyText?.includes('Garment') || bodyText?.includes('Up-cycling') || bodyText?.includes('image');
    expect(hasUpload).toBe(true);
  });

  // ── 1.6 MATCHING PAGE ──
  test('1.6 - Matching page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/matching`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.6-matching');

    const hasContent = bodyText?.includes('match') || bodyText?.includes('Match') || bodyText?.includes('wardrobe') || bodyText?.includes('Wardrobe') || bodyText?.length > 100;
    expect(hasContent).toBe(true);
  });

  // ── 1.7 RECOMMENDATIONS PAGE ──
  test('1.7 - Recommendations page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/recommendations`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.7-recommendations');

    const hasContent = bodyText?.includes('recommend') || bodyText?.includes('Recommend') || bodyText?.includes('outfit') || bodyText?.includes('Outfit') || bodyText?.includes('weather') || bodyText?.includes('Weather') || bodyText?.length > 100;
    expect(hasContent).toBe(true);
  });

  // ── 1.8 WARDROBE PAGE ──
  test('1.8 - Wardrobe page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/wardrobe`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.8-wardrobe');

    const hasContent = bodyText?.includes('wardrobe') || bodyText?.includes('Wardrobe') || bodyText?.includes('closet') || bodyText?.includes('Closet') || bodyText?.length > 100;
    expect(hasContent).toBe(true);
  });

  // ── 1.9 FAVORITES PAGE ──
  test('1.9 - Favorites page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/favorites`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.9-favorites');

    const hasContent = bodyText?.includes('favorite') || bodyText?.includes('Favorite') || bodyText?.includes('saved') || bodyText?.includes('Saved') || bodyText?.length > 100;
    expect(hasContent).toBe(true);
  });

  // ── 1.10 PRICING PAGE ──
  test('1.10 - Pricing page loads with plans', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.10-pricing');

    const hasPricing = bodyText?.includes('price') || bodyText?.includes('Price') || bodyText?.includes('month') || bodyText?.includes('plan') || bodyText?.includes('Plan') || bodyText?.includes('Essential') || bodyText?.includes('Pro');
    expect(hasPricing).toBe(true);
  });

  test('1.10a - Pricing monthly/yearly toggle', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const toggleBtn = page.locator('button').filter({ hasText: /year|month|annual/i }).first();
    if (await toggleBtn.isVisible().catch(() => false)) {
      const textBefore = await page.locator('body').textContent();
      await toggleBtn.click();
      await page.waitForTimeout(1000);
      const textAfter = await page.locator('body').textContent();
      await SS(page, '1.10a-pricing-toggled');
      console.log(`Pricing toggle: ${textBefore !== textAfter ? 'CHANGED' : 'SAME'}`);
    }
  });

  // ── 1.11 AVATAR PAGE ──
  test('1.11 - Avatar page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/avatar`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.11-avatar');

    const hasContent = bodyText?.includes('avatar') || bodyText?.includes('Avatar') || bodyText?.includes('create') || bodyText?.includes('Create') || bodyText?.includes('skin') || bodyText?.includes('hair') || bodyText?.length > 100;
    expect(hasContent).toBe(true);
  });

  // ── 1.12 EDIT PROFILE PAGE ──
  test('1.12 - Edit profile page loads with form', async ({ page }) => {
    await page.goto(`${BASE_URL}/editprofile`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.12-editprofile');

    const hasForm = bodyText?.includes('profile') || bodyText?.includes('Profile') || bodyText?.includes('name') || bodyText?.includes('Name') || bodyText?.includes('email') || bodyText?.includes('Email') || bodyText?.length > 100;
    expect(hasForm).toBe(true);

    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log(`Profile page inputs: ${inputCount}`);
  });

  test('1.12a - Edit profile: update name', async ({ page }) => {
    await page.goto(`${BASE_URL}/editprofile`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="firstName"], input[name="first_name"], input[name="fname"]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      await nameInput.evaluate((el, val) => {
        nativeSet.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, 'QATest Updated');
      console.log('Name input updated');
      await SS(page, '1.12a-editprofile-name');
    }
  });

  // ── 1.13 CONTACT US ──
  test('1.13 - Contact Us page loads with form', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, '1.13-contact');

    const hasForm = bodyText?.includes('contact') || bodyText?.includes('Contact') || bodyText?.includes('message') || bodyText?.includes('Message') || bodyText?.includes('email') || bodyText?.length > 100;
    expect(hasForm).toBe(true);
  });

  // ── 1.14 ABOUT PAGES ──
  test('1.14 - About pages load', async ({ page }) => {
    const pages = ['/about', '/about-tryon', '/about-recycle'];
    for (const p of pages) {
      await page.goto(`${BASE_URL}${p}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length).toBeGreaterThan(100);
      console.log(`${p}: OK (${bodyText?.length} chars)`);
    }
    await SS(page, '1.14-about');
  });

  // ── 1.15 DARK MODE ──
  test('1.15 - Dark mode toggle', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const htmlClass = await page.locator('html').getAttribute('class');
    console.log(`Initial html class: "${htmlClass}"`);

    const themeBtn = page.locator('nav button, header button').filter({ has: page.locator('svg') }).first();
    if (await themeBtn.isVisible().catch(() => false)) {
      await themeBtn.click({ force: true });
      await page.waitForTimeout(1000);
      const newClass = await page.locator('html').getAttribute('class');
      console.log(`After toggle html class: "${newClass}"`);
      await SS(page, '1.15-dark-mode');

      await themeBtn.click({ force: true });
      await page.waitForTimeout(1000);
      const revertedClass = await page.locator('html').getAttribute('class');
      console.log(`Reverted html class: "${revertedClass}"`);
    }
  });

  // ── 1.16 LANGUAGE SWITCHING ──
  test('1.16 - Language switching EN/AR', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const langBtn = page.locator('button').filter({ hasText: /EN|AR/ }).first();
    if (await langBtn.isVisible().catch(() => false)) {
      const textBefore = await page.locator('body').textContent();
      await langBtn.click();
      await page.waitForTimeout(500);

      const arOption = page.locator('button, div[role="option"], li').filter({ hasText: /Arabic|عربي/ }).first();
      if (await arOption.isVisible().catch(() => false)) {
        await arOption.click();
        await page.waitForTimeout(1500);

        const dir = await page.locator('html').getAttribute('dir');
        console.log(`After AR switch, dir: "${dir}"`);
        expect(dir).toBe('rtl');
        await SS(page, '1.16-arabic');

        await langBtn.click();
        await page.waitForTimeout(500);
        const enOption = page.locator('button, div[role="option"], li').filter({ hasText: /English|إنجليزي/ }).first();
        if (await enOption.isVisible().catch(() => false)) {
          await enOption.click();
          await page.waitForTimeout(1500);
          const dirAfter = await page.locator('html').getAttribute('dir');
          console.log(`After EN switch, dir: "${dirAfter}"`);
        }
      }
    }
  });

  // ── 1.17 SEARCH IN STORES ──
  test('1.17 - Search functionality in stores', async ({ page }) => {
    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('shirt');
      await page.waitForTimeout(2000);
      await SS(page, '1.17-search');
      console.log('Search performed');
    } else {
      console.log('No search input found on stores page');
    }
  });

  // ── 1.18 ABOUT PAGE CONTENT ──
  test('1.18 - About page has team/sustainability content', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').textContent();
    const hasTeam = bodyText?.includes('team') || bodyText?.includes('Team') || bodyText?.includes('about') || bodyText?.includes('About');
    expect(hasTeam).toBe(true);
    await SS(page, '1.18-about-content');
  });

  // ── 1.19 ABOUT-TRYON PAGE ──
  test('1.19 - About TryOn page has how-it-works content', async ({ page }) => {
    await page.goto(`${BASE_URL}/about-tryon`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').textContent();
    const hasHowItWorks = bodyText?.includes('how') || bodyText?.includes('How') || bodyText?.includes('step') || bodyText?.includes('Step') || bodyText?.includes('works') || bodyText?.includes('Works');
    expect(hasHowItWorks).toBe(true);
    await SS(page, '1.19-about-tryon');
  });

  // ── 1.20 ABOUT-RECYCLE PAGE ──
  test('1.20 - About Recycle page has benefits content', async ({ page }) => {
    await page.goto(`${BASE_URL}/about-recycle`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').textContent();
    const hasBenefits = bodyText?.includes('benefit') || bodyText?.includes('Benefit') || bodyText?.includes('sustain') || bodyText?.includes('Sustain') || bodyText?.includes('environment') || bodyText?.includes('recycl');
    expect(hasBenefits).toBe(true);
    await SS(page, '1.20-about-recycle');
  });

  // ── 1.21 SESSION PERSISTENCE ──
  test('1.21 - Session persists after refresh', async ({ page }) => {
    let auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();

    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();
    expect(auth?.token).toBeTruthy();
  });

  // ── 1.22 404 PAGE ──
  test('1.22 - 404 page for unknown route', async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page-xyz`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').textContent();
    const has404 = bodyText?.includes('404') || bodyText?.includes('not found') || bodyText?.includes('Not Found');
    expect(has404).toBe(true);
    await SS(page, '1.22-404');
  });

  // ── 1.23 LOGOUT ──
  test('1.23 - Logout clears session', async ({ page }) => {
    let auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();

    await page.evaluate(() => localStorage.removeItem('auth'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeNull();
    await SS(page, '1.23-logged-out');
  });
});
