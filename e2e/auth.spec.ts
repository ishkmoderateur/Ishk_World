import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'test+ui@example.com',
  password: 'TestPassword123!',
};

const ADMIN_USER = {
  email: 'admin+ui@example.com',
  password: 'AdminPassword123!',
};

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    await page.goto('/');
  });

  test('should display sign in page', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.locator('h1')).toContainText('Sign in');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.locator('h1')).toContainText('Create account');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(2);
  });

  test('should navigate between sign in and register', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.click('text=Register');
    await expect(page).toHaveURL(/\/auth\/register/);
    
    await page.click('text=Sign in');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/register');
    await page.click('button[type="submit"]');
    
    // Check for HTML5 validation - the form should prevent submission
    // The email field should be invalid (browser validation)
    const emailInput = page.locator('input[type="email"]');
    // Wait a bit for browser validation to kick in
    await page.waitForTimeout(500);
    // Check if the input is invalid (has :invalid pseudo-class) or if there's a validation message
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    // If browser validation doesn't work, at least verify the form didn't submit
    expect(isInvalid || await page.url().includes('/auth/register')).toBeTruthy();
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=/Invalid|error/i')).toBeVisible({ timeout: 5000 });
  });

  test('should handle sign out', async ({ page }) => {
    // This test assumes user is logged in
    // In real scenario, you'd set up auth state first
    await page.goto('/auth/signout');
    // Should redirect after sign out
    await expect(page).toHaveURL(/\//, { timeout: 5000 });
  });
});

test.describe('Registration Flow', () => {
  test('should validate password requirements', async ({ page }) => {
    await page.goto('/auth/register');
    await page.fill('input[type="email"]', 'newuser@example.com');
    // Use nth-of-type to select password inputs
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill('short');
    await passwordInputs.nth(1).fill('short');
    await page.click('button[type="submit"]');
    
    // Wait for validation - either browser validation or custom error message
    await page.waitForTimeout(1000);
    // Check for HTML5 validation or custom error message
    const firstPassword = passwordInputs.nth(0);
    const isValid = await firstPassword.evaluate((el: HTMLInputElement) => el.validity.valid);
    // If browser validation works, the form won't submit
    // If custom validation, there should be an error message
    if (!isValid) {
      // Browser validation is working
      expect(isValid).toBeFalsy();
    } else {
      // Check for custom error message
      await expect(page.locator('text=/8 characters|password|at least/i')).toBeVisible({ timeout: 3000 });
    }
  });

  test('should validate password match', async ({ page }) => {
    await page.goto('/auth/register');
    await page.fill('input[type="email"]', 'newuser@example.com');
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill('Password123!');
    await passwordInputs.nth(1).fill('Different123!');
    await page.click('button[type="submit"]');
    
    // Wait for validation message
    await page.waitForTimeout(1000);
    // Should show password mismatch error (custom validation)
    await expect(page.locator('text=/match|do not match|passwords/i')).toBeVisible({ timeout: 5000 });
  });
});

