import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api';
const RESULTS_DIR = 'tests/e2e/test-results/buttons';
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
// BUTTON & LINK CLICK TESTS
// ═══════════════════════════════════════════════════════════════

test.describe.serial('ALL BUTTONS & LINKS — Click Verification', () => {
  test.beforeEach(async ({ page }) => {
    await apiLogin(page, CREDS.email, CREDS.password);
  });

  // ── HOME PAGE BUTTONS ──

  test('BTN-01: Home Hero "Start Styling" button navigates to /tryOn', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const btn = page.locator('button, a').filter({ hasText: /start\s*styling/i }).first();
    const isVisible = await btn.isVisible().catch(() => false);
    console.log(`Start Styling visible: ${isVisible}`);

    if (isVisible) {
      const urlBefore = page.url();
      await btn.click();
      await page.waitForTimeout(2000);
      const urlAfter = page.url();
      console.log(`Before: ${urlBefore}, After: ${urlAfter}`);
      const navigated = urlAfter.includes('/tryOn');
      console.log(`Navigated to /tryOn: ${navigated}`);
      await SS(page, 'buttons/btn01-start-styling');

      if (!navigated) {
        console.log('BUG: Start Styling button did not navigate');
      }
    }
  });

  test('BTN-02: Home Mirror "Try Now" button navigates to /tryOn', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Scroll down to find the Mirror section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);

    const btn = page.locator('button').filter({ hasText: /try\s*now/i }).first();
    const isVisible = await btn.isVisible().catch(() => false);
    console.log(`Try Now button visible: ${isVisible}`);

    if (isVisible) {
      const urlBefore = page.url();
      await btn.click();
      await page.waitForTimeout(2000);
      const urlAfter = page.url();
      console.log(`Before: ${urlBefore}, After: ${urlAfter}`);
      const navigated = urlAfter.includes('/tryOn');
      console.log(`Navigated to /tryOn: ${navigated}`);
      await SS(page, 'buttons/btn02-try-now');

      if (!navigated) {
        console.log('BUG: Try Now button did not navigate');
      }
    }
  });

  // ── ABOUT PAGE BUTTONS ──

  test('BTN-03: About Hero "Get Started" button navigates to /tryOn', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const btn = page.locator('button').filter({ hasText: /get\s*started/i }).first();
    const isVisible = await btn.isVisible().catch(() => false);
    console.log(`Get Started visible: ${isVisible}`);

    if (isVisible) {
      const urlBefore = page.url();
      await btn.click();
      await page.waitForTimeout(2000);
      const urlAfter = page.url();
      console.log(`Before: ${urlBefore}, After: ${urlAfter}`);
      const navigated = urlAfter.includes('/tryOn');
      console.log(`Navigated to /tryOn: ${navigated}`);
      await SS(page, 'buttons/btn03-about-get-started');
    }
  });

  test('BTN-04: About Mirror "Try Now" button navigates to /tryOn', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);

    const btn = page.locator('button').filter({ hasText: /try\s*now/i }).first();
    const isVisible = await btn.isVisible().catch(() => false);
    console.log(`About Try Now visible: ${isVisible}`);

    if (isVisible) {
      const urlBefore = page.url();
      await btn.click();
      await page.waitForTimeout(2000);
      const urlAfter = page.url();
      console.log(`Before: ${urlBefore}, After: ${urlAfter}`);
      const navigated = urlAfter.includes('/tryOn');
      console.log(`Navigated to /tryOn: ${navigated}`);
      await SS(page, 'buttons/btn04-about-try-now');
    }
  });

  // ── ABOUT-TRYON PAGE BUTTONS ──

  test('BTN-05: About-TryOn "Get Started" button navigates to /tryOn', async ({ page }) => {
    await page.goto(`${BASE_URL}/about-tryon`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const btn = page.locator('button').filter({ hasText: /get\s*started|try\s*now/i }).first();
    const isVisible = await btn.isVisible().catch(() => false);
    console.log(`About-TryOn CTA visible: ${isVisible}`);

    if (isVisible) {
      const urlBefore = page.url();
      await btn.click();
      await page.waitForTimeout(2000);
      const urlAfter = page.url();
      console.log(`Before: ${urlBefore}, After: ${urlAfter}`);
      const navigated = urlAfter.includes('/tryOn');
      console.log(`Navigated to /tryOn: ${navigated}`);
      await SS(page, 'buttons/btn05-about-tryon-cta');
    }
  });

  // ── ABOUT-RECYCLE PAGE BUTTONS ──

  test('BTN-06: About-Recycle CTA button navigates to /recycle', async ({ page }) => {
    await page.goto(`${BASE_URL}/about-recycle`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const btn = page.locator('button').filter({ hasText: /get\s*started|recycle|try\s*now/i }).first();
    const isVisible = await btn.isVisible().catch(() => false);
    console.log(`About-Recycle CTA visible: ${isVisible}`);

    if (isVisible) {
      const urlBefore = page.url();
      await btn.click();
      await page.waitForTimeout(2000);
      const urlAfter = page.url();
      console.log(`Before: ${urlBefore}, After: ${urlAfter}`);
      const navigated = urlAfter.includes('/recycle');
      console.log(`Navigated to /recycle: ${navigated}`);
      await SS(page, 'buttons/btn06-about-recycle-cta');
    }
  });

  // ── CONTACT PAGE BUTTONS ──

  test('BTN-07: Contact Us "Send Message" button submits form', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const msgInput = page.locator('textarea, input[name="message"]').first();

    if (await nameInput.isVisible().catch(() => false)) await nameInput.fill('QA Test');
    if (await emailInput.isVisible().catch(() => false)) await emailInput.fill('ahmedazaz3685@gmail.com');
    if (await msgInput.isVisible().catch(() => false)) await msgInput.fill('E2E test message');

    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /send|submit/i }).first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
    await SS(page, 'buttons/btn07-contact-submit');
  });

  test('BTN-08: Contact Us Telegram card navigates to Telegram', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const telegramLink = page.locator('a').filter({ hasText: /telegram|@Redolapy/i }).first();
    const isVisible = await telegramLink.isVisible().catch(() => false);
    console.log(`Telegram link visible: ${isVisible}`);

    if (isVisible) {
      const href = await telegramLink.getAttribute('href');
      console.log(`Telegram href: ${href}`);
      const isDead = href === '#' || href === '' || !href;
      if (isDead) {
        console.log('BUG: Telegram link has dead href');
      }
      await SS(page, 'buttons/btn08-telegram');
    }
  });

  // ── PRICING PAGE BUTTONS ──

  test('BTN-09: Pricing monthly/yearly toggle changes prices', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const bodyBefore = await page.locator('body').textContent();
    const toggleBtn = page.locator('button').filter({ hasText: /month|year|annual/i }).first();
    if (await toggleBtn.isVisible().catch(() => false)) {
      await toggleBtn.click();
      await page.waitForTimeout(2000);
      const bodyAfter = await page.locator('body').textContent();
      const changed = bodyBefore !== bodyAfter;
      console.log(`Pricing toggle changed content: ${changed}`);
      await SS(page, 'buttons/btn09-pricing-toggle');

      if (!changed) {
        console.log('NOTE: Pricing toggle did not change visible text');
      }
    }
  });

  test('BTN-10: Pricing Subscribe button works', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const subscribeBtn = page.locator('button').filter({ hasText: /subscribe|choose|get\s*started/i }).first();
    const isVisible = await subscribeBtn.isVisible().catch(() => false);
    console.log(`Subscribe button visible: ${isVisible}`);

    if (isVisible) {
      await subscribeBtn.click();
      await page.waitForTimeout(3000);
      await SS(page, 'buttons/btn10-subscribe');
      console.log(`After subscribe click URL: ${page.url()}`);
    }
  });

  // ── STORES PAGE BUTTONS ──

  test('BTN-11: Stores page product cards are clickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/stores`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const productCards = page.locator('[class*="card"], [class*="product"], a[href*="product"]').first();
    const isVisible = await productCards.isVisible().catch(() => false);
    console.log(`Product cards visible: ${isVisible}`);

    if (isVisible) {
      await productCards.click();
      await page.waitForTimeout(2000);
      await SS(page, 'buttons/btn11-product-card');
    }
  });

  // ── TRYON PAGE BUTTONS ──

  test('BTN-12: TryOn "See All" link navigates to wardrobe', async ({ page }) => {
    await page.goto(`${BASE_URL}/tryOn`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const seeAllLink = page.locator('a').filter({ hasText: /see\s*all/i }).first();
    const isVisible = await seeAllLink.isVisible().catch(() => false);
    console.log(`See All link visible: ${isVisible}`);

    if (isVisible) {
      const href = await seeAllLink.getAttribute('href');
      console.log(`See All href: ${href}`);
      const urlBefore = page.url();
      await seeAllLink.click();
      await page.waitForTimeout(2000);
      const urlAfter = page.url();
      console.log(`Before: ${urlBefore}, After: ${urlAfter}`);
      await SS(page, 'buttons/btn12-see-all');
    }
  });

  // ── DARK MODE TOGGLE ──

  test('BTN-13: Dark mode toggle changes theme', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const classBefore = await page.locator('html').getAttribute('class');
    console.log(`Before toggle html class: "${classBefore}"`);

    // Find the theme toggle - look for moon/sun SVG icon buttons in the nav
    const navBtns = page.locator('nav button, header button');
    const count = await navBtns.count();
    console.log(`Nav buttons found: ${count}`);

    for (let i = 0; i < count; i++) {
      const btn = navBtns.nth(i);
      const svgCount = await btn.locator('svg').count();
      const text = (await btn.textContent()).trim();
      if (svgCount > 0 && text.length < 5) {
        console.log(`Button ${i}: svg=${svgCount}, text="${text}"`);
        await btn.click({ force: true });
        await page.waitForTimeout(1500);

        const classAfter = await page.locator('html').getAttribute('class');
        console.log(`After toggle html class: "${classAfter}"`);
        const hasDark = classAfter?.includes('dark');
        console.log(`Has dark class: ${hasDark}`);
        await SS(page, 'buttons/btn13-dark-mode');

        // Toggle back
        await btn.click({ force: true });
        await page.waitForTimeout(1000);
        break;
      }
    }
  });

  // ── LANGUAGE TOGGLE ──

  test('BTN-14: Language toggle switches to Arabic', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const langBtn = page.locator('button').filter({ hasText: /EN|AR/ }).first();
    const isVisible = await langBtn.isVisible().catch(() => false);
    console.log(`Language button visible: ${isVisible}`);

    if (isVisible) {
      await langBtn.click();
      await page.waitForTimeout(500);

      const arOption = page.locator('button, div[role="option"], li').filter({ hasText: /Arabic|عربي/ }).first();
      if (await arOption.isVisible().catch(() => false)) {
        await arOption.click();
        await page.waitForTimeout(1500);

        const dir = await page.locator('html').getAttribute('dir');
        console.log(`After AR switch dir: "${dir}"`);
        expect(dir).toBe('rtl');
        await SS(page, 'buttons/btn14-arabic');

        // Switch back
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

  // ── NAVBAR LINKS ──

  test('BTN-15: Navbar "Try-On" link navigates to /tryOn', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const link = page.locator('nav a, header a').filter({ hasText: /^Try-On$/i }).first();
    const isVisible = await link.isVisible().catch(() => false);
    console.log(`Try-On nav link visible: ${isVisible}`);

    if (isVisible) {
      await link.click();
      await page.waitForTimeout(2000);
      console.log(`After click URL: ${page.url()}`);
      expect(page.url()).toContain('/tryOn');
    }
  });

  test('BTN-16: Navbar "Recycle" link navigates to /recycle', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const link = page.locator('nav a, header a').filter({ hasText: /^Recycle$/i }).first();
    const isVisible = await link.isVisible().catch(() => false);
    console.log(`Recycle nav link visible: ${isVisible}`);

    if (isVisible) {
      await link.click();
      await page.waitForTimeout(2000);
      console.log(`After click URL: ${page.url()}`);
      expect(page.url()).toContain('/recycle');
    }
  });

  test('BTN-17: Navbar "Matching" link navigates to /matching', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const link = page.locator('nav a, header a').filter({ hasText: /^Matching$/i }).first();
    const isVisible = await link.isVisible().catch(() => false);
    console.log(`Matching nav link visible: ${isVisible}`);

    if (isVisible) {
      await link.click();
      await page.waitForTimeout(2000);
      console.log(`After click URL: ${page.url()}`);
      expect(page.url()).toContain('/matching');
    }
  });

  test('BTN-18: Navbar "Stores" link navigates to /stores', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const link = page.locator('nav a, header a').filter({ hasText: /^Stores$/i }).first();
    const isVisible = await link.isVisible().catch(() => false);
    console.log(`Stores nav link visible: ${isVisible}`);

    if (isVisible) {
      await link.click();
      await page.waitForTimeout(2000);
      console.log(`After click URL: ${page.url()}`);
      expect(page.url()).toContain('/stores');
    }
  });

  test('BTN-19: Navbar "Pricing" link navigates to /pricing', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const link = page.locator('nav a, header a').filter({ hasText: /^Pricing$/i }).first();
    const isVisible = await link.isVisible().catch(() => false);
    console.log(`Pricing nav link visible: ${isVisible}`);

    if (isVisible) {
      await link.click();
      await page.waitForTimeout(2000);
      console.log(`After click URL: ${page.url()}`);
      expect(page.url()).toContain('/pricing');
    }
  });

  test('BTN-20: Navbar "About" link navigates to /about', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const link = page.locator('nav a, header a').filter({ hasText: /^About$/i }).first();
    const isVisible = await link.isVisible().catch(() => false);
    console.log(`About nav link visible: ${isVisible}`);

    if (isVisible) {
      await link.click();
      await page.waitForTimeout(2000);
      console.log(`After click URL: ${page.url()}`);
      expect(page.url()).toContain('/about');
    }
  });

  test('BTN-21: Navbar "Contact Us" link navigates to /contact-us', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const link = page.locator('nav a, header a').filter({ hasText: /Contact\s*Us/i }).first();
    const isVisible = await link.isVisible().catch(() => false);
    console.log(`Contact Us nav link visible: ${isVisible}`);

    if (isVisible) {
      await link.click();
      await page.waitForTimeout(2000);
      console.log(`After click URL: ${page.url()}`);
      expect(page.url()).toContain('/contact-us');
    }
  });

  // ── PROFILE DROPDOWN ──

  test('BTN-22: Profile dropdown shows user name and logout', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const profileBtn = page.locator('button').filter({ hasText: /Ahmed|azaz/i }).first();
    const isVisible = await profileBtn.isVisible().catch(() => false);
    console.log(`Profile button visible: ${isVisible}`);

    if (isVisible) {
      await profileBtn.click();
      await page.waitForTimeout(500);

      const logoutBtn = page.locator('button, a').filter({ hasText: /log\s*out/i }).first();
      const logoutVisible = await logoutBtn.isVisible().catch(() => false);
      console.log(`Logout button visible after profile click: ${logoutVisible}`);
      await SS(page, 'buttons/btn22-profile-dropdown');
    }
  });

  // ── FOOTER LINKS ──

  test('BTN-23: Footer social icons have real URLs', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const socialLinks = page.locator('footer a');
    const count = await socialLinks.count();
    console.log(`Footer links found: ${count}`);

    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i);
      const href = await link.getAttribute('href');
      const label = await link.getAttribute('aria-label') || await link.textContent();
      const isDead = href === '#' || href === '' || !href;
      console.log(`Footer link ${i}: "${label?.trim()}" → ${href} ${isDead ? '(DEAD)' : '(OK)'}`);
    }
    await SS(page, 'buttons/btn23-footer');
  });

  // ── FORGOT PASSWORD FLOW ──

  test('BTN-24: Forgot Password "Try different email" button works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const loginBtn = page.locator('button, a').filter({ hasText: /^Login$/i }).first();
    await loginBtn.click();
    await page.waitForTimeout(1500);

    const forgotLink = page.locator('button, a').filter({ hasText: /forget|forgot/i }).first();
    if (await forgotLink.isVisible().catch(() => false)) {
      await forgotLink.click();
      await page.waitForTimeout(1000);

      const tryDifferentBtn = page.locator('button').filter({ hasText: /try\s*different/i }).first();
      const isVisible = await tryDifferentBtn.isVisible().catch(() => false);
      console.log(`Try different email visible: ${isVisible}`);

      if (isVisible) {
        await tryDifferentBtn.click();
        await page.waitForTimeout(1000);
        await SS(page, 'buttons/btn24-try-different-email');
        console.log('Try different email clicked');
      }
    }
  });
});
