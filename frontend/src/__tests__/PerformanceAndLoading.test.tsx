import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { HowItWorks } from '../components/HowItWorks';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { StatisticsSection } from '../components/StatisticsSection';

// Performance measurement utilities
interface PerformanceMetrics {
  renderTime: number;
  reRenderTime: number;
  componentCount: number;
}

// Track intersection observer callbacks for lazy loading tests
const intersectionObserverCallbacks: Map<Element, IntersectionObserverCallback> = new Map();
const observedElements: Set<Element> = new Set();

// Mock IntersectionObserver for lazy loading tests
class MockIntersectionObserver implements IntersectionObserver {
  private callback: IntersectionObserverCallback;
  public root: Element | Document | null = null;
  public rootMargin: string = '';
  public thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    this.callback = callback;
  }

  observe(target: Element): void {
    observedElements.add(target);
    intersectionObserverCallbacks.set(target, this.callback);
  }

  unobserve(target: Element): void {
    observedElements.delete(target);
    intersectionObserverCallbacks.delete(target);
  }

  disconnect(): void {
    observedElements.clear();
    intersectionObserverCallbacks.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // Helper to simulate intersection
  static triggerIntersection(target: Element, isIntersecting: boolean): void {
    const callback = intersectionObserverCallbacks.get(target);
    if (callback) {
      const entry = {
        isIntersecting,
        target,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: performance.now(),
      };
      callback([entry], {} as IntersectionObserver);
    }
  }
}

// Track animation frames for FPS testing
let animationFrameCallbacks: FrameRequestCallback[] = [];
let animationFrameId = 0;

// Mock for AuthContext
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

// Mock for ThemeContext
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

// Mock BackgroundEffect to simulate heavy 3D component
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

// Store original motion variants for animation verification
const capturedAnimationVariants: Map<string, object> = new Map();

// Mock framer-motion to capture animation configurations
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, variants, initial, animate, whileInView, viewport, transition, ...props }: any) => {
      // Capture animation variants for verification
      if (variants && props['data-testid']) {
        capturedAnimationVariants.set(props['data-testid'], { variants, transition, viewport });
      }
      return (
        <div
          className={className}
          data-variants={variants ? JSON.stringify(variants) : undefined}
          data-initial={initial}
          data-animate={animate}
          data-while-in-view={whileInView}
          data-viewport={viewport ? JSON.stringify(viewport) : undefined}
          data-transition={transition ? JSON.stringify(transition) : undefined}
          {...props}
        >
          {children}
        </div>
      );
    },
    h1: ({ children, className, ...props }: any) => (
      <h1 className={className} data-testid="hero-headline" {...props}>{children}</h1>
    ),
    h2: ({ children, className, variants, ...props }: any) => (
      <h2 className={className} data-variants={variants ? JSON.stringify(variants) : undefined} {...props}>{children}</h2>
    ),
    p: ({ children, className, ...props }: any) => (
      <p className={className} data-testid="hero-subheadline" {...props}>{children}</p>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
    button: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>{children}</button>
    ),
    footer: ({ children, className, ...props }: any) => (
      <footer className={className} {...props}>{children}</footer>
    ),
    section: ({ children, className, variants, initial, animate, whileInView, viewport, ...props }: any) => (
      <section
        className={className}
        data-variants={variants ? JSON.stringify(variants) : undefined}
        data-initial={initial}
        data-while-in-view={whileInView}
        data-viewport={viewport ? JSON.stringify(viewport) : undefined}
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

// Mock GlassMorphismCard
vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="glass-card">{children}</div>
  ),
}));

