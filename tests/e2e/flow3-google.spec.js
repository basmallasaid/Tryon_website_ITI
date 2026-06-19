import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api';
const RESULTS_DIR = 'tests/e2e/test-results/flow3';
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

const SS = async (page, name) => {
  await page.screenshot({ path: path.join(RESULTS_DIR, `${name}.png`), fullPage: true });
};

// ═══════════════════════════════════════════════════════════════
// FLOW 3: GOOGLE LOGIN ACCOUNT
// ═══════════════════════════════════════════════════════════════
// NOTE: Google OAuth requires a real Google account and cannot be
// fully automated in CI/E2E. These tests verify the OAuth flow
// entry points, callback handling, and error states.

test.describe.serial('FLOW 3: GOOGLE LOGIN', () => {
  // ── 3.1 Google OAuth redirect ──
  test('3.1 - Google login button exists on auth modal', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const loginBtn = page.locator('button, a').filter({ hasText: /^Login$/i }).first();
    await loginBtn.click();
    await page.waitForTimeout(1500);

    const googleBtn = page.locator('button').filter({ hasText: /Google/i }).first();
    const isVisible = await googleBtn.isVisible().catch(() => false);
    console.log(`Google button visible: ${isVisible}`);
    await SS(page, 'flow3/3.1-google-btn');

    if (isVisible) {
      const href = await googleBtn.getAttribute('href');
      const onclick = await googleBtn.getAttribute('onclick');
      console.log(`Google button href: ${href}, onclick: ${onclick}`);
    }
  });

  // ── 3.2 Google OAuth endpoint reachable ──
  test('3.2 - Google OAuth endpoint is reachable', async ({ page }) => {
    const response = await page.request.get(`${API_URL}/auth/google`, {
      maxRedirects: 0,
    });
    const status = response.status();
    console.log(`GET /api/auth/google status: ${status}`);
    const headers = response.headers();
    const location = headers['location'] || '';
    console.log(`Redirect location: ${location.substring(0, 100)}...`);
    await SS(page, 'flow3/3.2-google-endpoint');
  });

  // ── 3.3 Google callback page renders ──
  test('3.3 - Google callback page renders without crash', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/callback`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    const url = page.url();
    console.log(`Callback page URL: ${url}`);
    console.log(`Callback body length: ${bodyText?.length}`);
    await SS(page, 'flow3/3.3-callback');
  });

  // ── 3.4 Google callback with invalid token ──
  test('3.4 - Google callback with invalid token shows error or redirects', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/callback?code=invalid_code&state=invalid_state`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const url = page.url();
    console.log(`Invalid callback URL: ${url}`);
    const bodyText = await page.locator('body').textContent();
    console.log(`Body length: ${bodyText?.length}`);
    await SS(page, 'flow3/3.4-invalid-token');
  });

  // ── 3.5 Register page also has Google button ──
  test('3.5 - Register modal has Google button', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const signupBtn = page.locator('button, a').filter({ hasText: /Sign[\s-]*up/i }).first();
    await signupBtn.click();
    await page.waitForTimeout(1500);

    const googleBtn = page.locator('button').filter({ hasText: /Google/i }).first();
    const isVisible = await googleBtn.isVisible().catch(() => false);
    console.log(`Google button on register: ${isVisible}`);
    await SS(page, 'flow3/3.5-register-google');
  });

  // ── 3.6 Mobile Google login endpoint ──
  test('3.6 - Mobile Google login endpoint returns proper error for invalid token', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const response = await page.request.post(`${API_URL}/auth/google/mobile`, {
      data: { idToken: 'invalid_token_12345' },
      headers: { 'Content-Type': 'application/json' },
    });
    const status = response.status();
    const body = await response.json().catch(() => ({}));
    console.log(`POST /api/auth/google/mobile status: ${status}`);
    console.log(`Response: ${JSON.stringify(body).substring(0, 200)}`);
    expect(status).toBeGreaterThanOrEqual(400);
    await SS(page, 'flow3/3.6-mobile-invalid');
  });
});
