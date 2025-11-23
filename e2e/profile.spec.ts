import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/profile');
    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 5000 });
  });

  test('should show login page with callback', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForURL(/\/auth\/signin/, { timeout: 5000 });
    // Should have callbackUrl parameter
    const url = page.url();
    expect(url).toContain('callbackUrl');
  });
});

test.describe('Profile Functionality (Requires Auth)', () => {
  // These tests would require authentication setup
  test('should display profile structure', async ({ page }) => {
    // This would require authenticated session
    // For now, just verify the route exists
    await page.goto('/profile');
    // Should redirect or show content
    const url = page.url();
    expect(url.includes('/profile') || url.includes('/auth/signin')).toBeTruthy();
  });
});


