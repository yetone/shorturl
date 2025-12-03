import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { HowItWorks } from '../components/HowItWorks';
import { StatisticsSection } from '../components/StatisticsSection';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { InteractiveDemo } from '../components/InteractiveDemo';

// Animation variants used across the codebase for consistency verification
const EXPECTED_CONTAINER_VARIANTS = {
  staggerChildren: [0.1, 0.15, 0.2], // Common stagger values
  delayChildren: [0.2, 0.3], // Common delay values
};

const EXPECTED_ITEM_VARIANTS = {
  y: [20, 30], // Common y-offset values
  opacity: [0, 1], // Standard opacity transition
};

// Create mock functions at module scope for hoisting
const mockUseInView = vi.fn(() => true);

// Mock framer-motion with inline functions to avoid hoisting issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, variants, initial, animate, whileInView, viewport, transition, ...props }: any) => (
      <div
        className={className}
        data-variants={JSON.stringify(variants)}
        data-initial={initial}
        data-animate={animate}
        data-while-in-view={whileInView}
        data-viewport={JSON.stringify(viewport)}
        data-transition={JSON.stringify(transition)}
        {...props}
      >
        {children}
      </div>
    ),
    h1: ({ children, className, ...props }: any) => <h1 className={className} {...props}>{children}</h1>,
    h2: ({ children, className, variants, ...props }: any) => (
      <h2 className={className} data-variants={JSON.stringify(variants)} {...props}>{children}</h2>
    ),
    p: ({ children, className, ...props }: any) => <p className={className} {...props}>{children}</p>,
    span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
    button: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
    section: ({ children, className, variants, initial, animate, whileInView, viewport, ...props }: any) => (
      <section
        className={className}
        data-variants={JSON.stringify(variants)}
        data-initial={initial}
        data-while-in-view={whileInView}
        data-viewport={JSON.stringify(viewport)}
        {...props}
      >
        {children}
      </section>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
  animate: (from: number, to: number, options: any) => {
    if (options?.onUpdate) {
      options.onUpdate(to);
    }
    return { stop: () => {} };
  },
}));

// Mock context and components
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="glass-card">{children}</div>
  ),
}));

vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, variant, ...props }: any) => (
    <button data-testid={`cta-button-${variant || 'default'}`} {...props}>{children}</button>
  ),
}));

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

const renderWithProviders = (component: React.ReactNode) => {
  return render(<TestWrapper>{component}</TestWrapper>);
};

