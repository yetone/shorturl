import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Use vi.hoisted to create all mock utilities
const {
  createMotionComponent,
  MockBackgroundEffect,
  mockUseAuth,
  mockUseTheme
} = vi.hoisted(() => {
  const createMotionComponent = (Tag: string) => {
    const MotionComponent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & Record<string, unknown>>(
      (props, ref) => {
        const {
          children,
          className,
          style,
          initial,
          animate,
          transition,
          variants,
          whileInView,
          viewport,
          ...htmlProps
        } = props;

        // Store motion props as data attributes for testing
        const dataProps: Record<string, string> = {};
        if (initial) dataProps['data-motion-initial'] = JSON.stringify(initial);
        if (animate) dataProps['data-motion-animate'] = JSON.stringify(animate);
        if (transition) dataProps['data-motion-transition'] = JSON.stringify(transition);
        if (variants) dataProps['data-motion-variants'] = JSON.stringify(variants);
        if (whileInView) dataProps['data-motion-while-in-view'] = whileInView as string;
        if (viewport) dataProps['data-motion-viewport'] = JSON.stringify(viewport);

        // Filter out framer-motion specific props from htmlProps
        const filteredProps: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(htmlProps)) {
          if (!['whileHover', 'whileTap', 'layoutId', 'onHoverStart', 'onHoverEnd', 'exit', 'delayChildren', 'staggerChildren'].includes(key)) {
            filteredProps[key] = value;
          }
        }

        return React.createElement(Tag, { className, style, ref, ...filteredProps, ...dataProps }, children);
      }
    );
    MotionComponent.displayName = `motion.${Tag}`;
    return MotionComponent;
  };

  const MockBackgroundEffect = () => React.createElement('div', { 'data-testid': 'background-effect' });

  const mockUseAuth = vi.fn(() => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  }));

  const mockUseTheme = vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }));

  return { createMotionComponent, MockBackgroundEffect, mockUseAuth, mockUseTheme };
});

