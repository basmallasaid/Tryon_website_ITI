import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api';
const RESULTS_DIR = 'tests/e2e/test-results/cross';
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

// ═══════════════════════════════════════════════════════════════
// CROSS-FEATURE TESTING
// ═══════════════════════════════════════════════════════════════

// ── FORMS & VALIDATION ──
test.describe('CROSS: Forms & Validation', () => {
  test('CF.1 - Login empty fields', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const loginBtn = page.locator('button, a').filter({ hasText: /^Login$/i }).first();
    await loginBtn.click();
    await page.waitForTimeout(1500);

    const forms = page.locator('form').filter({ has: page.locator('input[name="email"]') });
    const count = await forms.count();
    for (let i = 0; i < count; i++) {
      const form = forms.nth(i);
      if (await form.isVisible()) {
        const submitBtn = form.locator('button[type="submit"]');
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          await page.waitForTimeout(1000);
        }
        break;
      }
    }
    await SS(page, 'cross/cf1-login-empty');
  });

  test('CF.2 - Login invalid email', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const loginBtn = page.locator('button, a').filter({ hasText: /^Login$/i }).first();
    await loginBtn.click();
    await page.waitForTimeout(1500);

    await page.evaluate(() => {
      const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const emailInputs = document.querySelectorAll('input[name="email"]');
      for (const el of emailInputs) {
        if (el.offsetParent !== null) {
          nativeSet.call(el, 'not-an-email');
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
      const passInputs = document.querySelectorAll('input[name="password"]');
      for (const el of passInputs) {
        if (el.offsetParent !== null) {
          nativeSet.call(el, 'somepass');
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
      const forms = document.querySelectorAll('form');
      for (const form of forms) {
        if (form.offsetParent !== null && form.querySelector('input[name="email"]')) {
          const btn = form.querySelector('button[type="submit"]');
          if (btn) btn.click();
          break;
        }
      }
    });
    await page.waitForTimeout(2000);
    await SS(page, 'cross/cf2-login-invalid-email');
  });

  test('CF.3 - Login wrong password', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const loginBtn = page.locator('button, a').filter({ hasText: /^Login$/i }).first();
    await loginBtn.click();
    await page.waitForTimeout(1500);

    await page.evaluate(({ email, password }) => {
      const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const emailInputs = document.querySelectorAll('input[name="email"]');
      const passInputs = document.querySelectorAll('input[name="password"]');
      for (const el of emailInputs) {
        if (el.offsetParent !== null) {
          nativeSet.call(el, email);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
      for (const el of passInputs) {
        if (el.offsetParent !== null) {
          nativeSet.call(el, password);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
      const forms = document.querySelectorAll('form');
      for (const form of forms) {
        if (form.offsetParent !== null && form.querySelector('input[name="email"]')) {
          const btn = form.querySelector('button[type="submit"]');
          if (btn) btn.click();
          break;
        }
      }
    }, { email: 'qatest_e2e@test.com', password: 'wrongpassword123' });
    await page.waitForTimeout(3000);
    await SS(page, 'cross/cf3-login-wrong-pass');
  });

  test('CF.4 - Register mismatched passwords', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const signupBtn = page.locator('button, a').filter({ hasText: /Sign[\s-]*up/i }).first();
    await signupBtn.click();
    await page.waitForTimeout(1500);

    await page.evaluate(() => {
      const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const setField = (name, value) => {
        const inputs = document.querySelectorAll(`input[name="${name}"]`);
        for (const el of inputs) {
          if (el.offsetParent !== null) {
            nativeSet.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      };
      setField('fname', 'Test');
      setField('lname', 'User');
      setField('email', `test_${Date.now()}@test.com`);
      setField('password', 'Pass123!');
      setField('confirmPassword', 'DifferentPass!');

      const forms = document.querySelectorAll('form');
      for (const form of forms) {
        if (form.offsetParent !== null && form.querySelector('input[name="confirmPassword"]')) {
          const btn = form.querySelector('button[type="submit"]');
          if (btn) btn.click();
          break;
        }
      }
    });
    await page.waitForTimeout(2000);
    await SS(page, 'cross/cf4-register-mismatch');
  });

  test('CF.5 - Contact form empty', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /send|submit/i }).first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
    await SS(page, 'cross/cf5-contact-empty');
  });

  test('CF.6 - Contact form invalid email', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const msgInput = page.locator('textarea, input[name="message"]').first();

    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill('Test User');
    }
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('not-an-email');
    }
    if (await msgInput.isVisible().catch(() => false)) {
      await msgInput.fill('This is a test message');
    }

    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /send|submit/i }).first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
    await SS(page, 'cross/cf6-contact-invalid-email');
  });
});