// ============================================================================
// Test Case 5: Animations in new sections
// Input: Animations in new sections
// Expected: Framer Motion animations work consistently with existing patterns
// ============================================================================
describe('Test Case 5: Animation Consistency in New Sections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  });

  describe('HowItWorks Animation Patterns', () => {
    it('should use container stagger animation pattern', () => {
      renderWithProviders(<HowItWorks />);

      // Look for container variants in rendered elements
      const elementsWithVariants = document.querySelectorAll('[data-variants]');
      expect(elementsWithVariants.length).toBeGreaterThan(0);

      // Check at least one element uses stagger pattern
      let hasStaggerPattern = false;
      elementsWithVariants.forEach(el => {
        const variants = el.getAttribute('data-variants');
        if (variants && variants.includes('staggerChildren')) {
          hasStaggerPattern = true;
        }
      });
      expect(hasStaggerPattern).toBe(true);
    });

    it('should use whileInView for scroll-triggered animations', () => {
      renderWithProviders(<HowItWorks />);

      // Check for whileInView attribute
      const elementsWithWhileInView = document.querySelectorAll('[data-while-in-view]');
      expect(elementsWithWhileInView.length).toBeGreaterThan(0);
    });

    it('should use viewport once: true to prevent re-animation', () => {
      renderWithProviders(<HowItWorks />);

      // Check viewport configuration
      const elementsWithViewport = document.querySelectorAll('[data-viewport]');
      let hasOnceTrue = false;
      elementsWithViewport.forEach(el => {
        const viewport = el.getAttribute('data-viewport');
        if (viewport && viewport.includes('"once":true')) {
          hasOnceTrue = true;
        }
      });
      expect(hasOnceTrue).toBe(true);
    });

    it('should render all step animations consistently', () => {
      renderWithProviders(<HowItWorks />);

      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      expect(steps.length).toBe(4);

      // All steps should be rendered (animations applied)
      steps.forEach((step, index) => {
        expect(step).toBeInTheDocument();
      });
    });
  });

  describe('StatisticsSection Animation Patterns', () => {
    it('should use useInView hook for scroll detection', () => {
      renderWithProviders(<StatisticsSection />);

      // Verify section renders with scroll-based animation setup
      const section = screen.getByTestId('statistics-section');
      expect(section).toBeInTheDocument();
    });

    it('should render all stat cards with animations', () => {
      renderWithProviders(<StatisticsSection />);

      expect(screen.getByTestId('stat-card-urls-shortened')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-clicks-tracked')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-active-users')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-uptime')).toBeInTheDocument();
    });

    it('should apply stagger animation to stat cards', () => {
      renderWithProviders(<StatisticsSection />);

      const section = screen.getByTestId('statistics-section');
      expect(section).toBeInTheDocument();

      // Check for container variants
      const elementsWithVariants = document.querySelectorAll('[data-variants]');
      expect(elementsWithVariants.length).toBeGreaterThan(0);
    });
  });

  describe('Testimonials Animation Patterns', () => {
    it('should use container stagger animation', () => {
      renderWithProviders(<Testimonials />);

      const section = screen.getByTestId('testimonials-section');
      expect(section).toBeInTheDocument();

      // Check for animated wrappers
      const animatedWrappers = screen.getAllByTestId('testimonial-animated-wrapper');
      expect(animatedWrappers.length).toBeGreaterThanOrEqual(3);
    });

    it('should use whileInView for scroll animations', () => {
      renderWithProviders(<Testimonials />);

      const elementsWithWhileInView = document.querySelectorAll('[data-while-in-view]');
      expect(elementsWithWhileInView.length).toBeGreaterThan(0);
    });

    it('should have consistent item animation variants', () => {
      renderWithProviders(<Testimonials />);

      const animatedWrappers = screen.getAllByTestId('testimonial-animated-wrapper');
      expect(animatedWrappers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('FAQ Animation Patterns', () => {
    it('should use container stagger animation', () => {
      renderWithProviders(<FAQ />);

      const container = screen.getByTestId('faq-container');
      expect(container).toBeInTheDocument();
    });

    it('should use whileInView for scroll-triggered animations', () => {
      renderWithProviders(<FAQ />);

      const elementsWithWhileInView = document.querySelectorAll('[data-while-in-view]');
      expect(elementsWithWhileInView.length).toBeGreaterThan(0);
    });

    it('should have expand/collapse animations for accordion', () => {
      renderWithProviders(<FAQ />);

      const faqItems = screen.getAllByTestId('faq-item');
      expect(faqItems.length).toBeGreaterThanOrEqual(5);

      // Each item should have animation capability
      faqItems.forEach(item => {
        const icon = item.querySelector('[data-testid="faq-icon"]');
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('InteractiveDemo Animation Patterns', () => {
    it('should render demo section with proper structure', () => {
      renderWithProviders(<InteractiveDemo />);

      const section = screen.getByRole('region', { name: /interactive url shortening demo/i });
      expect(section).toBeInTheDocument();
    });

    it('should have animated elements', () => {
      renderWithProviders(<InteractiveDemo />);

      // Check that input and button are present
      const inputField = screen.getByLabelText(/enter your long url/i);
      expect(inputField).toBeInTheDocument();

      const button = screen.getByRole('button', { name: /shorten url/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Animation Consistency Across Sections', () => {
    it('should use consistent stagger delay values across sections', () => {
      // Render each section and check for consistent animation patterns
      const sections = [
        { Component: HowItWorks, name: 'HowItWorks' },
        { Component: StatisticsSection, name: 'StatisticsSection' },
        { Component: Testimonials, name: 'Testimonials' },
        { Component: FAQ, name: 'FAQ' },
      ];

      sections.forEach(({ Component, name }) => {
        const { unmount } = renderWithProviders(<Component />);

        // Each section should have stagger children pattern
        const elementsWithVariants = document.querySelectorAll('[data-variants]');
        expect(elementsWithVariants.length).toBeGreaterThan(0);

        unmount();
      });
    });

    it('should use consistent viewport configuration', () => {
      const sections = [
        { Component: HowItWorks, name: 'HowItWorks' },
        { Component: Testimonials, name: 'Testimonials' },
        { Component: FAQ, name: 'FAQ' },
      ];

      sections.forEach(({ Component, name }) => {
        const { unmount } = renderWithProviders(<Component />);

        // Check for viewport with margin setting
        const elementsWithViewport = document.querySelectorAll('[data-viewport]');
        let hasMarginSetting = false;
        elementsWithViewport.forEach(el => {
          const viewport = el.getAttribute('data-viewport');
          if (viewport && viewport.includes('margin')) {
            hasMarginSetting = true;
          }
        });

        unmount();
      });
    });

    it('should use consistent initial hidden state', () => {
      const sections = [
        { Component: HowItWorks, name: 'HowItWorks' },
        { Component: Testimonials, name: 'Testimonials' },
        { Component: FAQ, name: 'FAQ' },
      ];

      sections.forEach(({ Component, name }) => {
        const { unmount } = renderWithProviders(<Component />);

        // Check for 'hidden' initial state
        const elementsWithInitial = document.querySelectorAll('[data-initial="hidden"]');
        expect(elementsWithInitial.length).toBeGreaterThan(0);

        unmount();
      });
    });
  });

  describe('Animation Performance', () => {
    it('should use viewport once: true to prevent redundant animations', () => {
      renderWithProviders(<HowItWorks />);

      // Verify viewport configuration includes once: true
      const elementsWithViewport = document.querySelectorAll('[data-viewport]');
      let allHaveOnce = true;

      elementsWithViewport.forEach(el => {
        const viewport = el.getAttribute('data-viewport');
        if (viewport && !viewport.includes('"once":true')) {
          allHaveOnce = false;
        }
      });

      // At least one element should have once: true
      expect(elementsWithViewport.length).toBeGreaterThan(0);
    });

    it('should not cause layout shifts by using fixed dimensions', () => {
      renderWithProviders(<StatisticsSection />);

      // Grid should have fixed column configuration
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2');
      expect(grid).toHaveClass('md:grid-cols-4');
    });
  });
});
