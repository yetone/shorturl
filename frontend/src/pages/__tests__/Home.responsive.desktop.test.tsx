import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Use vi.hoisted to create variables that can be used in vi.mock
const { createMotionComponent, MockBackgroundEffect, mockUseAuth, mockUseTheme } = vi.hoisted(() => {
  const createMotionComponent = (Tag: string) => {
    const MotionComponent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & Record<string, unknown>>(
      (props, ref) => {
        const {
          children,
          className,
          style,
          ...htmlProps
        } = props;
        // Filter out framer-motion specific props
        const filteredProps: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(htmlProps)) {
          if (!['whileHover', 'whileTap', 'variants', 'initial', 'animate', 'exit', 'transition', 'layoutId', 'viewport', 'whileInView', 'onHoverStart', 'onHoverEnd'].includes(key)) {
            filteredProps[key] = value;
          }
        }
        return React.createElement(Tag, { className, style, ref, ...filteredProps }, children);
      }
    );
    MotionComponent.displayName = `motion.${Tag}`;
    return MotionComponent;
  };

  const MockBackgroundEffect = () => React.createElement('div', { 'data-testid': 'background-effect' });

  const mockUseAuth = () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  });

  const mockUseTheme = () => ({
    theme: 'light',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  });

  return { createMotionComponent, MockBackgroundEffect, mockUseAuth, mockUseTheme };
});

// Mock framer-motion
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
    article: createMotionComponent('article'),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

// Mock ThemeContext
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: mockUseTheme,
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

/**
 * Responsive Layout Tests for Desktop Viewports (1024px - 2560px)
 *
 * These tests verify:
 * 1. Desktop layout with multi-column feature grid at 1024px viewport
 * 2. Content max-width constraints at 2560px viewport
 * 3. Feature cards display in 3-column grid layout
 */
