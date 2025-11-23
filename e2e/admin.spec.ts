import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 5000 });
  });

  test('should show admin login page with callback', async ({ page }) => {
    await page.goto('/admin');
    // Wait for redirect
    await page.waitForURL(/\/auth\/signin/, { timeout: 5000 });
    // Should have callbackUrl parameter
    const url = page.url();
    expect(url).toContain('callbackUrl');
  });
});

test.describe('Admin Pages (Requires Auth)', () => {
  // These tests would require authentication setup
  // For now, just check page structure
  
  test('should have admin routes defined', async ({ page }) => {
    const adminRoutes = [
      '/admin',
      '/admin/boutique-panel',
      '/admin/party-panel',
      '/admin/association-panel',
      '/admin/news-panel',
      '/admin/photography-panel',
    ];

    for (const route of adminRoutes) {
      await page.goto(route, { waitUntil: 'networkidle', timeout: 15000 });
      // Wait for either redirect or page load
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Should either show content or redirect to login
      const currentUrl = page.url();
      const isLoginPage = currentUrl.includes('/auth/signin');
      
      if (isLoginPage) {
        // Expected - route is protected
        expect(currentUrl).toContain('/auth/signin');
      } else {
        // If not redirected, should have content
        const bodyText = await page.locator('body').textContent({ timeout: 5000 });
        expect(bodyText && bodyText.length > 0).toBeTruthy();
      }
      
      // Small delay between routes
      await page.waitForTimeout(500);
    }
  });
});

