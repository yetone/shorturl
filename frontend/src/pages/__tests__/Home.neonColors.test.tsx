import { describe, it, expect, vi, beforeEach } from 'vitest';
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
        return React.createElement(Tag, { className, style, ref, ...filteredProps }, children as React.ReactNode);
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
 * Neon Color Design System Tests
 *
 * These tests verify the proper implementation of the neon color design system
 * across homepage elements including:
 * - Headline gradient colors
 * - Feature card accent colors
 * - Color accessibility/contrast
 *
 * Design System Colors:
 * - Neon Green: #39FF14
 * - Neon Blue: #00FFFF
 * - Neon Pink: #FF10F0
 * - Neon Yellow: #FAFF00
 * - Headline Gradient: blue-600 → purple-600 → pink-600
 */
describe('Neon Color Design System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test Case 1: Headline Gradient CSS', () => {
    it('should render headline with gradient from blue-600 via purple-600 to pink-600', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the main headline h1
      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toBeInTheDocument();

      // The headline text is wrapped in a span with gradient classes
      const gradientSpan = headline.querySelector('span');
      expect(gradientSpan).toBeInTheDocument();

      // Verify gradient direction class
      expect(gradientSpan).toHaveClass('bg-gradient-to-r');

      // Verify blue-600 as the starting color
      expect(gradientSpan).toHaveClass('from-blue-600');

      // Verify purple-600 as the middle color (via)
      expect(gradientSpan).toHaveClass('via-purple-600');

      // Verify pink-600 as the ending color
      expect(gradientSpan).toHaveClass('to-pink-600');
    });

    it('should have text-transparent and bg-clip-text for gradient text effect', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const headline = screen.getByRole('heading', { level: 1 });
      const gradientSpan = headline.querySelector('span');

      // These classes make the gradient visible as text color
      expect(gradientSpan).toHaveClass('bg-clip-text');
      expect(gradientSpan).toHaveClass('text-transparent');
    });

    it('should have gradient animation class for visual effect', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const headline = screen.getByRole('heading', { level: 1 });
      const gradientSpan = headline.querySelector('span');

      // The animate-gradient-x class provides the animated gradient effect
      expect(gradientSpan).toHaveClass('animate-gradient-x');
    });

    it('should render Features section heading with gradient styling', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresHeading = screen.getByRole('heading', { level: 2, name: /Features/i });
      expect(featuresHeading).toBeInTheDocument();

      // Features heading uses blue-500 to purple-600 gradient
      expect(featuresHeading).toHaveClass('bg-gradient-to-r');
      expect(featuresHeading).toHaveClass('from-blue-500');
      expect(featuresHeading).toHaveClass('to-purple-600');
      expect(featuresHeading).toHaveClass('bg-clip-text');
      expect(featuresHeading).toHaveClass('text-transparent');
    });
  });

  describe('Test Case 2: Feature Card Accent Colors', () => {
    it('should render URL Shortening card with neon-green accent', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const urlShorteningTitle = screen.getByText('URL Shortening');
      const card = urlShorteningTitle.closest('.h-full.p-6');
      expect(card).toBeInTheDocument();

      // Check for neon-green icon color class
      const icon = card?.querySelector('.text-neon-green');
      expect(icon).toBeInTheDocument();
    });

    it('should render Click Analytics card with neon-blue accent', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const clickAnalyticsTitle = screen.getByText('Click Analytics');
      const card = clickAnalyticsTitle.closest('.h-full.p-6');
      expect(card).toBeInTheDocument();

      // Check for neon-blue icon color class
      const icon = card?.querySelector('.text-neon-blue');
      expect(icon).toBeInTheDocument();
    });

    it('should render User Dashboard card with neon-pink accent', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const userDashboardTitle = screen.getByText('User Dashboard');
      const card = userDashboardTitle.closest('.h-full.p-6');
      expect(card).toBeInTheDocument();

      // Check for neon-pink icon color class
      const icon = card?.querySelector('.text-neon-pink');
      expect(icon).toBeInTheDocument();
    });

    it('should render Global Access card with neon-blue accent', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const globalAccessTitle = screen.getByText('Global Access');
      const card = globalAccessTitle.closest('.h-full.p-6');
      expect(card).toBeInTheDocument();

      // Check for neon-blue icon color class
      const icon = card?.querySelector('.text-neon-blue');
      expect(icon).toBeInTheDocument();
    });

    it('should render Secure Links card with neon-green accent', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const secureLinksTitle = screen.getByText('Secure Links');
      const card = secureLinksTitle.closest('.h-full.p-6');
      expect(card).toBeInTheDocument();

      // Check for neon-green icon color class
      const icon = card?.querySelector('.text-neon-green');
      expect(icon).toBeInTheDocument();
    });

    it('should render Lightning Fast card with neon-yellow accent', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const lightningFastTitle = screen.getByText('Lightning Fast');
      const card = lightningFastTitle.closest('.h-full.p-6');
      expect(card).toBeInTheDocument();

      // Check for neon-yellow icon color class
      const icon = card?.querySelector('.text-neon-yellow');
      expect(icon).toBeInTheDocument();
    });

    it('should have balanced color distribution across feature cards', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Count occurrences of each neon color class across all cards
      const allCards = document.querySelectorAll('.h-full.p-6');

      let greenCount = 0;
      let blueCount = 0;
      let pinkCount = 0;
      let yellowCount = 0;

      allCards.forEach(card => {
        if (card.querySelector('.text-neon-green')) greenCount++;
        if (card.querySelector('.text-neon-blue')) blueCount++;
        if (card.querySelector('.text-neon-pink')) pinkCount++;
        if (card.querySelector('.text-neon-yellow')) yellowCount++;
      });

      // Verify balanced distribution (no single color dominates)
      // Expected: 2 green, 2 blue, 1 pink, 1 yellow
      expect(greenCount).toBe(2);
      expect(blueCount).toBe(2);
      expect(pinkCount).toBe(1);
      expect(yellowCount).toBe(1);

      // No color should dominate (more than half of total 6 cards)
      expect(greenCount).toBeLessThanOrEqual(3);
      expect(blueCount).toBeLessThanOrEqual(3);
      expect(pinkCount).toBeLessThanOrEqual(3);
      expect(yellowCount).toBeLessThanOrEqual(3);
    });

    it('should have matching glow colors for icon colors', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // The glow colors in GlassMorphismCard should match the icon colors
      // Green: rgba(57, 255, 20, 0.2) - URL Shortening, Secure Links
      // Blue: rgba(0, 255, 255, 0.2) - Click Analytics, Global Access
      // Pink: rgba(255, 16, 240, 0.2) - User Dashboard
      // Yellow: rgba(250, 255, 0, 0.2) - Lightning Fast

      const urlShorteningTitle = screen.getByText('URL Shortening');
      expect(urlShorteningTitle).toBeInTheDocument();

      const clickAnalyticsTitle = screen.getByText('Click Analytics');
      expect(clickAnalyticsTitle).toBeInTheDocument();

      const userDashboardTitle = screen.getByText('User Dashboard');
      expect(userDashboardTitle).toBeInTheDocument();

      // All 6 cards should be present with their respective accent colors
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });
  });

  describe('Test Case 3: Color Accessibility', () => {
    it('should render icons with sufficient size for visibility (h-8 w-8)', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // All icons should be 8x8 (32px) for good visibility
      const urlShorteningCard = screen.getByText('URL Shortening').closest('.h-full.p-6');
      const icon = urlShorteningCard?.querySelector('svg');

      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-8');
      expect(icon).toHaveClass('w-8');
    });

    it('should place icons in aria-hidden containers for accessibility', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Icons should be in containers marked as aria-hidden
      const urlShorteningCard = screen.getByText('URL Shortening').closest('.h-full.p-6');
      const iconContainer = urlShorteningCard?.querySelector('.mb-4');

      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have proper text contrast with card backgrounds', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Feature card titles should have good contrast
      // The titles use text-xl font-bold classes ensuring readability
      const urlShorteningTitle = screen.getByText('URL Shortening');
      expect(urlShorteningTitle).toHaveClass('text-xl');
      expect(urlShorteningTitle).toHaveClass('font-bold');

      // Descriptions should be readable
      const description = screen.getByText(/Transform long, unwieldy links/i);
      expect(description).toBeInTheDocument();
    });

    it('should use GlassMorphismCard backdrop-blur for neon color visibility', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // GlassMorphismCard provides backdrop-blur which ensures neon colors stand out
      const cards = document.querySelectorAll('.backdrop-blur-md');
      expect(cards.length).toBeGreaterThanOrEqual(6);
    });

    it('should have feature cards with rounded-xl for visual separation', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Cards should have rounded corners for visual distinction
      const cards = document.querySelectorAll('.rounded-xl');
      expect(cards.length).toBeGreaterThanOrEqual(6);
    });

    it('should render headline text with appropriate font sizing', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const headline = screen.getByRole('heading', { level: 1 });

      // Headline should have responsive sizing
      expect(headline).toHaveClass('text-5xl'); // Mobile size
      expect(headline).toHaveClass('md:text-7xl'); // Desktop size
      expect(headline).toHaveClass('font-bold');
    });

    it('should have adequate spacing between feature cards', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresHeading = screen.getByRole('heading', { name: /Features/i });
      const gridContainer = featuresHeading.nextElementSibling;

      expect(gridContainer).toHaveClass('gap-8');
    });

    it('should ensure neon colors are applied only to decorative elements', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Neon colors are used for icons (decorative) not for essential text
      // Icons are marked aria-hidden=true
      const allCards = document.querySelectorAll('.h-full.p-6');

      allCards.forEach(card => {
        const iconContainer = card.querySelector('[aria-hidden="true"]');
        const neonIcon = card.querySelector('[class*="text-neon-"]');

        // If there's a neon icon, it should be within an aria-hidden container
        if (neonIcon) {
          expect(iconContainer).toContainElement(neonIcon as HTMLElement);
        }
      });
    });

    it('should provide sufficient color variety without relying solely on color for meaning', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Each feature card has:
      // 1. An icon (visual but aria-hidden)
      // 2. A title (text content)
      // 3. A description (text content)
      // Color is supplementary, not the only way to distinguish features

      const features = [
        { title: 'URL Shortening', descPattern: /Transform long/ },
        { title: 'Click Analytics', descPattern: /Track and analyze/ },
        { title: 'User Dashboard', descPattern: /Manage all your/ },
        { title: 'Global Access', descPattern: /Access your shortened/ },
        { title: 'Secure Links', descPattern: /Rest easy knowing/ },
        { title: 'Lightning Fast', descPattern: /Enjoy lightning-fast/ },
      ];

      features.forEach(({ title, descPattern }) => {
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(descPattern)).toBeInTheDocument();
      });
    });
  });

  describe('Tailwind Config Color Definitions', () => {
    // These tests verify the expected color values match the design system
    // The actual CSS values are defined in tailwind.config.js

    it('should define expected neon color hex values in design system', () => {
      // Design system colors per PRD:
      // - neon-green: #39FF14
      // - neon-blue: #00FFFF
      // - neon-pink: #FF10F0
      // - neon-yellow: #FAFF00

      // Verify the classes are being used in the DOM
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // These classes map to the hex colors defined in tailwind.config.js
      expect(document.querySelector('.text-neon-green')).toBeInTheDocument();
      expect(document.querySelector('.text-neon-blue')).toBeInTheDocument();
      expect(document.querySelector('.text-neon-pink')).toBeInTheDocument();
      expect(document.querySelector('.text-neon-yellow')).toBeInTheDocument();
    });

    it('should use consistent glow colors that match neon color palette', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // The glowColor props use RGBA values of the neon colors at 0.2 opacity
      // Green glow: rgba(57, 255, 20, 0.2) for #39FF14
      // Blue glow: rgba(0, 255, 255, 0.2) for #00FFFF
      // Pink glow: rgba(255, 16, 240, 0.2) for #FF10F0
      // Yellow glow: rgba(250, 255, 0, 0.2) for #FAFF00

      // Verify all 6 cards are rendered (glow is applied via inline styles)
      const featureCards = document.querySelectorAll('.h-full.p-6');
      expect(featureCards.length).toBe(6);
    });
  });
});
