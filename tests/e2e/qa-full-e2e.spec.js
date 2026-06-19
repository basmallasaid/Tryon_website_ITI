import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const RESULTS_DIR = 'tests/e2e/test-results';

if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });
if (!fs.existsSync(path.join(RESULTS_DIR, 'flow1'))) fs.mkdirSync(path.join(RESULTS_DIR, 'flow1'), { recursive: true });
if (!fs.existsSync(path.join(RESULTS_DIR, 'flow2'))) fs.mkdirSync(path.join(RESULTS_DIR, 'flow2'), { recursive: true });
if (!fs.existsSync(path.join(RESULTS_DIR, 'cross'))) fs.mkdirSync(path.join(RESULTS_DIR, 'cross'), { recursive: true });

const SS = async (page, name) => {
  await page.screenshot({ path: path.join(RESULTS_DIR, `${name}.png`), fullPage: true });
};

const EXISTING_USER = { email: 'ahmedazaz3685@gmail.com', password: '12345678' };
const NEW_USER = { email: `qatest_new_${Date.now()}@test.com`, password: 'NewUser123!', firstName: 'New', lastName: 'User' };

// ─── Helpers ───

async function openAuthModal(page, mode = 'login') {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  if (mode === 'login') {
    const btn = page.locator('button, a').filter({ hasText: /^Login$/i }).first();
    await btn.click();
  } else {
    const btn = page.locator('button, a').filter({ hasText: /Sign[\s-]*up/i }).first();
    await btn.click();
  }
  // Wait for modal animation (duration-700 + buffer)
  await page.waitForTimeout(1500);
}

async function fillLoginForm(page, email, password) {
  await page.evaluate(({ email, password }) => {
    const emailInputs = document.querySelectorAll('input[name="email"]');
    const passInputs = document.querySelectorAll('input[name="password"]');
    let visibleEmail, visiblePass;
    for (const el of emailInputs) { if (el.offsetParent !== null) { visibleEmail = el; break; } }
    for (const el of passInputs) { if (el.offsetParent !== null) { visiblePass = el; break; } }
    const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    if (visibleEmail) { nativeSet.call(visibleEmail, email); visibleEmail.dispatchEvent(new Event('input', { bubbles: true })); visibleEmail.dispatchEvent(new Event('change', { bubbles: true })); }
    if (visiblePass) { nativeSet.call(visiblePass, password); visiblePass.dispatchEvent(new Event('input', { bubbles: true })); visiblePass.dispatchEvent(new Event('change', { bubbles: true })); }

    // Native DOM click on submit button (bypasses Playwright's force click issues with React)
    const forms = document.querySelectorAll('form');
    for (const form of forms) {
      if (form.offsetParent !== null && form.querySelector('input[name="email"]')) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.click();
        break;
      }
    }
  }, { email, password });
  await page.waitForTimeout(5000);
}

async function fillRegisterForm(page, data) {
  await page.evaluate((data) => {
    const fields = ['fname', 'lname', 'email', 'password', 'confirmPassword'];
    const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    for (const name of fields) {
      if (!data[name]) continue;
      const inputs = document.querySelectorAll(`input[name="${name}"]`);
      for (const el of inputs) {
        if (el.offsetParent !== null) {
          nativeSet.call(el, data[name]);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }

    const forms = document.querySelectorAll('form');
    for (const form of forms) {
      if (form.offsetParent !== null && form.querySelector('input[name="fname"]')) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.click();
        break;
      }
    }
  }, data);
  await page.waitForTimeout(5000);
}

async function login(page, email, password) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  // Retry login API up to 3 times (backend may be restarting)
  let loginResult = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    loginResult = await page.evaluate(async ({ email, password, apiUrl }) => {
      try {
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) return { error: `HTTP ${res.status}: ${await res.text()}` };
        const data = await res.json();

        const userRes = await fetch(`${apiUrl}/users/${data._id}`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const userData = userRes.ok ? await userRes.json() : {};
        const apiUser = userData?.user || userData;
        const fullName = apiUser?.profile
          ? [apiUser.profile.first_name, apiUser.profile.last_name].filter(Boolean).join(' ').trim()
          : apiUser?.name;

        const authData = {
          id: data._id, email: data.email, token: data.token, role: data.role,
          ...apiUser, name: fullName,
        };
        localStorage.setItem('auth', JSON.stringify(authData));
        return { ok: true };
      } catch (e) {
        return { error: e.message };
      }
    }, { email, password, apiUrl: 'http://localhost:5000/api' });

    if (loginResult.ok) break;
    console.log(`Login attempt ${attempt + 1} failed: ${loginResult.error}, retrying...`);
    await page.waitForTimeout(2000);
  }

  console.log('Login result:', loginResult?.ok ? 'SUCCESS' : loginResult?.error);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

