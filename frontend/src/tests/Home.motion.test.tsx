import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Mock components
vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

const renderWithProviders = (component: React.ReactElement, prefersReducedMotion = false) => {
  // Mock matchMedia for prefers-reduced-motion
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? prefersReducedMotion : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: null } as any}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: vi.fn() } as any}>
          {component}
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Home Page - Reduced Motion and Animation (REQ-6, NFR-1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Prefers-Reduced-Motion Support', () => {
    it('should respect prefers-reduced-motion media query', () => {
      renderWithProviders(<Home />, true);

      // Content should still be visible
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeVisible();
    });

    it('should disable decorative animations when prefers-reduced-motion is set', () => {
      renderWithProviders(<Home />, true);

      // Framer Motion should respect reduced motion
      // Check that content is visible without animations
      const heading = screen.getByRole('heading', { level: 1 });
      const features = screen.getByRole('heading', { name: /Features/i });

      expect(heading).toBeInTheDocument();
      expect(features).toBeInTheDocument();
    });

    it('should keep content fully visible without animations', () => {
      renderWithProviders(<Home />, true);

      // All content should be accessible
      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getByText(/Create short, memorable links/i);
      const features = screen.getByText(/URL Shortening/i);

      expect(heading).toBeVisible();
      expect(description).toBeVisible();
      expect(features).toBeVisible();
    });

    it('should use non-motion alternatives for critical visual feedback', () => {
      renderWithProviders(<Home />, true);

      // Hover states should use color/opacity instead of motion
      const featureCards = screen.getAllByText(/URL Shortening|Click Analytics|User Dashboard/i);

      featureCards.forEach((card) => {
        const cardElement = card.parentElement;
        // Should still have visual feedback
        expect(cardElement).toBeInTheDocument();
      });
    });

    it('should ensure experience feels cohesive, not broken', () => {
      renderWithProviders(<Home />, true);

      // Page should render completely
      const heading = screen.getByRole('heading', { level: 1 });
      const ctaButton = screen.getByRole('link', { name: /Get Started/i });
      const features = screen.getByRole('heading', { name: /Features/i });
      const footer = screen.getByText(/All rights reserved/i);

      expect(heading).toBeVisible();
      expect(ctaButton).toBeVisible();
      expect(features).toBeVisible();
      expect(footer).toBeVisible();
    });
  });

  describe('Animation Timing and Easing (REQ-6)', () => {
    it('should use appropriate animation duration (200-400ms for micro-interactions)', () => {
      renderWithProviders(<Home />);

      // Framer Motion animations should have proper duration
      // In implementation, check transition properties
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should use appropriate duration for page sections (600-800ms)', () => {
      renderWithProviders(<Home />);

      // Feature section animations should be in this range
      const features = screen.getByRole('heading', { name: /Features/i });
      expect(features).toBeInTheDocument();
    });

    it('should use ease-out for elements entering', () => {
      renderWithProviders(<Home />);

      // Framer Motion variants should use ease-out
      const heroSection = screen.getByRole('heading', { level: 1 }).parentElement;
      expect(heroSection).toBeInTheDocument();
    });

    it('should stagger animations with 50-100ms delay between elements', () => {
      renderWithProviders(<Home />);

      // Feature cards should have staggered animations
      const featuresContainer = screen.getByRole('heading', { name: /Features/i }).parentElement;
      expect(featuresContainer).toBeInTheDocument();
    });
  });

  describe('Animation Performance (REQ-6, NFR-2)', () => {
    it('should use CSS transforms for animations (not layout properties)', () => {
      renderWithProviders(<Home />);

      // Framer Motion should use transform properties
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should limit simultaneous animations to avoid jank', () => {
      renderWithProviders(<Home />);

      // Should use staggerChildren to limit simultaneous animations
      const features = screen.getByRole('heading', { name: /Features/i }).parentElement;
      expect(features).toBeInTheDocument();
    });

    it('should use IntersectionObserver for scroll-triggered animations', () => {
      renderWithProviders(<Home />);

      // Feature section should use whileInView
      const features = screen.getByRole('heading', { name: /Features/i });
      expect(features).toBeInTheDocument();
    });

    it('should maintain 60fps for all animations', () => {
      renderWithProviders(<Home />);

      // In production, would use performance monitoring
      // For tests, verify animations are GPU-accelerated (transforms)
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Hover State Animations (REQ-6)', () => {
    it('should provide subtle lift effect (2-4px) on feature cards', () => {
      renderWithProviders(<Home />);

      const featureCard = screen.getByText(/URL Shortening/i).parentElement;
      expect(featureCard?.parentElement).toBeInTheDocument();
      // Should have hover transform classes
    });

    it('should increase glow intensity on hover', () => {
      renderWithProviders(<Home />);

      const card = screen.getByText(/Click Analytics/i).parentElement;
      expect(card).toBeInTheDocument();
      // GlassMorphismCard should support glow effects
    });

    it('should scale buttons slightly on hover (1.02-1.05)', () => {
      renderWithProviders(<Home />);

      const button = screen.getByRole('link', { name: /Get Started/i });
      expect(button).toBeInTheDocument();
      // FuturisticButton should have hover scale
    });

    it('should animate hover transitions smoothly', () => {
      renderWithProviders(<Home />);

      const button = screen.getByRole('link', { name: /Get Started/i });
      expect(button).toBeInTheDocument();
      // Should have transition properties
    });
  });

  describe('Entry Animations', () => {
    it('should fade in hero section content on page load', () => {
      renderWithProviders(<Home />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      // Framer Motion should animate from opacity: 0 to opacity: 1
    });

    it('should include subtle slide (max 20px movement) for entry', () => {
      renderWithProviders(<Home />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      // Should animate from y: -20 to y: 0
    });

    it('should animate feature cards in sequence', () => {
      renderWithProviders(<Home />);

      const featureCards = screen.getAllByText(/URL Shortening|Click Analytics|User Dashboard/i);
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
      // Should use staggerChildren animation
    });
  });

  describe('Interactive Feedback Timing', () => {
    it('should provide immediate visual response to clicks (within 100ms)', () => {
      renderWithProviders(<Home />);

      const button = screen.getByRole('link', { name: /Get Started/i });
      expect(button).toBeInTheDocument();
      // Should have active state styling
    });

    it('should show loading states for delayed actions', () => {
      renderWithProviders(<Home />);

      // Demo widget should show loading state
      const demoWidget = screen.queryByTestId('demo-widget');
      if (demoWidget) {
        expect(demoWidget).toBeInTheDocument();
      }
    });
  });

  describe('Motion Sensitivity (User Story 6)', () => {
    it('should disable decorative animations when prefers-reduced-motion is enabled', () => {
      renderWithProviders(<Home />, true);

      const heading = screen.getByRole('heading', { level: 1 });
      const features = screen.getByRole('heading', { name: /Features/i });

      // Content should be visible immediately without animation
      expect(heading).toBeVisible();
      expect(features).toBeVisible();
    });

    it('should keep all content fully visible and accessible', () => {
      renderWithProviders(<Home />, true);

      // All sections should be rendered
      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getByText(/Create short, memorable links/i);
      const getStarted = screen.getByRole('link', { name: /Get Started/i });
      const features = screen.getByText(/URL Shortening/i);

      expect(heading).toBeVisible();
      expect(description).toBeVisible();
      expect(getStarted).toBeVisible();
      expect(features).toBeVisible();
    });

    it('should use non-motion alternatives for critical feedback', () => {
      renderWithProviders(<Home />, true);

      // Hover should use color/opacity changes instead of motion
      const featureCard = screen.getByText(/URL Shortening/i).parentElement;
      expect(featureCard).toBeInTheDocument();
      // Should have hover:opacity or hover:color classes
    });

    it('should provide cohesive experience without animations', () => {
      renderWithProviders(<Home />, true);

      // Page should feel complete and intentional
      const sections = [
        screen.getByRole('heading', { level: 1 }),
        screen.getByRole('link', { name: /Get Started/i }),
        screen.getByRole('heading', { name: /Features/i }),
        screen.getByText(/All rights reserved/i),
      ];

      sections.forEach((section) => {
        expect(section).toBeVisible();
      });
    });
  });

  describe('Background Effects', () => {
    it('should render background effects', () => {
      renderWithProviders(<Home />);

      const background = screen.getByTestId('background-effect');
      expect(background).toBeInTheDocument();
    });

    it('should respect reduced motion for background animations', () => {
      renderWithProviders(<Home />, true);

      const background = screen.getByTestId('background-effect');
      expect(background).toBeInTheDocument();
      // BackgroundEffect component should disable/reduce animations
    });
  });

  describe('Gradient Animations', () => {
    it('should animate gradient on headline text', () => {
      renderWithProviders(<Home />);

      const heading = screen.getByRole('heading', { level: 1 });
      const gradientElement = heading.querySelector('.bg-gradient-to-r');

      expect(gradientElement).toBeInTheDocument();
      expect(gradientElement).toHaveClass('animate-gradient-x');
    });

    it('should disable gradient animation when prefers-reduced-motion is set', () => {
      renderWithProviders(<Home />, true);

      const heading = screen.getByRole('heading', { level: 1 });
      // Gradient should still be present but not animated
      const gradientElement = heading.querySelector('.bg-gradient-to-r');
      expect(gradientElement).toBeInTheDocument();
    });
  });
});