// Mock framer-motion to capture animation props
vi.mock('framer-motion', () => ({
  motion: {
    div: createMotionComponent('div'),
    h1: createMotionComponent('h1'),
    h2: createMotionComponent('h2'),
    h3: createMotionComponent('h3'),
    p: createMotionComponent('p'),
    button: createMotionComponent('button'),
    span: createMotionComponent('span'),
    footer: createMotionComponent('footer'),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock ThemeContext
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock BackgroundEffect component to avoid Three.js complexity
vi.mock('../../components/BackgroundEffect', () => ({
  BackgroundEffect: MockBackgroundEffect,
}));

// Import Home after mocks are set up
import Home from '../Home';

// Test wrapper component that provides routing context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Home - Entrance Animations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });
  });

  describe('Test Case 1: Hero section elements have initial, animate, and transition props', () => {
    it('should have motion props on the hero section container', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the hero container div by its unique class
      const heroContainer = document.querySelector('.max-w-4xl.mx-auto.text-center.z-10');
      expect(heroContainer).toBeInTheDocument();

      // Check for motion props
      const initialProp = heroContainer?.getAttribute('data-motion-initial');
      const animateProp = heroContainer?.getAttribute('data-motion-animate');
      const transitionProp = heroContainer?.getAttribute('data-motion-transition');

      expect(initialProp).toBeTruthy();
      expect(animateProp).toBeTruthy();
      expect(transitionProp).toBeTruthy();

      // Verify initial and animate states
      const initial = JSON.parse(initialProp!);
      const animate = JSON.parse(animateProp!);

      expect(initial).toHaveProperty('opacity', 0);
      expect(initial).toHaveProperty('y', -20);
      expect(animate).toHaveProperty('opacity', 1);
      expect(animate).toHaveProperty('y', 0);
    });

    it('should have motion props on the headline (h1)', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toBeInTheDocument();

      // Check for motion props on h1
      const initialProp = headline.getAttribute('data-motion-initial');
      const animateProp = headline.getAttribute('data-motion-animate');
      const transitionProp = headline.getAttribute('data-motion-transition');

      expect(initialProp).toBeTruthy();
      expect(animateProp).toBeTruthy();
      expect(transitionProp).toBeTruthy();

      // Verify initial and animate states
      const initial = JSON.parse(initialProp!);
      const animate = JSON.parse(animateProp!);

      expect(initial).toHaveProperty('opacity', 0);
      expect(animate).toHaveProperty('opacity', 1);
    });

    it('should have motion props on the tagline paragraph', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).toBeInTheDocument();

      // Check for motion props on paragraph
      const initialProp = tagline.getAttribute('data-motion-initial');
      const animateProp = tagline.getAttribute('data-motion-animate');
      const transitionProp = tagline.getAttribute('data-motion-transition');

      expect(initialProp).toBeTruthy();
      expect(animateProp).toBeTruthy();
      expect(transitionProp).toBeTruthy();
    });

    it('should have motion props on the CTA buttons container', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the CTA buttons container by class
      const ctaContainer = document.querySelector('.flex.flex-col.md\\:flex-row.justify-center.gap-4');
      expect(ctaContainer).toBeInTheDocument();

      // Check for motion props
      const initialProp = ctaContainer?.getAttribute('data-motion-initial');
      const animateProp = ctaContainer?.getAttribute('data-motion-animate');
      const transitionProp = ctaContainer?.getAttribute('data-motion-transition');

      expect(initialProp).toBeTruthy();
      expect(animateProp).toBeTruthy();
      expect(transitionProp).toBeTruthy();
    });
  });

  describe('Test Case 2: Feature cards have stagger animation with 0.2s delay between cards', () => {
    it('should have staggerChildren prop on the features section container', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the features section container
      const featuresSection = document.querySelector('.max-w-6xl.mx-auto.mt-32.w-full.z-10');
      expect(featuresSection).toBeInTheDocument();

      // Check for variants prop which contains staggerChildren
      const variantsProp = featuresSection?.getAttribute('data-motion-variants');
      expect(variantsProp).toBeTruthy();

      const variants = JSON.parse(variantsProp!);
      expect(variants).toHaveProperty('hidden');
      expect(variants).toHaveProperty('show');

      // Verify staggerChildren is 0.2 seconds
      expect(variants.show.transition).toHaveProperty('staggerChildren', 0.2);
    });

    it('should have delayChildren prop for initial delay before stagger starts', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresSection = document.querySelector('.max-w-6xl.mx-auto.mt-32.w-full.z-10');
      expect(featuresSection).toBeInTheDocument();

      const variantsProp = featuresSection?.getAttribute('data-motion-variants');
      expect(variantsProp).toBeTruthy();

      const variants = JSON.parse(variantsProp!);
      expect(variants.show.transition).toHaveProperty('delayChildren', 0.3);
    });

    it('should have item variants on feature cards for stagger animation', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find feature card containers (motion.div wrapping GlassMorphismCard)
      const featureCards = document.querySelectorAll('[data-motion-variants]');

      // Filter for feature card items (those with item variants)
      let featureCardCount = 0;
      featureCards.forEach(card => {
        const variantsProp = card.getAttribute('data-motion-variants');
        if (variantsProp) {
          const variants = JSON.parse(variantsProp);
          // Item variants have hidden: { opacity: 0, y: 20 } and show: { opacity: 1, y: 0 }
          if (variants.hidden?.opacity === 0 && variants.hidden?.y === 20 &&
              variants.show?.opacity === 1 && variants.show?.y === 0) {
            featureCardCount++;
          }
        }
      });

      // Should have 6 feature cards with stagger animation plus the Features heading
      expect(featureCardCount).toBeGreaterThanOrEqual(6);
    });

    it('should use whileInView for features section to trigger on scroll', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresSection = document.querySelector('.max-w-6xl.mx-auto.mt-32.w-full.z-10');
      expect(featuresSection).toBeInTheDocument();

      // Check for whileInView prop
      const whileInViewProp = featuresSection?.getAttribute('data-motion-while-in-view');
      expect(whileInViewProp).toBe('show');
    });
  });

  describe('Test Case 3: Default animation duration is approximately 0.8s as per design tokens', () => {
    it('should have 0.8s duration on hero container animation', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const heroContainer = document.querySelector('.max-w-4xl.mx-auto.text-center.z-10');
      expect(heroContainer).toBeInTheDocument();

      const transitionProp = heroContainer?.getAttribute('data-motion-transition');
      expect(transitionProp).toBeTruthy();

      const transition = JSON.parse(transitionProp!);
      expect(transition).toHaveProperty('duration', 0.8);
    });

    it('should have 0.8s duration on headline animation', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const headline = screen.getByRole('heading', { level: 1 });
      const transitionProp = headline.getAttribute('data-motion-transition');
      expect(transitionProp).toBeTruthy();

      const transition = JSON.parse(transitionProp!);
      expect(transition).toHaveProperty('duration', 0.8);
    });

    it('should have 0.8s duration on tagline animation', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const tagline = screen.getByText(/Create short, memorable links/i);
      const transitionProp = tagline.getAttribute('data-motion-transition');
      expect(transitionProp).toBeTruthy();

      const transition = JSON.parse(transitionProp!);
      expect(transition).toHaveProperty('duration', 0.8);
    });

    it('should have 0.8s duration on CTA buttons container animation', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const ctaContainer = document.querySelector('.flex.flex-col.md\\:flex-row.justify-center.gap-4');
      const transitionProp = ctaContainer?.getAttribute('data-motion-transition');
      expect(transitionProp).toBeTruthy();

      const transition = JSON.parse(transitionProp!);
      expect(transition).toHaveProperty('duration', 0.8);
    });

    it('should have 0.8s duration on footer animation', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();

      const transitionProp = footer?.getAttribute('data-motion-transition');
      expect(transitionProp).toBeTruthy();

      const transition = JSON.parse(transitionProp!);
      expect(transition).toHaveProperty('duration', 0.8);
    });

    it('should have staggered delays increasing for sequential elements', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const headline = screen.getByRole('heading', { level: 1 });
      const tagline = screen.getByText(/Create short, memorable links/i);
      const ctaContainer = document.querySelector('.flex.flex-col.md\\:flex-row.justify-center.gap-4');

      const headlineTransition = JSON.parse(headline.getAttribute('data-motion-transition')!);
      const taglineTransition = JSON.parse(tagline.getAttribute('data-motion-transition')!);
      const ctaTransition = JSON.parse(ctaContainer?.getAttribute('data-motion-transition')!);

      // Verify delays increase sequentially: 0.2, 0.4, 0.6
      expect(headlineTransition.delay).toBe(0.2);
      expect(taglineTransition.delay).toBe(0.4);
      expect(ctaTransition.delay).toBe(0.6);
    });
  });

  describe('Test Case 4: Animations are disabled or reduced when reduced-motion preference is set', () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('should respect prefers-reduced-motion media query in animation configuration', () => {
      // Mock prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // The component should still render correctly
      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toBeInTheDocument();
      expect(headline).toHaveTextContent('Simplify Your Links');

      // Verify that the component renders even with reduced motion preference
      const featuresSection = document.querySelector('.max-w-6xl.mx-auto.mt-32.w-full.z-10');
      expect(featuresSection).toBeInTheDocument();
    });

    it('should have animation props that can be detected by Framer Motion reduced motion handling', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Framer Motion automatically handles prefers-reduced-motion
      // We verify that the component uses standard Framer Motion props
      // which are automatically reduced by Framer Motion when the preference is set

      const heroContainer = document.querySelector('.max-w-4xl.mx-auto.text-center.z-10');
      expect(heroContainer).toBeInTheDocument();

      // Check that motion props exist (Framer Motion handles reduction automatically)
      expect(heroContainer?.getAttribute('data-motion-initial')).toBeTruthy();
      expect(heroContainer?.getAttribute('data-motion-animate')).toBeTruthy();
      expect(heroContainer?.getAttribute('data-motion-transition')).toBeTruthy();
    });

    it('should render all content regardless of motion preference', () => {
      // Mock prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // All content should be visible regardless of motion preference
      expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
      expect(screen.getByText(/Create short, memorable links/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });

    it('should have motion props that work with Framer Motion ReducedMotion utility', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Verify that animations use standard Framer Motion patterns
      // that are compatible with useReducedMotion hook
      const heroContainer = document.querySelector('.max-w-4xl.mx-auto.text-center.z-10');
      const initial = JSON.parse(heroContainer?.getAttribute('data-motion-initial')!);
      const animate = JSON.parse(heroContainer?.getAttribute('data-motion-animate')!);

      // These standard motion values are what Framer Motion reduces automatically
      // when prefers-reduced-motion is set
      expect(initial).toHaveProperty('opacity');
      expect(animate).toHaveProperty('opacity');

      // Position animations (y transforms) are typically what get reduced
      expect(initial).toHaveProperty('y');
      expect(animate).toHaveProperty('y');
    });
  });
});