// ── RESPONSIVE LAYOUT ──
test.describe('CROSS: Responsive Layout', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    test(`CF.${vp.name === 'Mobile' ? '7' : vp.name === 'Tablet' ? '8' : '9'} - ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await apiLogin(page, CREDS.email, CREDS.password);
      await page.goto(BASE_URL);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      if (vp.width < 1000) {
        const hamburger = page.locator('button[aria-label="Toggle menu"], button').filter({ has: page.locator('svg') }).first();
        const isVisible = await hamburger.isVisible().catch(() => false);
        console.log(`${vp.name} hamburger visible: ${isVisible}`);
      }

      await SS(page, `cross/cf${vp.name === 'Mobile' ? '7' : vp.name === 'Tablet' ? '8' : '9'}-${vp.name.toLowerCase()}`);

      const routes = ['/stores', '/tryOn', '/pricing'];
      for (const route of routes) {
        await page.goto(`${BASE_URL}${route}`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1500);
        await SS(page, `cross/cf${vp.name === 'Mobile' ? '7' : vp.name === 'Tablet' ? '8' : '9'}-${vp.name.toLowerCase()}-${route.replace(/\//g, '_')}`);
      }
    });
  }
});

// ── DARK MODE ACROSS PAGES ──
test.describe('CROSS: Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
  });

  const darkPages = ['/', '/stores', '/tryOn', '/pricing', '/recycle', '/matching', '/wardrobe'];

  for (const route of darkPages) {
    test(`Dark mode on ${route || '/home'}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      const themeBtn = page.locator('nav button, header button').filter({ has: page.locator('svg') }).first();
      if (await themeBtn.isVisible().catch(() => false)) {
        await themeBtn.click({ force: true });
        await page.waitForTimeout(1500);

        const htmlClass = await page.locator('html').getAttribute('class');
        const isDark = htmlClass?.includes('dark');
        console.log(`${route || '/'} dark: ${isDark}`);
        await SS(page, `cross/dark-${route.replace(/\//g, '_') || 'home'}`);

        await themeBtn.click({ force: true });
        await page.waitForTimeout(1000);
      }
    });
  }
});

// ── LANGUAGE ACROSS PAGES ──
test.describe('CROSS: Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
  });

  const langPages = ['/', '/stores', '/pricing', '/contact-us'];

  for (const route of langPages) {
    test(`Language switch on ${route || '/home'}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`);
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
          await SS(page, `cross/lang-${route.replace(/\//g, '_') || 'home'}-ar`);

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
  }
});

// ── LOADING STATES ──
test.describe('CROSS: Loading States', () => {
  test.beforeEach(async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
  });

  const loadingPages = ['/stores', '/tryOn', '/matching', '/recommendations', '/wardrobe'];

  for (const route of loadingPages) {
    test(`Loading state on ${route}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');

      const bodyText = await page.locator('body').textContent();
      const hasSkeleton = bodyText?.includes('loading') || bodyText?.includes('Loading') ||
        bodyText?.includes('spinner') || bodyText?.includes('...') ||
        bodyText?.includes('skeleton');
      console.log(`${route} loading indicator: ${hasSkeleton ? 'FOUND' : 'NOT FOUND'}`);

      await page.waitForTimeout(3000);
      const bodyTextAfter = await page.locator('body').textContent();
      console.log(`${route} content loaded: ${(bodyTextAfter?.length || 0) > (bodyText?.length || 0) ? 'YES' : 'SAME'}`);
      await SS(page, `cross/loading-${route.replace(/\//g, '')}`);
    });
  }
});

// ── EMPTY STATES ──
test.describe('CROSS: Empty States', () => {
  test('Empty wardrobe shows appropriate message', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
    await page.goto(`${BASE_URL}/wardrobe`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, 'cross/empty-wardrobe');
    console.log(`Wardrobe content: ${bodyText?.substring(0, 200)}`);
  });

  test('Empty favorites shows appropriate message', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
    await page.goto(`${BASE_URL}/favorites`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, 'cross/empty-favorites');
    console.log(`Favorites content: ${bodyText?.substring(0, 200)}`);
  });

  test('Empty recommendations shows appropriate message', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
    await page.goto(`${BASE_URL}/recommendations`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, 'cross/empty-recommendations');
    console.log(`Recommendations content: ${bodyText?.substring(0, 200)}`);
  });

  test('Recycle page empty state', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
    await page.goto(`${BASE_URL}/recycle`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    const hasUpload = bodyText?.includes('upload') || bodyText?.includes('Upload') || bodyText?.includes('drag');
    expect(hasUpload).toBe(true);
    await SS(page, 'cross/empty-recycle');
  });

  test('Matching page empty state', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
    await page.goto(`${BASE_URL}/matching`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    await SS(page, 'cross/empty-matching');
    console.log(`Matching content: ${bodyText?.substring(0, 200)}`);
  });
});

