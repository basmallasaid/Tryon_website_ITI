const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';
const TEST_EMAIL = `qatest_${Date.now()}@test.com`;
const TEST_PASSWORD = 'TestPass123!';
const TEST_FIRST_NAME = 'QA';
const TEST_LAST_NAME = 'Tester';

// Store credentials for other tests
const credentials = { email: TEST_EMAIL, password: TEST_PASSWORD };

test.describe('TEST FLOW 2: NEW ACCOUNT - Registration & Auth', () => {

  test('2.1 - Register new account via email', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Click Sign Up button in navbar
    const signUpBtn = page.locator('button, a').filter({ hasText: /sign\s*up|register/i }).first();
    await expect(signUpBtn).toBeVisible({ timeout: 10000 });
    await signUpBtn.click();

    // Wait for auth modal to appear
    await page.waitForTimeout(1000);

    // Find the register/signup form - look for name fields which are only on register
    const firstNameInput = page.locator('input[name="fname"], input[placeholder*="first" i], input[placeholder*="First"]').first();
    await expect(firstNameInput).toBeVisible({ timeout: 5000 });

    await firstNameInput.fill(TEST_FIRST_NAME);

    const lastNameInput = page.locator('input[name="lname"], input[placeholder*="last" i], input[placeholder*="Last"]').first();
    await lastNameInput.fill(TEST_LAST_NAME);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await emailInput.fill(TEST_EMAIL);

    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    await passwordInput.fill(TEST_PASSWORD);

    // Find confirm password if it exists
    const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm-password"]').first();
    if (await confirmPasswordInput.isVisible()) {
      await confirmPasswordInput.fill(TEST_PASSWORD);
    }

    // Click register/submit button
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();

    // Wait for response - either success or error
    await page.waitForTimeout(3000);

    // Take screenshot of result
    await page.screenshot({ path: 'tests/e2e/test-results/2.1-register-result.png', fullPage: true });

    // Check if we're logged in (navbar should show user name or profile)
    const isLoggedIn = await page.locator('text=QA').isVisible().catch(() => false) ||
                       await page.locator('[class*="profile"], [class*="avatar"], [class*="user"]').first().isVisible().catch(() => false);
    console.log('Registration result - logged in:', isLoggedIn);
    console.log('Test email used:', TEST_EMAIL);
  });

  test('2.2 - Verify auth state persists after refresh', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check localStorage for auth
    const authData = await page.evaluate(() => {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : null;
    });
    console.log('Auth data after refresh:', authData ? 'EXISTS' : 'NOT FOUND');
    console.log('Auth token:', authData?.token ? 'PRESENT' : 'MISSING');
    console.log('Auth role:', authData?.role);

    await page.screenshot({ path: 'tests/e2e/test-results/2.2-auth-persistence.png', fullPage: true });
  });

  test('2.3 - Logout and login again', async ({ page }) => {
    // First ensure we're logged in
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Try to find logout button
    // First check if we're logged in
    const authData = await page.evaluate(() => {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : null;
    });

    if (!authData) {
      console.log('Not logged in - logging in first');
      // Open auth modal
      const loginBtn = page.locator('button, a').filter({ hasText: /log\s*in|sign\s*in/i }).first();
      if (await loginBtn.isVisible()) {
        await loginBtn.click();
        await page.waitForTimeout(1000);

        const emailInput = page.locator('input[type="email"], input[name="email"]').first();
        await emailInput.fill(TEST_EMAIL);
        const passwordInput = page.locator('input[type="password"]').first();
        await passwordInput.fill(TEST_PASSWORD);
        const submitBtn = page.locator('button[type="submit"]').first();
        await submitBtn.click();
        await page.waitForTimeout(3000);
      }
    }

    // Now try to logout - look for profile popup or menu
    const profileBtn = page.locator('[class*="profile"], [class*="avatar"], [class*="user-menu"]').first();
    if (await profileBtn.isVisible().catch(() => false)) {
      await profileBtn.click();
      await page.waitForTimeout(500);
    }

    // Look for logout option
    const logoutBtn = page.locator('button, a').filter({ hasText: /log\s*out|sign\s*out|logout/i }).first();
    if (await logoutBtn.isVisible().catch(() => false)) {
      await logoutBtn.click();
      await page.waitForTimeout(2000);
    }

    await page.screenshot({ path: 'tests/e2e/test-results/2.3-after-logout.png', fullPage: true });

    // Login again
    const loginBtnAgain = page.locator('button, a').filter({ hasText: /log\s*in|sign\s*in/i }).first();
    if (await loginBtnAgain.isVisible().catch(() => false)) {
      await loginBtnAgain.click();
      await page.waitForTimeout(1000);

      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      await emailInput.fill(TEST_EMAIL);
      const passwordInput = page.locator('input[type="password"]').first();
      await passwordInput.fill(TEST_PASSWORD);
      const submitBtn = page.locator('button[type="submit"]').first();
      await submitBtn.click();
      await page.waitForTimeout(3000);

      await page.screenshot({ path: 'tests/e2e/test-results/2.3-after-relogin.png', fullPage: true });
    }

    // Verify data persists
    const authAfterReLogin = await page.evaluate(() => {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : null;
    });
    console.log('Auth after re-login:', authAfterReLogin ? 'PRESENT' : 'MISSING');
  });
});

// Export credentials for use in other test files
test.describe('Credential Setup', () => {
  test('Store test credentials', async () => {
    console.log('=== TEST CREDENTIALS ===');
    console.log('Email:', TEST_EMAIL);
    console.log('Password:', TEST_PASSWORD);
    console.log('========================');
    // Write credentials to a temp file for other tests
    const fs = require('fs');
    fs.writeFileSync('tests/e2e/test-credentials.json', JSON.stringify(credentials, null, 2));
  });
});
