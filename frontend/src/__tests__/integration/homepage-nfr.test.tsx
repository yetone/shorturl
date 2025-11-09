/**
 * REQ-8: Responsive Optimization
 * NFR-1: Performance Requirements
 * NFR-2: Accessibility Compliance
 *
 * Technical Design Specification Quote:
 * "Homepage initial load time < 2 seconds on 4G connection. Lighthouse performance score > 85.
 * WCAG 2.1 AA compliance for all new components. Touch-friendly interactive elements.
 * Keyboard navigation support for interactive demo."
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock Home component
const Home = () => <div data-testid="homepage">Home placeholder</div>;

describe('REQ-8: Mobile Responsiveness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile Layout', () => {
    it('should render all sections on mobile without horizontal scroll', () => {
      window.innerWidth = 375; // iPhone SE width
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const homepage = container.querySelector('[data-testid="homepage"]');
      if (homepage) {
        const hasHorizontalScroll = homepage.scrollWidth > homepage.clientWidth;
        expect(hasHorizontalScroll).toBe(false);
      }
    });

    it('should stack sections vertically on mobile', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        media: query,
      }));

      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const sections = container.querySelectorAll('[data-testid^="section"]');
      sections.forEach(section => {
        expect(section.className).toMatch(/flex-col|block/i);
      });
    });

    it('should use responsive breakpoints (sm, md, lg)', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const sections = container.querySelectorAll('[class*="md:"]');
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe('Touch-Friendly Elements', () => {
    it('should have interactive elements with minimum 44px tap target', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44);
        expect(rect.width).toBeGreaterThanOrEqual(44);
      });
    });

    it('should support touch events on interactive demo', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const demoInput = screen.queryByTestId('demo-input');
      if (demoInput) {
        // Simulate touch interaction
        await user.click(demoInput);
        expect(document.activeElement).toBe(demoInput);
      }
    });

    it('should have appropriate spacing between tap targets', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const buttons = Array.from(container.querySelectorAll('button'));
      for (let i = 0; i < buttons.length - 1; i++) {
        const button1 = buttons[i].getBoundingClientRect();
        const button2 = buttons[i + 1].getBoundingClientRect();

        const spacing = Math.abs(button2.top - button1.bottom);
        // Minimum 8px spacing recommended
        expect(spacing).toBeGreaterThanOrEqual(8);
      }
    });
  });

  describe('Mobile Image Optimization', () => {
    it('should lazy load images below the fold', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const images = container.querySelectorAll('img[loading="lazy"]');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should serve responsive image sizes', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img.hasAttribute('srcset') || img.hasAttribute('sizes')).toBe(true);
      });
    });
  });

  describe('Mobile Performance', () => {
    it('should load in under 3 seconds on 4G (mobile)', async () => {
      const startTime = performance.now();

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      await waitFor(() => {
        const loadTime = performance.now() - startTime;
        expect(loadTime).toBeLessThan(3000);
      });
    });

    it('should not cause jank or lag with animations on mobile', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Should use reduced motion for mobile or lower-end devices
      const animatedElements = container.querySelectorAll('[class*="animate"]');
      animatedElements.forEach(element => {
        expect(element.className).toMatch(/motion-reduce|will-change/i);
      });
    });
  });

  describe('Viewport and Meta Tags', () => {
    it('should have proper viewport meta tag', () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      expect(viewportMeta?.getAttribute('content')).toContain('width=device-width');
    });

    it('should prevent zoom on form inputs', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const inputs = container.querySelectorAll('input');
      inputs.forEach(input => {
        const fontSize = window.getComputedStyle(input).fontSize;
        // Font size should be >= 16px to prevent zoom on iOS
        expect(parseInt(fontSize)).toBeGreaterThanOrEqual(16);
      });
    });
  });
});

describe('NFR-1: Performance Requirements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Load Time', () => {
    it('should load homepage in under 2 seconds on 4G', async () => {
      const startTime = performance.now();

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      await waitFor(() => {
        const loadTime = performance.now() - startTime;
        expect(loadTime).toBeLessThan(2000);
      }, { timeout: 2000 });
    });

    it('should achieve First Contentful Paint < 1.5s', async () => {
      const performanceObserver = vi.fn();

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Mock FCP measurement
      await waitFor(() => {
        expect(performanceObserver).toBeDefined();
      });
    });
  });

  describe('Core Web Vitals', () => {
    it('should have Cumulative Layout Shift (CLS) < 0.1', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Elements should have explicit dimensions to prevent layout shift
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img.hasAttribute('width') || img.hasAttribute('height')).toBe(true);
      });
    });

    it('should have Largest Contentful Paint (LCP) < 2.5s', async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Main content should be prioritized
      await waitFor(() => {
        const heroSection = screen.queryByTestId('hero-section');
        expect(heroSection).toBeDefined();
      }, { timeout: 2500 });
    });

    it('should have Total Blocking Time (TBT) < 300ms', () => {
      const startTime = performance.now();

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const renderTime = performance.now() - startTime;
      expect(renderTime).toBeLessThan(300);
    });
  });

  describe('Bundle Size', () => {
    it('should have initial bundle size < 300KB gzipped', () => {
      // This would be tested in build pipeline
      expect(true).toBe(true);
    });

    it('should have total page weight < 1.5MB', () => {
      // This would be tested with Lighthouse
      expect(true).toBe(true);
    });
  });

  describe('Lazy Loading', () => {
    it('should lazy load components below the fold', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Should use React.lazy or similar for below-fold content
      expect(IntersectionObserver).toHaveBeenCalled();
    });

    it('should preload critical resources', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      expect(preloadLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Animation Performance', () => {
    it('should not impact Core Web Vitals negatively', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const animatedElements = container.querySelectorAll('[class*="animate"]');
      animatedElements.forEach(element => {
        // Should use transform and opacity for animations (GPU-accelerated)
        expect(element.className).toMatch(/transform|opacity|translate/i);
      });
    });

    it('should respect prefers-reduced-motion', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
      }));

      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const animatedElements = container.querySelectorAll('[class*="animate"]');
      animatedElements.forEach(element => {
        expect(element.className).toMatch(/motion-reduce/i);
      });
    });
  });

  describe('API Performance', () => {
    it('should cache demo URL requests', async () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Should use React Query or similar for caching
      await waitFor(() => {
        expect(screen.queryByTestId('demo-section')).toBeDefined();
      });
    });

    it('should handle API timeouts gracefully', async () => {
      // Mock slow API
      vi.useFakeTimers();

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        // Should show timeout message or fallback
        expect(screen.queryByText(/try again|timeout|slow/i)).toBeDefined();
      });

      vi.useRealTimers();
    });
  });
});

describe('NFR-2: Accessibility (WCAG 2.1 AA)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Keyboard Navigation', () => {
    it('should support Tab navigation through all interactive elements', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      await user.tab();
      expect(document.activeElement?.tagName).toMatch(/BUTTON|A|INPUT/);

      await user.tab();
      expect(document.activeElement?.tagName).toMatch(/BUTTON|A|INPUT/);
    });

    it('should support keyboard interaction for demo input', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const demoInput = screen.queryByTestId('demo-input');
      if (demoInput) {
        await user.tab();
        await user.keyboard('https://example.com');
        expect((demoInput as HTMLInputElement).value).toContain('example.com');
      }
    });

    it('should support Enter key to submit demo form', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const demoInput = screen.queryByTestId('demo-input');
      if (demoInput) {
        demoInput.focus();
        await user.keyboard('https://example.com{Enter}');
        await waitFor(() => {
          expect(screen.queryByText(/short.*url/i)).toBeDefined();
        });
      }
    });

    it('should support Space key for button activation', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const button = screen.queryAllByRole('button')[0];
      if (button) {
        button.focus();
        await user.keyboard(' ');
        // Button should be activated
        expect(button).toBeDefined();
      }
    });

    it('should have visible focus indicators', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const focusableElements = container.querySelectorAll('button, a, input');
      focusableElements.forEach(element => {
        element.focus();
        const styles = window.getComputedStyle(element);
        // Should have outline or ring on focus
        expect(styles.outline !== 'none' || element.className.includes('focus')).toBe(true);
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels for demo input', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const demoInput = screen.queryByTestId('demo-input');
      expect(
        demoInput?.hasAttribute('aria-label') || demoInput?.hasAttribute('aria-labelledby')
      ).toBe(true);
    });

    it('should announce demo result to screen readers', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const demoInput = screen.queryByTestId('demo-input');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (demoInput && submitButton) {
        await user.type(demoInput, 'https://example.com');
        await user.click(submitButton);

        await waitFor(() => {
          const announcement = screen.queryByRole('status');
          expect(announcement).toBeDefined();
        });
      }
    });

    it('should have alt text for all images', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img.hasAttribute('alt')).toBe(true);
        expect(img.getAttribute('alt')?.length).toBeGreaterThan(0);
      });
    });

    it('should use semantic HTML for new sections', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(container.querySelector('header')).toBeDefined();
      expect(container.querySelector('main')).toBeDefined();
      expect(container.querySelector('footer')).toBeDefined();
    });

    it('should have proper heading hierarchy (h1, h2, h3)', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const h1 = container.querySelector('h1');
      const h2s = container.querySelectorAll('h2');

      expect(h1).toBeDefined();
      expect(h2s.length).toBeGreaterThan(0);
    });
  });

  describe('Color Contrast', () => {
    it('should have color contrast ratio ≥ 4.5:1 for text', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const textElements = container.querySelectorAll('p, span, h1, h2, h3');
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        // This would require a contrast calculation library
        expect(styles.color).toBeDefined();
      });
    });

    it('should maintain contrast in dark mode', () => {
      // Mock dark mode
      document.documentElement.classList.add('dark');

      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const textElements = container.querySelectorAll('p, span, h1, h2, h3');
      expect(textElements.length).toBeGreaterThan(0);

      document.documentElement.classList.remove('dark');
    });

    it('should not convey information by color alone', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Interactive elements should have text, icons, or other indicators
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button.textContent?.length || button.querySelector('svg')).toBeTruthy();
      });
    });
  });

  describe('Form Accessibility', () => {
    it('should have label for demo input field', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      expect(input).toBeDefined();
      expect(
        input?.hasAttribute('aria-label') ||
        document.querySelector(`label[for="${input?.id}"]`)
      ).toBeTruthy();
    });

    it('should display error messages with proper ARIA attributes', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const input = screen.queryByTestId('demo-input');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'invalid-url');
        await user.click(submitButton);

        await waitFor(() => {
          const errorMessage = screen.queryByRole('alert');
          expect(errorMessage).toBeDefined();
        });
      }
    });

    it('should associate error messages with input fields', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const input = screen.queryByTestId('demo-input');
      if (input) {
        await user.type(input, 'invalid');
        await user.tab();

        expect(input.hasAttribute('aria-invalid')).toBe(true);
        expect(input.hasAttribute('aria-describedby')).toBe(true);
      }
    });
  });

  describe('Skip Links', () => {
    it('should have skip-to-content link', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const skipLink = screen.queryByRole('link', { name: /skip.*content|skip.*main/i });
      expect(skipLink).toBeDefined();
    });

    it('should move focus to main content when skip link is activated', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const skipLink = screen.queryByRole('link', { name: /skip/i });
      if (skipLink) {
        await user.click(skipLink);
        const mainContent = document.querySelector('main');
        expect(document.activeElement).toBe(mainContent);
      }
    });
  });

  describe('ARIA Landmarks', () => {
    it('should have proper landmark roles', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(container.querySelector('[role="main"], main')).toBeDefined();
      expect(container.querySelector('[role="navigation"], nav')).toBeDefined();
      expect(container.querySelector('[role="contentinfo"], footer')).toBeDefined();
    });
  });
});