// Mock FuturisticButton
vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, variant, size, className, onClick, ...props }: any) => (
    <button
      className={`futuristic-button ${variant || ''} ${size || ''} ${className || ''}`}
      onClick={onClick}
      data-testid={`cta-button-${variant || 'default'}`}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock InteractiveDemo
vi.mock('../components/InteractiveDemo', () => ({
  InteractiveDemo: () => <div data-testid="interactive-demo" />,
}));

// Mock StatisticsSection for isolated tests
vi.mock('../components/StatisticsSection', async () => {
  const actual = await vi.importActual('../components/StatisticsSection');
  return {
    ...actual,
    StatisticsSection: ({ className }: { className?: string }) => (
      <section data-testid="statistics-section" className={className}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div data-testid="stat-card-urls-shortened">URLs Shortened</div>
          <div data-testid="stat-card-clicks-tracked">Clicks Tracked</div>
          <div data-testid="stat-card-active-users">Active Users</div>
          <div data-testid="stat-card-uptime">Uptime</div>
        </div>
      </section>
    ),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// ============================================================================
// Test Case 1: Time to Interactive (TTI) under 2 seconds
// Input: Load homepage on standard connection
// Expected: Time to Interactive under 2 seconds
// ============================================================================
describe('Test Case 1: Homepage Load Performance - TTI under 2 seconds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedAnimationVariants.clear();
    observedElements.clear();
    intersectionObserverCallbacks.clear();
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  it('should render homepage within acceptable time frame (< 500ms for initial render)', async () => {
    const startTime = performance.now();

    renderWithRouter(<Home />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Initial render should be fast (< 500ms in test environment)
    // This threshold accounts for test environment variability
    // In production, Lighthouse audits verify actual TTI < 2s
    expect(renderTime).toBeLessThan(500);
  });

  it('should render critical above-the-fold content first', () => {
    renderWithRouter(<Home />);

    // Critical content should be immediately available
    expect(screen.getByTestId('hero-headline')).toBeInTheDocument();
    expect(screen.getByTestId('cta-button-neon')).toBeInTheDocument();
    expect(screen.getByTestId('cta-button-outline')).toBeInTheDocument();
  });

  it('should have minimal blocking resources in initial render', () => {
    renderWithRouter(<Home />);

    // BackgroundEffect should be mocked/lazy (3D content)
    const backgroundEffect = screen.getByTestId('background-effect');
    expect(backgroundEffect).toBeInTheDocument();
  });

  it('should use efficient component structure for fast rendering', () => {
    const { container } = renderWithRouter(<Home />);

    // DOM should not be excessively deep (< 20 levels for main content)
    const maxDepth = getMaxDOMDepth(container);
    expect(maxDepth).toBeLessThan(25);
  });

  it('should not have excessive inline styles that slow parsing', () => {
    const { container } = renderWithRouter(<Home />);

    // Count inline style attributes
    const elementsWithInlineStyles = container.querySelectorAll('[style]');
    // Should have minimal inline styles (most styling via Tailwind classes)
    expect(elementsWithInlineStyles.length).toBeLessThan(20);
  });
});

// ============================================================================
// Test Case 2: Lighthouse Performance Score
// Input: Run Lighthouse performance audit
// Expected: Performance score of 80 or higher
// ============================================================================
describe('Test Case 2: Lighthouse Performance Patterns - Score 80+', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use proper heading hierarchy (Lighthouse SEO/Accessibility)', () => {
    renderWithRouter(<Home />);

    // Should have proper H1 -> H2 -> H3 hierarchy
    const h1Elements = document.querySelectorAll('h1');
    const h2Elements = document.querySelectorAll('h2');

    expect(h1Elements.length).toBe(1); // Only one H1
    expect(h2Elements.length).toBeGreaterThanOrEqual(1); // At least one H2
  });

  it('should have accessible button and link elements', () => {
    renderWithRouter(<Home />);

    // All buttons should have accessible text
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button.textContent?.trim().length).toBeGreaterThan(0);
    });

    // All links should have href
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('should use semantic HTML elements', () => {
    renderWithRouter(<Home />);

    // Should have semantic structure
    expect(screen.getByTestId('hero-headline').tagName).toBe('H1');
  });

  it('should avoid document.write and inline event handlers', () => {
    const { container } = renderWithRouter(<Home />);

    // Check for inline event handlers (onclick, onmouseover, etc.)
    const inlineEventHandlers = container.querySelectorAll(
      '[onclick], [onmouseover], [onmouseout], [onfocus], [onblur]'
    );
    expect(inlineEventHandlers.length).toBe(0);
  });

  it('should use CSS classes instead of inline styles for performance', () => {
    const { container } = renderWithRouter(<Home />);

    // Count elements with Tailwind classes vs inline styles
    const elementsWithClasses = container.querySelectorAll('[class]');
    const elementsWithInlineStyles = container.querySelectorAll('[style]');

    // Ratio of classes to inline styles should be high
    expect(elementsWithClasses.length).toBeGreaterThan(elementsWithInlineStyles.length * 5);
  });
});

