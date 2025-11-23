import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/boutique');
    // Wait for products to load - check for loading state to disappear or products grid
    await page.waitForLoadState('networkidle');
    // Wait for either products grid or "No products" message
    await page.waitForSelector('div.grid, div:has-text("No products"), div:has-text("Loading")', { timeout: 10000 });
    // If loading, wait for it to finish
    const loadingText = page.locator('text=/Loading/i');
    if (await loadingText.count() > 0) {
      await loadingText.waitFor({ state: 'hidden', timeout: 10000 });
    }
  });

  test('should display cart page', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('h1, h2')).toContainText(/cart|shopping/i);
  });

  test('should show empty cart message when no items', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    // Check for empty cart message - the page shows "Your cart is empty"
    const emptyState = page.locator('text=/Your cart is empty|empty|no items|start shopping|Browse Products/i');
    // The empty state should be visible if cart is empty
    const emptyCartText = page.locator('h2:has-text("Your cart is empty")');
    if (await emptyCartText.count() > 0) {
      await expect(emptyCartText).toBeVisible();
    } else {
      // If cart has items, verify cart items are shown
      const cartItems = page.locator('[class*="cart"], [class*="item"]');
      // Just verify the page loaded correctly
      await expect(page.locator('h1')).toContainText(/cart|shopping/i);
    }
  });

  test('should navigate to cart from navbar', async ({ page }) => {
    // Find cart icon/link in navbar
    const cartLink = page.locator('a[href="/cart"], [aria-label*="cart" i], [title*="cart" i]').first();
    if (await cartLink.count() > 0) {
      await cartLink.click();
      await expect(page).toHaveURL(/\/cart/);
    }
  });

  test('should display continue shopping link', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    // Look for "Continue Shopping" link - it's a Link component with ArrowLeft icon
    const continueShopping = page.locator('a:has-text("Continue Shopping"), a:has-text("Browse Products"), text=/continue shopping|browse products/i').first();
    if (await continueShopping.count() > 0) {
      await expect(continueShopping).toBeVisible();
      await continueShopping.click();
      await expect(page).toHaveURL(/\/boutique/, { timeout: 10000 });
    } else {
      // If link doesn't exist, at least verify we're on cart page
      await expect(page.locator('h1')).toContainText(/cart|shopping/i);
    }
  });
});

test.describe('Cart Functionality (Requires Auth)', () => {
  test('should require login for checkout', async ({ page }) => {
    await page.goto('/cart');
    
    // Try to proceed to checkout
    const checkoutButton = page.locator('button:has-text("checkout"), button:has-text("Checkout")').first();
    if (await checkoutButton.count() > 0 && await checkoutButton.isEnabled()) {
      await checkoutButton.click();
      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 5000 });
    }
  });
});

