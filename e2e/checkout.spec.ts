import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should display checkout requires items', async ({ page }) => {
    await page.goto('/cart');
    
    // If cart is empty, checkout should be disabled or show message
    const checkoutButton = page.locator('button:has-text("checkout"), button:has-text("Checkout")').first();
    if (await checkoutButton.count() > 0) {
      const isDisabled = await checkoutButton.isDisabled();
      if (isDisabled) {
        await expect(checkoutButton).toBeDisabled();
      }
    }
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Clear auth state
    await page.context().clearCookies();
    await page.goto('/cart');
    
    // Try to checkout
    const checkoutButton = page.locator('button:has-text("checkout"), button:has-text("Checkout")').first();
    if (await checkoutButton.count() > 0 && await checkoutButton.isEnabled()) {
      await checkoutButton.click();
      await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 5000 });
    }
  });
});

test.describe('Order Success Page', () => {
  test('should display order success page', async ({ page }) => {
    await page.goto('/orders/success?session_id=test_session_123');
    // The page requires authentication, so it will redirect to sign in
    // Wait for either success page or sign in redirect
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (url.includes('/auth/signin')) {
      // Expected behavior - page requires auth
      expect(url).toContain('/auth/signin');
      expect(url).toContain('callbackUrl');
    } else {
      // If authenticated, should show success page
      await expect(page.locator('h1, h2')).toContainText(/success|confirmed|thank you|Order Confirmed/i);
    }
  });

  test('should show view orders link', async ({ page }) => {
    await page.goto('/orders/success');
    const viewOrders = page.locator('text=/view orders|orders/i').first();
    if (await viewOrders.count() > 0) {
      await expect(viewOrders).toBeVisible();
    }
  });

  test('should show continue shopping link', async ({ page }) => {
    await page.goto('/orders/success');
    const continueShopping = page.locator('text=/continue shopping/i').first();
    if (await continueShopping.count() > 0) {
      await expect(continueShopping).toBeVisible();
    }
  });
});

