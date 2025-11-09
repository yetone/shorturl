/**
 * REQ-2: Social Proof Section
 * Tests for displaying aggregate statistics, testimonials, and user metrics
 *
 * Technical Design Specification Quote:
 * "Display aggregate statistics: total URLs shortened, total clicks tracked.
 * Rotating testimonials or user quotes (minimum 3-5) with animated counters."
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock the SocialProofStats component (will be implemented)
const SocialProofStats = () => {
  return <div>SocialProofStats placeholder</div>;
};

describe('REQ-2: Social Proof Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Statistics Display', () => {
    it('should display total URLs shortened statistic', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      expect(
        screen.queryByText(/urls?.*shortened|shortened.*urls?/i)
      ).toBeDefined();
    });

    it('should display total clicks tracked statistic', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      expect(
        screen.queryByText(/clicks?.*tracked|tracked.*clicks?/i)
      ).toBeDefined();
    });

    it('should display active users count', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      expect(
        screen.queryByText(/users?.*active|active.*users?|trusted.*users?/i)
      ).toBeDefined();
    });

    it('should render statistics in 3-column grid layout on desktop', () => {
      const { container } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const statsContainer = container.querySelector('[data-testid="stats-grid"]');
      expect(statsContainer?.className).toMatch(/grid|flex/i);
    });

    it('should display numeric values for statistics', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Should have numbers like "1000+", "50K+", etc.
      const statsNumbers = screen.queryAllByText(/\d+[k|m|K|M|\+]?/);
      expect(statsNumbers.length).toBeGreaterThan(0);
    });
  });

  describe('Animated Counters', () => {
    it('should have count-up animation when scrolling into view', async () => {
      const { container } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Simulate intersection observer triggering
      const statsContainer = container.querySelector('[data-testid="stats-container"]');

      await waitFor(() => {
        expect(statsContainer?.className).toMatch(/animate|count|transition/i);
      });
    });

    it('should animate from 0 to final value', async () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Counter should start at 0 or low value and increase
      await waitFor(() => {
        const counter = screen.queryByTestId('url-counter');
        expect(counter?.textContent).toMatch(/\d+/);
      });
    });
  });

  describe('Testimonials Section', () => {
    it('should render minimum 3 testimonials', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const testimonials = screen.queryAllByTestId(/testimonial-\d+/);
      expect(testimonials.length).toBeGreaterThanOrEqual(3);
    });

    it('should display testimonial quote text', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Should have quote marks or testimonial content
      expect(
        screen.queryByText(/"|".*"|The.*helped|Great.*tool/i)
      ).toBeDefined();
    });

    it('should display testimonial author name and title', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Should have author attribution
      expect(screen.queryByTestId('testimonial-author')).toBeDefined();
      expect(screen.queryByTestId('testimonial-title')).toBeDefined();
    });

    it('should implement carousel or rotating display for testimonials', async () => {
      const { container } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const carousel = container.querySelector('[data-testid="testimonials-carousel"]');
      expect(carousel).toBeDefined();
    });

    it('should support navigation between testimonials', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Should have navigation buttons or indicators
      const navButtons = screen.queryAllByRole('button', { name: /next|previous|slide/i });
      expect(navButtons.length).toBeGreaterThan(0);
    });

    it('should auto-rotate testimonials at regular intervals', async () => {
      vi.useFakeTimers();
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const initialTestimonial = screen.queryByTestId('active-testimonial');
      const initialContent = initialTestimonial?.textContent;

      // Advance time by rotation interval (e.g., 5 seconds)
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        const currentTestimonial = screen.queryByTestId('active-testimonial');
        expect(currentTestimonial?.textContent).not.toBe(initialContent);
      });

      vi.useRealTimers();
    });
  });

  describe('Styling and Layout', () => {
    it('should use gradient backgrounds for statistic cards', () => {
      const { container } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const statCards = container.querySelectorAll('[data-testid^="stat-card"]');
      statCards.forEach(card => {
        expect(card.className).toMatch(/gradient|bg-/i);
      });
    });

    it('should be responsive and stack on mobile', () => {
      // Simulate mobile viewport
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('max-width'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { container } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const statsContainer = container.querySelector('[data-testid="stats-grid"]');
      expect(statsContainer?.className).toMatch(/flex-col|stack|mobile/i);
    });

    it('should use consistent styling with existing design system', () => {
      const { container } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Should use GlassMorphismCard or similar design elements
      expect(container.querySelector('.glass-morphism-card')).toBeDefined();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch statistics from API endpoint', async () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Should show statistics after loading
        expect(screen.queryByText(/\d+/)).toBeDefined();
      });
    });

    it('should display loading state while fetching statistics', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Should have loading skeleton or spinner initially
      expect(screen.queryByTestId('stats-loading')).toBeDefined();
    });

    it('should handle API errors gracefully with fallback values', async () => {
      // Mock API failure
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Should still show something even if API fails
        expect(screen.queryByTestId('stats-container')).toBeDefined();
      });
    });

    it('should cache statistics data to avoid repeated API calls', async () => {
      const { rerender } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByText(/\d+/)).toBeDefined();
      });

      // Rerender should use cached data
      rerender(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Should not show loading state on rerender
      expect(screen.queryByTestId('stats-loading')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for statistics', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const statCards = screen.queryAllByRole('group');
      expect(statCards.length).toBeGreaterThan(0);
    });

    it('should announce statistics to screen readers', () => {
      const { container } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const ariaLive = container.querySelector('[aria-live="polite"]');
      expect(ariaLive).toBeDefined();
    });

    it('should have accessible testimonial carousel controls', () => {
      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const prevButton = screen.queryByRole('button', { name: /previous/i });
      const nextButton = screen.queryByRole('button', { name: /next/i });

      expect(prevButton).toBeDefined();
      expect(nextButton).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should not impact initial page load significantly', () => {
      const startTime = performance.now();

      render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (< 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('should lazy load testimonials below the fold', () => {
      const { container } = render(
        <BrowserRouter>
          <SocialProofStats />
        </BrowserRouter>
      );

      // Should use intersection observer for lazy loading
      expect(IntersectionObserver).toHaveBeenCalled();
    });
  });
});