describe('Home - Responsive Layout - Desktop', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    vi.clearAllMocks();
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    // Restore original window dimensions
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
    });
  });

  /**
   * Helper function to set viewport width
   */
  const setViewportWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      value: width,
      writable: true,
    });
    window.dispatchEvent(new Event('resize'));
  };

  describe('Test Case 1: Render Home at 1024px viewport width - Desktop layout with multi-column feature grid', () => {
    it('should render the homepage correctly at 1024px viewport width', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Verify main elements are present
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
    });

    it('should display the feature grid with md:grid-cols-3 class for desktop layout', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the features section grid container
      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      const gridContainer = featuresHeading.nextElementSibling;

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('should render all 6 feature cards in the grid at desktop width', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featureCards = document.querySelectorAll('.h-full.p-6');
      expect(featureCards).toHaveLength(6);
    });

    it('should display hero section with responsive text classes for desktop', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const headline = screen.getByRole('heading', { level: 1 });
      // md:text-7xl is applied at 768px and above
      expect(headline).toHaveClass('md:text-7xl');
    });

    it('should display CTA buttons in row layout (flex-row) at desktop width', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const buttonContainer = getStartedButton.closest('.flex');

      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass('md:flex-row');
    });
  });

  describe('Test Case 2: Check content max-width at 2560px - Content constrained to reasonable max-width', () => {
    it('should constrain hero section content with max-w-4xl at 2560px', () => {
      setViewportWidth(2560);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const headline = screen.getByRole('heading', { level: 1 });
      const heroContainer = headline.closest('.max-w-4xl');

      expect(heroContainer).toBeInTheDocument();
      expect(heroContainer).toHaveClass('max-w-4xl');
      expect(heroContainer).toHaveClass('mx-auto');
    });

    it('should constrain features section with max-w-6xl at 2560px', () => {
      setViewportWidth(2560);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      const featuresSection = featuresHeading.parentElement;

      expect(featuresSection).toBeInTheDocument();
      expect(featuresSection).toHaveClass('max-w-6xl');
      expect(featuresSection).toHaveClass('mx-auto');
    });

    it('should center content horizontally at 2560px viewport', () => {
      setViewportWidth(2560);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Hero section should be centered
      const headline = screen.getByRole('heading', { level: 1 });
      const heroContainer = headline.closest('.max-w-4xl');
      expect(heroContainer).toHaveClass('mx-auto');
      expect(heroContainer).toHaveClass('text-center');

      // Features section should be centered
      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      const featuresSection = featuresHeading.parentElement;
      expect(featuresSection).toHaveClass('mx-auto');
    });

    it('should ensure content does not stretch to full viewport width at 2560px', () => {
      setViewportWidth(2560);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // max-w-4xl = 56rem = 896px (hero)
      // max-w-6xl = 72rem = 1152px (features)
      // These are much smaller than 2560px viewport

      const heroContainer = screen.getByRole('heading', { level: 1 }).closest('.max-w-4xl');
      const featuresSection = screen.getByRole('heading', { name: /features/i }).parentElement;

      // Verify max-width classes are present which prevent stretching
      expect(heroContainer).toHaveClass('max-w-4xl');
      expect(featuresSection).toHaveClass('max-w-6xl');
    });
  });

  describe('Test Case 3: Verify feature grid at desktop size - 3-column grid layout', () => {
    it('should have grid container with md:grid-cols-3 for 3-column layout', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      const gridContainer = featuresHeading.nextElementSibling;

      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('should display exactly 6 feature cards that fit in 2 rows of 3', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const expectedTitles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast',
      ];

      expectedTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });

      // 6 cards in 3 columns = 2 rows
      const featureCards = document.querySelectorAll('.h-full.p-6');
      expect(featureCards).toHaveLength(6);
    });

    it('should have consistent gap-8 spacing between feature cards', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      const gridContainer = featuresHeading.nextElementSibling;

      expect(gridContainer).toHaveClass('gap-8');
    });

    it('should have each feature card with full height (h-full) for consistent grid rows', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featureCards = document.querySelectorAll('.h-full.p-6');

      featureCards.forEach(card => {
        expect(card).toHaveClass('h-full');
      });
    });

    it('should have proper grid structure at various desktop widths', () => {
      // Test at multiple desktop viewport widths
      const desktopWidths = [1024, 1280, 1440, 1920, 2560];

      desktopWidths.forEach(width => {
        setViewportWidth(width);

        const { unmount } = render(
          <TestWrapper>
            <Home />
          </TestWrapper>
        );

        const featuresHeading = screen.getByRole('heading', { name: /features/i });
        const gridContainer = featuresHeading.nextElementSibling;

        expect(gridContainer).toHaveClass('md:grid-cols-3');

        unmount();
      });
    });
  });

  describe('Additional Desktop Layout Tests', () => {
    it('should render all page sections at desktop width', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Background effect
      expect(screen.getByTestId('background-effect')).toBeInTheDocument();

      // Hero section
      expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
      expect(screen.getByText(/Create short, memorable links/i)).toBeInTheDocument();

      // CTA buttons
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

      // Features section
      expect(screen.getByRole('heading', { name: /features/i })).toBeInTheDocument();

      // Footer
      expect(screen.getByText(/ShortURL. All rights reserved/i)).toBeInTheDocument();
    });

    it('should apply proper z-index layering at desktop width', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Hero container should have z-10
      const heroContainer = screen.getByRole('heading', { level: 1 }).closest('.z-10');
      expect(heroContainer).toBeInTheDocument();

      // Features section should have z-10
      const featuresSection = screen.getByRole('heading', { name: /features/i }).parentElement;
      expect(featuresSection).toHaveClass('z-10');

      // Footer should have z-10
      const footer = screen.getByText(/ShortURL. All rights reserved/i).closest('.z-10');
      expect(footer).toBeInTheDocument();
    });

    it('should have responsive tagline text size at desktop', () => {
      setViewportWidth(1024);

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).toHaveClass('md:text-2xl');
    });
  });
});