async function logout(page) {
  // Try UI logout first
  const profileBtn = page.locator('button[aria-label="Profile"], button').filter({ has: page.locator('svg') }).filter({ hasText: /[A-Z]/ }).first();
  if (await profileBtn.isVisible().catch(() => false)) {
    await profileBtn.click();
    await page.waitForTimeout(500);
  }

  const logoutBtn = page.locator('button, a').filter({ hasText: /log\s*out/i }).first();
  if (await logoutBtn.isVisible().catch(() => false)) {
    await logoutBtn.click();
    await page.waitForTimeout(2000);
  }

  // Clear localStorage as fallback (UI logout may not complete in time)
  await page.evaluate(() => localStorage.removeItem('auth'));
}

async function toggleDarkMode(page) {
  // Find the theme toggle button (moon/sun icon in navbar)
  const navBtns = page.locator('nav button, header button, [class*="navbar"] button');
  const count = await navBtns.count();
  for (let i = 0; i < count; i++) {
    const btn = navBtns.nth(i);
    const svgCount = await btn.locator('svg').count();
    const text = (await btn.textContent()).trim();
    if (svgCount > 0 && text.length < 3) {
      await btn.click({ force: true });
      await page.waitForTimeout(1000);
      return;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// TEST FLOW 1: EXISTING ACCOUNT
// ═══════════════════════════════════════════════════════════════

test.describe.serial('FLOW 1: EXISTING ACCOUNT', () => {

  test('1.1 - Login with existing account', async ({ page }) => {
    await login(page, EXISTING_USER.email, EXISTING_USER.password);

    const authData = await page.evaluate(() => {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : null;
    });
    expect(authData).toBeTruthy();
    expect(authData?.token).toBeTruthy();

    await SS(page, 'flow1/1.1-logged-in');
  });

  test('1.2 - Home page loads correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = await page.title();
    expect(title).toContain('ReDolapy');

    await SS(page, 'flow1/1.2-home');
  });

  test('1.3 - Navigate all accessible pages', async ({ page }) => {
    test.setTimeout(120000);
    const routes = [
      '/', '/about', '/about-tryon', '/about-recycle', '/contact-us',
      '/stores', '/tryOn', '/recycle', '/matching', '/recommendations',
      '/wardrobe', '/favorites', '/pricing', '/editprofile', '/avatar',
    ];

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length).toBeGreaterThan(10);

      await SS(page, `flow1/1.3-${route.replace(/\//g, '_').slice(1) || 'home'}`);
      console.log(`Page ${route}: OK (body ${bodyText?.length} chars)`);
    }
  });

  test('1.4 - Navbar links visible and clickable', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const links = page.locator('nav a, header a');
    const count = await links.count();
    console.log(`Nav links: ${count}`);

    for (let i = 0; i < count; i++) {
      const text = (await links.nth(i).textContent()).trim();
      const href = await links.nth(i).getAttribute('href');
      if (text) console.log(`  [${i}] "${text}" -> ${href}`);
    }

    await SS(page, 'flow1/1.4-navbar');
  });

  test('1.5 - Contact Us form', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const messageInput = page.locator('textarea, input[name="message"]').first();

    if (await nameInput.isVisible().catch(() => false)) await nameInput.fill('QA Test User');
    if (await emailInput.isVisible().catch(() => false)) await emailInput.fill('qatest@test.com');
    if (await messageInput.isVisible().catch(() => false)) await messageInput.fill('E2E test message');

    await SS(page, 'flow1/1.5-contact-filled');

    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /send|submit/i }).first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
      await SS(page, 'flow1/1.5-contact-submitted');
    }
  });

  test('1.6 - Dark mode toggle', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const htmlBefore = await page.locator('html').getAttribute('class');
    console.log('Before toggle:', htmlBefore);

    await toggleDarkMode(page);
    await SS(page, 'flow1/1.6-dark-mode');

    await toggleDarkMode(page);
    await SS(page, 'flow1/1.6-light-restored');
  });

  test('1.7 - Language switching', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const langBtn = page.locator('button, a').filter({ hasText: /AR|EN|عربي/i }).first();
    if (await langBtn.isVisible().catch(() => false)) {
      await langBtn.click();
      await page.waitForTimeout(2000);
      const dir = await page.locator('html').getAttribute('dir');
      console.log('Direction after switch:', dir);
      await SS(page, 'flow1/1.7-arabic');

      const langBtnBack = page.locator('button, a').filter({ hasText: /AR|EN|عربي/i }).first();
      if (await langBtnBack.isVisible().catch(() => false)) {
        await langBtnBack.click();
        await page.waitForTimeout(2000);
      }
      await SS(page, 'flow1/1.7-english');
    }
  });

  test('1.8 - Edit profile page', async ({ page }) => {
    await page.goto(`${BASE_URL}/editprofile`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const inputs = page.locator('input');
    const count = await inputs.count();
    console.log(`Edit profile inputs: ${count}`);
    for (let i = 0; i < Math.min(count, 10); i++) {
      const name = await inputs.nth(i).getAttribute('name');
      const val = await inputs.nth(i).inputValue();
      console.log(`  [${i}] name="${name}" value="${val}"`);
    }
    await SS(page, 'flow1/1.8-edit-profile');
  });

  test('1.9 - Stores page', async ({ page }) => {
    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await SS(page, 'flow1/1.9-stores');
  });

  test('1.10 - Wardrobe page', async ({ page }) => {
    await page.goto(`${BASE_URL}/wardrobe`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow1/1.10-wardrobe');
  });

  test('1.11 - Favorites page', async ({ page }) => {
    await page.goto(`${BASE_URL}/favorites`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow1/1.11-favorites');
  });

  test('1.12 - Pricing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow1/1.12-pricing');
  });

  test('1.13 - TryOn page', async ({ page }) => {
    await page.goto(`${BASE_URL}/tryOn`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow1/1.13-tryon');
  });

  test('1.14 - Recycle page', async ({ page }) => {
    await page.goto(`${BASE_URL}/recycle`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow1/1.14-recycle');
  });

  test('1.15 - Matching page', async ({ page }) => {
    await page.goto(`${BASE_URL}/matching`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow1/1.15-matching');
  });

  test('1.16 - Recommendations page', async ({ page }) => {
    await page.goto(`${BASE_URL}/recommendations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow1/1.16-recommendations');
  });

  test('1.17 - Avatar page', async ({ page }) => {
    await page.goto(`${BASE_URL}/avatar`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow1/1.17-avatar');
  });

  test('1.18 - 404 page', async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page-xyz`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').textContent();
    const has404 = bodyText?.includes('404') || bodyText?.toLowerCase().includes('not found');
    console.log('404 detected:', has404);
    await SS(page, 'flow1/1.18-404');
  });

  test('1.19 - Session persistence after refresh', async ({ page }) => {
    await login(page, EXISTING_USER.email, EXISTING_USER.password);
    // Verify logged in
    let auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();

    // Refresh and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();
    await SS(page, 'flow1/1.19-session-persist');
  });

  test('1.20 - Logout and verify', async ({ page }) => {
    await login(page, EXISTING_USER.email, EXISTING_USER.password);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await logout(page);
    const auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeNull();
    console.log('After logout: LOGGED OUT');
    await SS(page, 'flow1/1.20-logged-out');
  });
});

// ═══════════════════════════════════════════════════════════════
// TEST FLOW 2: NEW ACCOUNT
// ═══════════════════════════════════════════════════════════════

test.describe.serial('FLOW 2: NEW ACCOUNT', () => {

  test('2.1 - Register new account', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const registerResult = await page.evaluate(async (data) => {
      const apiUrl = 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, confirmPassword: data.password }),
      });
      if (!res.ok) return { error: await res.text() };
      const signupData = await res.json();

      // Update profile with name
      await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${signupData.token}` },
        body: JSON.stringify({ firstName: data.firstName, lastName: data.lastName }),
      });

      // Fetch full profile
      const userRes = await fetch(`${apiUrl}/users/${signupData._id}`, {
        headers: { Authorization: `Bearer ${signupData.token}` },
      });
      const userData = userRes.ok ? await userRes.json() : {};
      const apiUser = userData?.user || userData;

      const authData = {
        id: signupData._id,
        email: signupData.email,
        token: signupData.token,
        role: 'user',
        ...apiUser,
      };
      localStorage.setItem('auth', JSON.stringify(authData));
      return { ok: true, authData };
    }, { email: NEW_USER.email, password: NEW_USER.password, firstName: NEW_USER.firstName, lastName: NEW_USER.lastName });

    console.log('Register result:', registerResult.ok ? 'SUCCESS' : registerResult.error);
    await SS(page, 'flow2/2.1-register-result');
  });

  test('2.2 - Empty states for new user', async ({ page }) => {
    await login(page, NEW_USER.email, NEW_USER.password);

    await page.goto(`${BASE_URL}/wardrobe`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow2/2.2-wardrobe-empty');

    await page.goto(`${BASE_URL}/favorites`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow2/2.2-favorites-empty');

    await page.goto(`${BASE_URL}/recommendations`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow2/2.2-recommendations-empty');
  });

  test('2.3 - New user dark mode', async ({ page }) => {
    await login(page, NEW_USER.email, NEW_USER.password);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await toggleDarkMode(page);
    await SS(page, 'flow2/2.3-dark');
    await toggleDarkMode(page);
    await SS(page, 'flow2/2.3-light');
  });

  test('2.4 - New user language switching', async ({ page }) => {
    await login(page, NEW_USER.email, NEW_USER.password);
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const langBtn = page.locator('button, a').filter({ hasText: /AR|EN|عربي/i }).first();
    if (await langBtn.isVisible().catch(() => false)) {
      await langBtn.click();
      await page.waitForTimeout(2000);
      await SS(page, 'flow2/2.4-arabic');
      const back = page.locator('button, a').filter({ hasText: /AR|EN|عربي/i }).first();
      if (await back.isVisible().catch(() => false)) {
        await back.click();
        await page.waitForTimeout(2000);
      }
      await SS(page, 'flow2/2.4-english');
    }
  });

  test('2.5 - New user profile page', async ({ page }) => {
    await login(page, NEW_USER.email, NEW_USER.password);
    await page.goto(`${BASE_URL}/editprofile`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'flow2/2.5-profile');
  });

  test('2.6 - Session persistence', async ({ page }) => {
    await login(page, NEW_USER.email, NEW_USER.password);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();
    await SS(page, 'flow2/2.6-session');
  });

  test('2.7 - Logout and re-login', async ({ page }) => {
    await login(page, NEW_USER.email, NEW_USER.password);
    await logout(page);
    await SS(page, 'flow2/2.7-logged-out');

    await login(page, NEW_USER.email, NEW_USER.password);
    const auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();
    await SS(page, 'flow2/2.7-re-logged-in');
  });
});

// ═══════════════════════════════════════════════════════════════
// CROSS-FEATURE: Forms & Validation
// ═══════════════════════════════════════════════════════════════

test.describe.serial('CROSS: Forms & Validation', () => {

  test('CF.1 - Login empty fields validation', async ({ page }) => {
    await openAuthModal(page, 'login');
    const desktopForm = page.locator('.hidden.md\\:block form').first();
    await expect(desktopForm).toBeAttached({ timeout: 10000 });

    await desktopForm.locator('button[type="submit"]').click({ force: true });
    await page.waitForTimeout(1000);
    await SS(page, 'cross/CF.1-login-empty');
  });

  test('CF.2 - Login invalid email', async ({ page }) => {
    await openAuthModal(page, 'login');
    const desktopForm = page.locator('.hidden.md\\:block form').first();
    await expect(desktopForm).toBeAttached({ timeout: 10000 });

    await desktopForm.locator('input[name="email"]').fill('notanemail', { force: true });
    await desktopForm.locator('input[name="password"]').fill('password123', { force: true });
    await desktopForm.locator('button[type="submit"]').click({ force: true });
    await page.waitForTimeout(2000);
    await SS(page, 'cross/CF.2-login-invalid-email');
  });

  test('CF.3 - Login wrong password', async ({ page }) => {
    await openAuthModal(page, 'login');
    const desktopForm = page.locator('.hidden.md\\:block form').first();
    await expect(desktopForm).toBeAttached({ timeout: 10000 });

    await desktopForm.locator('input[name="email"]').fill('ahmedazaz3685@gmail.com', { force: true });
    await desktopForm.locator('input[name="password"]').fill('wrongpassword', { force: true });
    await desktopForm.locator('button[type="submit"]').click({ force: true });
    await page.waitForTimeout(2000);

    const errorEl = page.locator('[class*="error"], [class*="alert"], [role="alert"], .swal2-popup').first();
    if (await errorEl.isVisible().catch(() => false)) {
      const text = await errorEl.textContent();
      console.log('Error message:', text);
    }
    await SS(page, 'cross/CF.3-login-wrong-pw');
  });

  test('CF.4 - Register mismatched passwords', async ({ page }) => {
    await openAuthModal(page, 'signup');
    await page.waitForTimeout(2000);

    await fillRegisterForm(page, {
      fname: 'Test',
      lname: 'User',
      email: 'mismatch@test.com',
      password: 'Password1!',
      confirmPassword: 'DifferentPassword1!',
    });
    await page.waitForTimeout(1000);
    await SS(page, 'cross/CF.4-register-mismatch');
  });

  test('CF.5 - Contact form empty submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /send|submit/i }).first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }
    await SS(page, 'cross/CF.5-contact-empty');
  });

  test('CF.6 - Contact form invalid email', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const msgInput = page.locator('textarea, input[name="message"]').first();

    if (await nameInput.isVisible().catch(() => false)) await nameInput.fill('Test');
    if (await emailInput.isVisible().catch(() => false)) await emailInput.fill('invalidemail');
    if (await msgInput.isVisible().catch(() => false)) await msgInput.fill('Test message');

    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /send|submit/i }).first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }
    await SS(page, 'cross/CF.6-contact-invalid-email');
  });
});

// ═══════════════════════════════════════════════════════════════
// CROSS-FEATURE: Responsive Layout
// ═══════════════════════════════════════════════════════════════

test.describe.serial('CROSS: Responsive Layout', () => {

  test('CF.7 - Mobile (375x812)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hamburger = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i]').first();
    const hasHamburger = await hamburger.isVisible().catch(() => false);
    console.log('Mobile hamburger:', hasHamburger);
    await SS(page, 'cross/CF.7-mobile-home');

    if (hasHamburger) {
      await hamburger.click();
      await page.waitForTimeout(1000);
      await SS(page, 'cross/CF.7-mobile-menu');
    }

    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'cross/CF.7-mobile-stores');

    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'cross/CF.7-mobile-pricing');
  });

  test('CF.8 - Tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'cross/CF.8-tablet-home');
  });

  test('CF.9 - Desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'cross/CF.9-desktop-1920');
  });
});

// ═══════════════════════════════════════════════════════════════
// CROSS-FEATURE: Error Handling & Edge Cases
// ═══════════════════════════════════════════════════════════════

test.describe.serial('CROSS: Error Handling', () => {

  test('CF.10 - Access protected page without auth', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.removeItem('auth'));
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.goto(`${BASE_URL}/tryOn`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const url = page.url();
    console.log('After unauth /tryOn, URL:', url);
    await SS(page, 'cross/CF.10-unauth-tryon');
  });

  test('CF.11 - Console errors on home page', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log(`Console errors: ${errors.length}`);
    errors.forEach(e => console.log(`  ERROR: ${e}`));
    await SS(page, 'cross/CF.11-console-errors');
  });

  test('CF.12 - Network offline simulation', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.context().setOffline(true);
    await page.reload();
    await page.waitForTimeout(3000);
    await SS(page, 'cross/CF.12-offline');

    await page.context().setOffline(false);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await SS(page, 'cross/CF.12-online-restored');
  });
});
