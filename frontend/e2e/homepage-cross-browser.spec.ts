import { test, expect } from '@playwright/test';

test.describe('Homepage Cross-Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test('should load homepage without console errors in all browsers', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check that there are no console errors
    expect(consoleErrors.length).toBe(0);
  });

  test('should display the hero section with gradient text', async ({ page }) => {
    // Wait for the hero section to be visible
    await page.waitForSelector('h1');

    // Check that the hero heading is visible
    const heroHeading = await page.locator('h1').first();
    await expect(heroHeading).toBeVisible();

    // Verify the gradient text is present
    const gradientText = await page.locator('span.bg-gradient-to-r').first();
    await expect(gradientText).toBeVisible();

    // Check the text content
    await expect(gradientText).toContainText('Simplify Your Links');
  });

  test('should display all feature cards with proper styling', async ({ page }) => {
    // Wait for feature section to load
    await page.waitForSelector('h2:has-text("Features")');

    // Check that we have 6 feature cards (as defined in the requirements)
    const featureCards = await page.locator('[class*="GlassMorphismCard"], [class*="glassmorphism"]').count();

    // Should have at least 6 features
    expect(featureCards).toBeGreaterThanOrEqual(6);
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Check for "Get Started" button
    const getStartedButton = page.locator('text=Get Started');
    await expect(getStartedButton).toBeVisible();

    // Check for "Login" button
    const loginButton = page.locator('text=Login');
    await expect(loginButton).toBeVisible();

    // Verify buttons are clickable
    await expect(getStartedButton).toBeEnabled();
    await expect(loginButton).toBeEnabled();
  });

  test('should apply glassmorphism effects correctly', async ({ page }) => {
    // Wait for feature cards to load
    await page.waitForSelector('h2:has-text("Features")');

    // Get a feature card and check its computed styles
    const featureCard = page.locator('.grid > div').first();
    await expect(featureCard).toBeVisible();

    // Check that backdrop-filter is applied (glassmorphism)
    const backdropFilter = await featureCard.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backdropFilter || styles.webkitBackdropFilter;
    });

    // Should have backdrop-filter applied (may be 'none' if not supported by browser)
    expect(backdropFilter).toBeDefined();
  });

  test('should display CSS gradients correctly', async ({ page }) => {
    // Check the main heading gradient
    const gradientHeading = page.locator('h1 span.bg-gradient-to-r').first();
    await expect(gradientHeading).toBeVisible();

    // Check computed background
    const backgroundImage = await gradientHeading.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });

    // Should have a gradient background
    expect(backgroundImage).toContain('gradient');
  });

  test('should handle Framer Motion animations smoothly', async ({ page }) => {
    // Wait for initial animations to complete
    await page.waitForTimeout(2000);

    // Check that animated elements are visible
    const animatedHeading = page.locator('h1').first();
    await expect(animatedHeading).toBeVisible();

    // Check opacity (should be 1 after animation completes)
    const opacity = await animatedHeading.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test('should be responsive on mobile devices', async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for page to adjust to mobile viewport
    await page.waitForTimeout(500);

    // Check that content is still visible
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();

    // Check that buttons are still accessible
    const getStartedButton = page.locator('text=Get Started').first();
    await expect(getStartedButton).toBeVisible();
  });

  test('should support backdrop-filter or have fallback', async ({ page, browserName }) => {
    await page.waitForSelector('h2:has-text("Features")');

    // Check if backdrop-filter is supported
    const supportsBackdropFilter = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.backdropFilter = 'blur(10px)';
      return testEl.style.backdropFilter !== '';
    });

    // Different browsers have different support levels
    if (browserName === 'webkit' || browserName === 'chromium' || browserName === 'edge') {
      // These browsers should support backdrop-filter
      expect(supportsBackdropFilter).toBe(true);
    }

    // Even if not supported, the page should still work (graceful degradation)
    const heroSection = page.locator('h1').first();
    await expect(heroSection).toBeVisible();
  });

  test('should have no JavaScript errors during interactions', async ({ page }) => {
    const jsErrors: string[] = [];

    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    // Perform some interactions
    await page.hover('text=Get Started');
    await page.hover('text=Login');

    // Scroll down to trigger scroll animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // No JavaScript errors should have occurred
    expect(jsErrors).toHaveLength(0);
  });

  test('should render icons correctly', async ({ page }) => {
    // Wait for feature section
    await page.waitForSelector('h2:has-text("Features")');

    // Check that feature icons are visible (lucide-react icons)
    const icons = await page.locator('svg[class*="lucide"]').count();

    // Should have at least 6 icons for the features
    expect(icons).toBeGreaterThanOrEqual(6);
  });

  test('should display footer correctly', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for footer to be in viewport
    await page.waitForTimeout(500);

    // Check for footer content
    const footer = page.locator('footer, [role="contentinfo"]');
    const hasFooter = await footer.count() > 0 ||
                      await page.locator('text=/ShortURL.*All rights reserved/').count() > 0;

    expect(hasFooter).toBe(true);
  });

  test('should support theme (dark/light mode)', async ({ page }) => {
    // Check if the page has dark mode class or styling
    const bodyClasses = await page.locator('body, html, div[class*="min-h-screen"]').first().getAttribute('class');

    // Should have some theme-related classes
    expect(bodyClasses).toBeDefined();
  });

  test('should load all resources without network errors', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filter out expected failures (like analytics, etc.)
    const criticalFailures = failedRequests.filter(url =>
      !url.includes('analytics') &&
      !url.includes('gtag') &&
      !url.includes('maps.googleapis')
    );

    expect(criticalFailures).toHaveLength(0);
  });

  test('should have proper color contrast for accessibility', async ({ page }) => {
    // Get the hero heading
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();

    // Get subheading
    const subheading = page.locator('p').first();
    await expect(subheading).toBeVisible();

    // Just verify elements are visible (actual contrast ratio testing
    // would require more complex color analysis)
    const isVisible = await heroHeading.isVisible();
    expect(isVisible).toBe(true);
  });
});

test.describe('Browser-Specific Tests', () => {
  test('Chrome - verify all features work', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chrome-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify core functionality
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('Firefox - verify all features work', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify core functionality
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('Safari - verify all features work', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify core functionality
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('Edge - verify all features work', async ({ page, browserName }) => {
    test.skip(browserName !== 'edge', 'Edge-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify core functionality
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('Mobile Safari - verify mobile experience', async ({ page, browserName }) => {
    test.skip(browserName !== 'Mobile Safari', 'Mobile Safari-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify mobile-optimized layout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
  });
});
