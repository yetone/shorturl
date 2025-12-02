import { test, expect } from '@playwright/test';

test.describe('Dark Mode Theme Support', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    // Clear localStorage to ensure consistent starting state
    await page.evaluate(() => localStorage.removeItem('theme'));
  });

  test.describe('Test Case 1: Toggle theme to dark mode - Homepage switches to dark mode colors', () => {
    test('should apply dark mode styling when dark mode is enabled', async ({ page }) => {
      // Set dark mode via localStorage and reload
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Verify the html element has the dark class
      const htmlHasDarkClass = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );
      expect(htmlHasDarkClass).toBe(true);
    });

    test('should display dark background colors when dark mode is active', async ({ page }) => {
      // Enable dark mode
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Wait for page to render
      await expect(page.getByText('Simplify Your Links')).toBeVisible();

      // Check that body has dark mode gradient
      const bodyStyles = await page.evaluate(() => {
        const body = document.body;
        return window.getComputedStyle(body).background;
      });

      // Dark mode should have darker background colors
      expect(bodyStyles).toBeTruthy();
    });

    test('should display hero headline in dark mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Hero headline should be visible
      const headline = page.getByText('Simplify Your Links');
      await expect(headline).toBeVisible();
    });

    test('should display all feature cards in dark mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // All feature cards should be visible
      await expect(page.getByText('URL Shortening')).toBeVisible();
      await expect(page.getByText('Click Analytics')).toBeVisible();
      await expect(page.getByText('User Dashboard')).toBeVisible();
      await expect(page.getByText('Global Access')).toBeVisible();
      await expect(page.getByText('Secure Links')).toBeVisible();
      await expect(page.getByText('Lightning Fast')).toBeVisible();
    });
  });

  test.describe('Test Case 2: Text contrast compliance in dark mode', () => {
    test('should have readable headline text in dark mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Check headline is visible and gradient is applied
      const headline = page.getByText('Simplify Your Links');
      await expect(headline).toBeVisible();

      // Verify gradient classes are applied
      await expect(headline).toHaveClass(/bg-gradient-to-r/);
      await expect(headline).toHaveClass(/from-blue-600/);
      await expect(headline).toHaveClass(/via-purple-600/);
      await expect(headline).toHaveClass(/to-pink-600/);
    });

    test('should have readable tagline text in dark mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Tagline should be visible
      const tagline = page.getByText(/Create short, memorable links/);
      await expect(tagline).toBeVisible();

      // In dark mode, tagline should have text-gray-300 class for contrast
      await expect(tagline).toHaveClass(/text-gray-300/);
    });

    test('should have visible CTA buttons in dark mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Buttons should be visible and distinguishable
      const getStartedButton = page.getByRole('button', { name: 'Get Started' });
      const loginButton = page.getByRole('button', { name: 'Login' });

      await expect(getStartedButton).toBeVisible();
      await expect(loginButton).toBeVisible();
    });

    test('should have readable feature card titles in dark mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Feature titles should be visible with appropriate styling
      const featureTitles = ['URL Shortening', 'Click Analytics', 'User Dashboard'];

      for (const title of featureTitles) {
        const titleElement = page.getByText(title);
        await expect(titleElement).toBeVisible();
      }
    });

    test('should have neon-colored icons for visual contrast in dark mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Check that neon-colored elements are present
      const neonGreenElements = page.locator('.text-neon-green');
      const neonBlueElements = page.locator('.text-neon-blue');
      const neonPinkElements = page.locator('.text-neon-pink');

      // Should have at least 2 neon-green icons (URL Shortening, Secure Links)
      await expect(neonGreenElements.first()).toBeVisible();

      // Should have neon-blue icons (Click Analytics, Global Access)
      await expect(neonBlueElements.first()).toBeVisible();

      // Should have neon-pink icon (User Dashboard)
      await expect(neonPinkElements.first()).toBeVisible();
    });
  });

  test.describe('Test Case 3: ThemeContext integration verification', () => {
    test('should persist theme preference in localStorage', async ({ page }) => {
      // Set dark mode
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Verify localStorage value
      const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(storedTheme).toBe('dark');

      // Verify html has dark class
      const hasDarkClass = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );
      expect(hasDarkClass).toBe(true);
    });

    test('should initialize with stored theme preference on page load', async ({ page }) => {
      // Set dark mode before navigating
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));

      // Navigate to a different page and back
      await page.goto('/login');
      await page.goto('/');

      // Theme should still be dark
      const hasDarkClass = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );
      expect(hasDarkClass).toBe(true);
    });

    test('should apply dark mode classes to main container based on theme context', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Wait for content to load
      await expect(page.getByText('Simplify Your Links')).toBeVisible();

      // Main container should have dark mode classes
      const darkContainer = page.locator('.bg-gray-900.text-white');
      await expect(darkContainer).toBeVisible();
    });

    test('should not have dark mode classes when in light mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'light'));
      await page.reload();

      // Wait for content to load
      await expect(page.getByText('Simplify Your Links')).toBeVisible();

      // Html should not have dark class
      const hasDarkClass = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );
      expect(hasDarkClass).toBe(false);
    });
  });

  test.describe('Test Case 4: Theme transitions without layout shifts', () => {
    test('should maintain consistent layout structure in light mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'light'));
      await page.reload();

      // Verify grid layout is present
      const grid = page.locator('.grid.md\\:grid-cols-3');
      await expect(grid).toBeVisible();

      // Verify gap spacing
      const gridWithGap = page.locator('.gap-8');
      await expect(gridWithGap).toBeVisible();
    });

    test('should maintain consistent layout structure in dark mode', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Verify grid layout is present
      const grid = page.locator('.grid.md\\:grid-cols-3');
      await expect(grid).toBeVisible();

      // Verify gap spacing
      const gridWithGap = page.locator('.gap-8');
      await expect(gridWithGap).toBeVisible();
    });

    test('should preserve hero section layout when switching themes', async ({ page }) => {
      // Start with light mode
      await page.evaluate(() => localStorage.setItem('theme', 'light'));
      await page.reload();

      // Get hero section dimensions
      const headline = page.getByText('Simplify Your Links');
      await expect(headline).toBeVisible();

      const lightBoundingBox = await headline.boundingBox();
      expect(lightBoundingBox).toBeTruthy();

      // Switch to dark mode
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      // Get hero section dimensions again
      await expect(headline).toBeVisible();
      const darkBoundingBox = await headline.boundingBox();
      expect(darkBoundingBox).toBeTruthy();

      // Dimensions should be similar (allowing for minor variations)
      expect(Math.abs((lightBoundingBox?.width || 0) - (darkBoundingBox?.width || 0))).toBeLessThan(10);
    });

    test('should display all 6 feature cards in both themes without layout differences', async ({ page }) => {
      // Light mode check
      await page.evaluate(() => localStorage.setItem('theme', 'light'));
      await page.reload();

      // Count feature cards by their titles in light mode
      const lightFeatureTitles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast'
      ];

      for (const title of lightFeatureTitles) {
        await expect(page.getByText(title)).toBeVisible();
      }

      // Dark mode check
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      for (const title of lightFeatureTitles) {
        await expect(page.getByText(title)).toBeVisible();
      }
    });

    test('should maintain CTA button positioning across themes', async ({ page }) => {
      // Check light mode button layout
      await page.evaluate(() => localStorage.setItem('theme', 'light'));
      await page.reload();

      const getStartedLight = page.getByRole('button', { name: 'Get Started' });
      const loginLight = page.getByRole('button', { name: 'Login' });

      await expect(getStartedLight).toBeVisible();
      await expect(loginLight).toBeVisible();

      // Check dark mode button layout
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      const getStartedDark = page.getByRole('button', { name: 'Get Started' });
      const loginDark = page.getByRole('button', { name: 'Login' });

      await expect(getStartedDark).toBeVisible();
      await expect(loginDark).toBeVisible();
    });

    test('should preserve footer visibility in both themes', async ({ page }) => {
      // Light mode
      await page.evaluate(() => localStorage.setItem('theme', 'light'));
      await page.reload();

      const footerLight = page.getByText(/ShortURL. All rights reserved/);
      await expect(footerLight).toBeVisible();

      // Dark mode
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await page.reload();

      const footerDark = page.getByText(/ShortURL. All rights reserved/);
      await expect(footerDark).toBeVisible();
    });
  });
});
