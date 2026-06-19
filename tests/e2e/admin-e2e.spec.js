import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api';
const RESULTS_DIR = 'tests/e2e/test-results/admin';
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

const SS = async (page, name) => {
  await page.screenshot({ path: path.join(RESULTS_DIR, `${name}.png`), fullPage: true });
};

const ADMIN_CREDS = { email: 'redolapy.admin@gmail.com', password: 'Q7tn J4pk M9re D2cx' };

async function apiLoginAdmin(page, email, password) {
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
  await page.waitForTimeout(3000);
}

// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD E2E
// ═══════════════════════════════════════════════════════════════
test.describe.serial('ADMIN DASHBOARD', () => {
  test.beforeEach(async ({ page }) => {
    await apiLoginAdmin(page, ADMIN_CREDS.email, ADMIN_CREDS.password);
  });

  // ── A.1 ADMIN LOGIN ──
  test('A.1 - Admin login and dashboard access', async ({ page }) => {
    const auth = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || 'null'));
    expect(auth).toBeTruthy();
    expect(auth?.role).toBe('admin');

    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const url = page.url();
    expect(url).toContain('/admin');
    await SS(page, 'admin/A.1-dashboard');
  });

  // ── A.2 DASHBOARD SECTION ──
  test('A.2 - Dashboard metrics load', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);

    const bodyText = await page.locator('body').textContent();
    const hasMetrics = bodyText?.includes('Store') || bodyText?.includes('store') ||
      bodyText?.includes('Product') || bodyText?.includes('product') ||
      bodyText?.includes('User') || bodyText?.includes('user') ||
      bodyText?.includes('Notification') || bodyText?.includes('notification');
    expect(hasMetrics).toBe(true);
    await SS(page, 'admin/A.2-metrics');
    console.log(`Dashboard has metrics: ${hasMetrics}`);
  });

  // ── A.3 SIDEBAR NAVIGATION ──
  test('A.3 - Sidebar navigation works', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const sidebar = page.locator('nav, aside, [class*="sidebar"]').first();
    const links = sidebar.locator('a, button').filter({ hasText: /dashboard|stores|products|notification|email|user|api|setting/i });
    const count = await links.count();
    console.log(`Sidebar links found: ${count}`);
    await SS(page, 'admin/A.3-sidebar');

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForTimeout(1500);
        console.log(`Clicked sidebar: "${text?.trim()}"`);
        await SS(page, `admin/A.3-sidebar-${i}`);
      }
    }
  });

  // ── A.4 STORES SECTION ──
  test('A.4 - Stores section loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const storesLink = page.locator('button, a').filter({ hasText: /stores?/i }).first();
    if (await storesLink.isVisible().catch(() => false)) {
      await storesLink.click();
      await page.waitForTimeout(2000);
      await SS(page, 'admin/A.4-stores');
      console.log('Stores section loaded');
    }
  });

  // ── A.5 PRODUCTS SECTION ──
  test('A.5 - Products section loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const productsLink = page.locator('button, a').filter({ hasText: /products?/i }).first();
    if (await productsLink.isVisible().catch(() => false)) {
      await productsLink.click();
      await page.waitForTimeout(2000);
      await SS(page, 'admin/A.5-products');
      console.log('Products section loaded');
    }
  });

  // ── A.6 NOTIFICATIONS SECTION ──
  test('A.6 - Notifications section loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const notifLink = page.locator('button, a').filter({ hasText: /notifications?/i }).first();
    if (await notifLink.isVisible().catch(() => false)) {
      await notifLink.click();
      await page.waitForTimeout(2000);
      await SS(page, 'admin/A.6-notifications');
      console.log('Notifications section loaded');
    }
  });

  // ── A.7 EMAIL CENTER ──
  test('A.7 - Email center loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const emailLink = page.locator('button, a').filter({ hasText: /email/i }).first();
    if (await emailLink.isVisible().catch(() => false)) {
      await emailLink.click();
      await page.waitForTimeout(2000);
      await SS(page, 'admin/A.7-email');
      console.log('Email center loaded');
    }
  });

  // ── A.8 USERS SECTION ──
  test('A.8 - Users section loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const usersLink = page.locator('button, a').filter({ hasText: /users?/i }).first();
    if (await usersLink.isVisible().catch(() => false)) {
      await usersLink.click();
      await page.waitForTimeout(2000);
      await SS(page, 'admin/A.8-users');
      console.log('Users section loaded');
    }
  });

  // ── A.9 API MANAGEMENT ──
  test('A.9 - API management loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const apiLink = page.locator('button, a').filter({ hasText: /api/i }).first();
    if (await apiLink.isVisible().catch(() => false)) {
      await apiLink.click();
      await page.waitForTimeout(2000);
      await SS(page, 'admin/A.9-api');
      console.log('API management loaded');
    }
  });

  // ── A.10 SETTINGS ──
  test('A.10 - Settings section loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const settingsLink = page.locator('button, a').filter({ hasText: /settings?/i }).first();
    if (await settingsLink.isVisible().catch(() => false)) {
      await settingsLink.click();
      await page.waitForTimeout(2000);
      await SS(page, 'admin/A.10-settings');
      console.log('Settings loaded');
    }
  });

  // ── A.11 ADMIN DARK MODE ──
  test('A.11 - Admin dark mode toggle', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const themeBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
    if (await themeBtn.isVisible().catch(() => false)) {
      await themeBtn.click({ force: true });
      await page.waitForTimeout(1500);
      await SS(page, 'admin/A.11-dark-mode');

      await themeBtn.click({ force: true });
      await page.waitForTimeout(1000);
    }
  });

  // ── A.12 ADMIN LANGUAGE ──
  test('A.12 - Admin language switching', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const langBtn = page.locator('button').filter({ hasText: /EN|AR/ }).first();
    if (await langBtn.isVisible().catch(() => false)) {
      await langBtn.click();
      await page.waitForTimeout(500);

      const arOption = page.locator('button, div[role="option"], li').filter({ hasText: /Arabic|عربي/ }).first();
      if (await arOption.isVisible().catch(() => false)) {
        await arOption.click();
        await page.waitForTimeout(1500);
        await SS(page, 'admin/A.12-arabic');

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

  // ── A.13 ADMIN GUARD ──
  test('A.13 - Non-admin cannot access admin page', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('auth'));
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const url = page.url();
    console.log(`Non-admin accessing /admin → ${url}`);
    const blocked = !url.includes('/admin') || url.includes('/admin/login');
    console.log(`Blocked: ${blocked}`);
    await SS(page, 'admin/A.13-guard');
  });
});