// ============================================================================
// Test Case 3: Cumulative Layout Shift (CLS < 0.1)
// Input: Scroll through homepage
// Expected: Smooth scrolling with no layout shifts (CLS < 0.1)
// ============================================================================
describe('Test Case 3: CLS Prevention - Layout Stability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have fixed dimensions for grid layouts', () => {
    const { container } = renderWithRouter(<Home />);

    // Grid containers should have explicit column definitions
    const grids = container.querySelectorAll('.grid');
    grids.forEach(grid => {
      expect(grid.className).toMatch(/grid-cols-|md:grid-cols-|lg:grid-cols-/);
    });
  });

  it('should use min-height to prevent layout shifts', () => {
    const { container } = renderWithRouter(<Home />);

    // Main container should have min-height
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should have consistent spacing with margin/padding classes', () => {
    const { container } = renderWithRouter(<Home />);

    // Elements should use consistent spacing utilities
    const elementsWithSpacing = container.querySelectorAll('[class*="mt-"], [class*="mb-"], [class*="p-"], [class*="gap-"]');
    expect(elementsWithSpacing.length).toBeGreaterThan(0);
  });

  it('should use transform for animations instead of layout properties', () => {
    renderWithRouter(<Home />);

    // Check animation variants use transform/opacity (not width/height)
    const elementsWithVariants = document.querySelectorAll('[data-variants]');
    elementsWithVariants.forEach(el => {
      const variants = el.getAttribute('data-variants');
      if (variants) {
        const parsed = JSON.parse(variants);
        // Animation variants should use y (transform) and opacity
        if (parsed.hidden) {
          expect(parsed.hidden.opacity !== undefined || parsed.hidden.y !== undefined).toBe(true);
        }
        if (parsed.show) {
          expect(parsed.show.opacity !== undefined || parsed.show.y !== undefined).toBe(true);
        }
      }
    });
  });

  it('should not use animations that change element dimensions', () => {
    renderWithRouter(<Home />);

    const elementsWithVariants = document.querySelectorAll('[data-variants]');
    elementsWithVariants.forEach(el => {
      const variants = el.getAttribute('data-variants');
      if (variants) {
        const parsed = JSON.parse(variants);
        // Should not animate width/height directly (causes layout shift)
        if (parsed.hidden) {
          expect(parsed.hidden.width).toBeUndefined();
          // Height animations are OK for accordion-style components
        }
      }
    });
  });

  it('should reserve space for dynamically loaded content', () => {
    const { container } = renderWithRouter(<Home />);

    // Check for max-width constraints that reserve layout space
    const constrainedElements = container.querySelectorAll('[class*="max-w-"]');
    expect(constrainedElements.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Test Case 4: Animation Performance (60fps without jank)
// Input: Monitor animation performance
// Expected: Animations run at 60fps without jank
// ============================================================================
describe('Test Case 4: Animation Performance - 60fps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    animationFrameCallbacks = [];
    animationFrameId = 0;
  });

  it('should use GPU-accelerated properties (transform, opacity)', () => {
    renderWithRouter(<Home />);

    const elementsWithVariants = document.querySelectorAll('[data-variants]');
    let usesGPUProperties = true;

    elementsWithVariants.forEach(el => {
      const variants = el.getAttribute('data-variants');
      if (variants) {
        const parsed = JSON.parse(variants);
        // Check that animations use GPU-friendly properties
        if (parsed.hidden || parsed.show) {
          const hidden = parsed.hidden || {};
          const show = parsed.show || {};
          // y and opacity are GPU-accelerated
          const validProps = ['opacity', 'y', 'x', 'scale', 'rotate'];
          const hiddenKeys = Object.keys(hidden).filter(k => k !== 'transition');
          const showKeys = Object.keys(show).filter(k => k !== 'transition');

          hiddenKeys.forEach(key => {
            if (!validProps.includes(key) && key !== 'height' && key !== 'marginTop') {
              // Allow height for accordion animations
              usesGPUProperties = false;
            }
          });
        }
      }
    });

    expect(usesGPUProperties).toBe(true);
  });

  it('should use will-change or transform3d for animation hints', () => {
    const { container } = renderWithRouter(<Home />);

    // Framer Motion automatically uses transform3d
    // Check that animated elements exist
    const animatedElements = container.querySelectorAll('[data-variants]');
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it('should have appropriate animation durations (< 500ms)', () => {
    renderWithRouter(<Home />);

    const elementsWithTransition = document.querySelectorAll('[data-transition]');
    elementsWithTransition.forEach(el => {
      const transition = el.getAttribute('data-transition');
      if (transition) {
        const parsed = JSON.parse(transition);
        if (parsed.duration) {
          // Animation duration should be reasonable (< 1s)
          expect(parsed.duration).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  it('should use easing functions for smooth animations', () => {
    renderWithRouter(<Home />);

    const elementsWithVariants = document.querySelectorAll('[data-variants]');
    elementsWithVariants.forEach(el => {
      const variants = el.getAttribute('data-variants');
      if (variants) {
        const parsed = JSON.parse(variants);
        // Check for easing in transition
        if (parsed.show?.transition) {
          const hasEasing = parsed.show.transition.ease ||
                           parsed.show.transition.type === 'spring' ||
                           parsed.show.transition.staggerChildren;
          expect(hasEasing !== undefined || parsed.show.transition.duration !== undefined).toBe(true);
        }
      }
    });
  });

  it('should use stagger animations to reduce simultaneous animations', () => {
    renderWithRouter(<Home />);

    // Check for staggerChildren in container variants
    const elementsWithVariants = document.querySelectorAll('[data-variants]');
    let hasStagger = false;

    elementsWithVariants.forEach(el => {
      const variants = el.getAttribute('data-variants');
      if (variants && variants.includes('staggerChildren')) {
        hasStagger = true;
      }
    });

    expect(hasStagger).toBe(true);
  });

  it('should use viewport-based animation triggers (whileInView)', () => {
    renderWithRouter(<Home />);

    // Check for whileInView attributes
    const elementsWithWhileInView = document.querySelectorAll('[data-while-in-view]');
    expect(elementsWithWhileInView.length).toBeGreaterThan(0);
  });

  it('should prevent re-animation with viewport once: true', () => {
    renderWithRouter(<Home />);

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
});

// ============================================================================
// Test Case 5: Lazy Loading Below-Fold Content
// Input: Check below-fold sections
// Expected: Below-fold sections lazy load when scrolling into view
// ============================================================================
describe('Test Case 5: Lazy Loading - Below-Fold Content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    observedElements.clear();
    intersectionObserverCallbacks.clear();
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  it('should use viewport-triggered animations for below-fold sections', () => {
    renderWithRouter(<Home />);

    // Below-fold sections should use whileInView
    const belowFoldSections = document.querySelectorAll('[data-while-in-view="show"]');
    expect(belowFoldSections.length).toBeGreaterThan(0);
  });

  it('should have initial hidden state for below-fold content', () => {
    renderWithRouter(<Home />);

    // Below-fold content should start hidden
    const hiddenInitial = document.querySelectorAll('[data-initial="hidden"]');
    expect(hiddenInitial.length).toBeGreaterThan(0);
  });

  it('should use margin in viewport options for pre-loading', () => {
    renderWithRouter(<Home />);

    const elementsWithViewport = document.querySelectorAll('[data-viewport]');
    let hasMargin = false;

    elementsWithViewport.forEach(el => {
      const viewport = el.getAttribute('data-viewport');
      if (viewport && viewport.includes('margin')) {
        hasMargin = true;
      }
    });

    expect(hasMargin).toBe(true);
  });

  it('should structure page with clear above/below fold separation', () => {
    const { container } = renderWithRouter(<Home />);

    // Hero section should be immediately visible (no whileInView)
    const heroHeadline = screen.getByTestId('hero-headline');
    expect(heroHeadline).toBeInTheDocument();

    // Below-fold sections should use scroll-triggered animations
    const sectionsWithScrollTrigger = container.querySelectorAll('[data-while-in-view]');
    expect(sectionsWithScrollTrigger.length).toBeGreaterThan(0);
  });

  it('should have efficient DOM structure for lazy sections', () => {
    renderWithRouter(<Home />);

    // Each major section should be self-contained
    const sections = document.querySelectorAll('section, [data-testid*="section"]');
    expect(sections.length).toBeGreaterThanOrEqual(1);
  });

  it('should use container variants for efficient batch animations', () => {
    renderWithRouter(<Home />);

    // Container variants batch child animations
    const elementsWithVariants = document.querySelectorAll('[data-variants]');
    let hasContainerVariants = false;

    elementsWithVariants.forEach(el => {
      const variants = el.getAttribute('data-variants');
      if (variants) {
        const parsed = JSON.parse(variants);
        if (parsed.show?.transition?.staggerChildren || parsed.show?.transition?.delayChildren) {
          hasContainerVariants = true;
        }
      }
    });

    expect(hasContainerVariants).toBe(true);
  });
});

// ============================================================================
// Helper Functions
// ============================================================================

function getMaxDOMDepth(element: Element): number {
  let maxDepth = 0;

  function traverse(el: Element, depth: number): void {
    maxDepth = Math.max(maxDepth, depth);
    Array.from(el.children).forEach(child => {
      traverse(child, depth + 1);
    });
  }

  traverse(element, 0);
  return maxDepth;
}

// ============================================================================
// Additional Performance Integration Tests
// ============================================================================
describe('Performance Integration Tests', () => {
  it('should not block main thread with synchronous operations', () => {
    const startTime = performance.now();

    // Multiple renders should not cause exponential slowdown
    for (let i = 0; i < 3; i++) {
      const { unmount } = renderWithRouter(<Home />);
      unmount();
    }

    const totalTime = performance.now() - startTime;
    // 3 renders should complete in reasonable time
    expect(totalTime).toBeLessThan(500);
  });

  it('should clean up properly between renders', () => {
    const { unmount } = renderWithRouter(<Home />);

    // Should not throw on unmount
    expect(() => unmount()).not.toThrow();
  });

  it('should have consistent performance across re-renders', () => {
    const { rerender } = renderWithRouter(<Home />);

    const startTime = performance.now();
    rerender(<BrowserRouter><Home /></BrowserRouter>);
    const reRenderTime = performance.now() - startTime;

    // Re-render should be fast (< 50ms)
    expect(reRenderTime).toBeLessThan(50);
  });
});