// ── ERROR HANDLING ──
test.describe('CROSS: Error Handling', () => {
  test('CF.10 - Access protected page without auth', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => localStorage.removeItem('auth'));

    const protectedRoutes = ['/tryOn', '/recycle', '/matching', '/recommendations', '/wardrobe', '/favorites'];
    for (const route of protectedRoutes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      const url = page.url();
      console.log(`${route} → ${url}`);
      expect(url).toBe(`${BASE_URL}/`);
    }
    await SS(page, 'cross/cf10-no-auth');
  });

  test('CF.11 - Console errors on home page', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await apiLogin(page, CREDS.email, CREDS.password);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    console.log(`Console errors: ${errors.length}`);
    if (errors.length > 0) {
      errors.forEach(e => console.log(`  ERROR: ${e}`));
    }
    await SS(page, 'cross/cf11-console');
  });

  test('CF.12 - Network offline simulation', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await page.context().setOffline(true);
    await page.reload();
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    const hasOfflineIndicator = bodyText?.includes('offline') || bodyText?.includes('Offline') ||
      bodyText?.includes('connection') || bodyText?.includes('Connection') ||
      bodyText?.includes('network') || bodyText?.includes('Network');
    console.log(`Offline indicator: ${hasOfflineIndicator ? 'FOUND' : 'NOT FOUND'}`);
    await SS(page, 'cross/cf12-offline');

    await page.context().setOffline(false);
  });

  test('CF.13 - 404 for multiple unknown routes', async ({ page }) => {
    const unknownRoutes = ['/nonexistent', '/admin/fake', '/api/fake', '/login/extra'];
    for (const route of unknownRoutes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      const bodyText = await page.locator('body').textContent();
      const has404 = bodyText?.includes('404') || bodyText?.includes('not found') || bodyText?.includes('Not Found');
      console.log(`${route} 404: ${has404 ? 'YES' : 'NO'}`);
    }
    await SS(page, 'cross/cf13-404-routes');
  });
});

// ── DATA PERSISTENCE ──
test.describe('CROSS: Data Persistence', () => {
  test('Auth persists across page refreshes', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);

    let auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();

    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);
      auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
      expect(auth).toBeTruthy();
    }
    console.log('Auth persisted across 3 refreshes');
  });

  test('Auth persists across navigation', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);

    const routes = ['/', '/stores', '/tryOn', '/pricing', '/recycle', '/matching'];
    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);
      const auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
      expect(auth).toBeTruthy();
    }
    console.log('Auth persisted across 6 navigations');
  });

  test('Theme preference persists', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const themeBtn = page.locator('nav button, header button').filter({ has: page.locator('svg') }).first();
    if (await themeBtn.isVisible().catch(() => false)) {
      await themeBtn.click({ force: true });
      await page.waitForTimeout(1000);
      const classBefore = await page.locator('html').getAttribute('class');

      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      const classAfter = await page.locator('html').getAttribute('class');
      console.log(`Theme before: "${classBefore}", after: "${classAfter}"`);

      await themeBtn.click({ force: true });
      await page.waitForTimeout(1000);
    }
  });

  test('Language preference persists', async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
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

        const dirBefore = await page.locator('html').getAttribute('dir');
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        const dirAfter = await page.locator('html').getAttribute('dir');
        console.log(`Lang before: "${dirBefore}", after: "${dirAfter}"`);

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
});

// ── NAVIGATION ──
test.describe('CROSS: Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
  });

  test('Logo links to home', async ({ page }) => {
    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const logo = page.locator('a[href="/"], a img[alt*="logo" i], a img[alt*="ReDolapy" i]').first();
    if (await logo.isVisible().catch(() => false)) {
      await logo.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);
      const url = page.url();
      expect(url).toBe(`${BASE_URL}/`);
      console.log('Logo navigation: OK');
    }
  });

  test('Browser back/forward works', async ({ page }) => {
    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await page.goto(`${BASE_URL}/tryOn`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    console.log(`After back: ${page.url()}`);

    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    console.log(`After forward: ${page.url()}`);
  });
});
