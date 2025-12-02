import { test, expect } from '@playwright/test';

test.describe('Navigation to Registration and Login', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any stored tokens to ensure we test as unauthenticated user
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.reload();
  });

  test('clicking Get Started button navigates to /register page as unauthenticated user', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for the page to load and find the Get Started button
    const getStartedButton = page.getByRole('button', { name: 'Get Started' });
    await expect(getStartedButton).toBeVisible();

    // Click the Get Started button
    await getStartedButton.click();

    // Verify navigation to /register
    await expect(page).toHaveURL('/register');

    // Verify the registration page content is displayed
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
  });

  test('clicking Login button navigates to /login page as unauthenticated user', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for the page to load and find the Login button
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();

    // Click the Login button
    await loginButton.click();

    // Verify navigation to /login
    await expect(page).toHaveURL('/login');

    // Verify the login page content is displayed
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
  });

  test('CTA buttons are rendered using FuturisticButton component with correct styling', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check Get Started button has neon variant styling
    const getStartedButton = page.getByRole('button', { name: 'Get Started' });
    await expect(getStartedButton).toBeVisible();
    await expect(getStartedButton).toHaveClass(/bg-gradient-to-r/);
    await expect(getStartedButton).toHaveClass(/from-indigo-500/);
    await expect(getStartedButton).toHaveClass(/to-purple-600/);

    // Check Login button has outline variant styling
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveClass(/border-2/);
    await expect(loginButton).toHaveClass(/border-indigo-500/);
  });

  test('hero section displays CTA buttons correctly', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Verify hero headline is visible
    await expect(page.getByText('Simplify Your Links')).toBeVisible();

    // Verify both CTA buttons are present in the hero section
    const getStartedButton = page.getByRole('button', { name: 'Get Started' });
    const loginButton = page.getByRole('button', { name: 'Login' });

    await expect(getStartedButton).toBeVisible();
    await expect(loginButton).toBeVisible();
  });
});
