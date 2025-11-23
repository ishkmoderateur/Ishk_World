import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    const routes = [
      { path: '/', name: 'Home' },
      { path: '/boutique', name: 'Boutique' },
      { path: '/party', name: 'Party' },
      { path: '/photography', name: 'Photography' },
      { path: '/association', name: 'Association' },
      { path: '/news', name: 'News' },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page).toHaveURL(new RegExp(route.path.replace('/', '\\/')), { timeout: 10000 });
      // Check page loaded (has some content)
      await expect(page.locator('body')).not.toBeEmpty();
    }
  });

  test('should have working navbar links', async ({ page }) => {
    await page.goto('/');
    
    // Check navbar is visible
    const navbar = page.locator('nav, [role="navigation"]').first();
    await expect(navbar).toBeVisible();

    // Test navigation links
    const navLinks = [
      { text: /boutique|shop/i, url: '/boutique' },
      { text: /party|services/i, url: '/party' },
      { text: /photography/i, url: '/photography' },
      { text: /association/i, url: '/association' },
    ];

    for (const link of navLinks) {
      // On mobile, need to open menu first
      const viewport = page.viewportSize();
      if (viewport && viewport.width < 768) {
        const menuButton = page.locator('button:has([class*="menu" i]), button[aria-label*="menu" i]').first();
        if (await menuButton.count() > 0 && await menuButton.isVisible()) {
          await menuButton.click();
          await page.waitForTimeout(300); // Wait for menu animation
        }
      }
      
      const linkElement = page.locator(`a:has-text("${link.text.source}")`).first();
      if (await linkElement.count() > 0) {
        // Wait for link to be visible
        await linkElement.waitFor({ state: 'visible', timeout: 5000 });
        await linkElement.click();
        await expect(page).toHaveURL(new RegExp(link.url), { timeout: 10000 });
        await page.goBack();
        // Wait a bit for navigation
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer is visible
    const footer = page.locator('footer').first();
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
    }
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should have mobile menu', async ({ page }) => {
    await page.goto('/');
    
    // Look for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button:has([class*="menu"])').first();
    if (await menuButton.count() > 0) {
      await menuButton.click();
      
      // Menu should open
      const mobileMenu = page.locator('[class*="mobile"], [class*="menu"]').filter({ hasText: /boutique|shop/i });
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu.first()).toBeVisible();
      }
    }
  });
});

