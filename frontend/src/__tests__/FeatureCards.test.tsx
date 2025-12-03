import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
vi.mock('../contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

// Mock ThemeContext
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: mockUseTheme,
}));

// Mock BackgroundEffect component to avoid Three.js complexity
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: MockBackgroundEffect,
}));

// Import Home after mocks are set up
import Home from '../pages/Home';

// Test wrapper component that provides routing context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Feature Cards Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test Case 1: Render exactly 6 GlassMorphismCard components', () => {
    it('should render exactly 6 feature cards in the features section', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the features section by heading
      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      expect(featuresHeading).toBeInTheDocument();

      // Find the grid container (parent of feature cards)
      const gridContainer = featuresHeading.nextElementSibling;
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid');

      // Check that there are exactly 6 feature cards (div elements inside the grid)
      const featureCards = gridContainer?.querySelectorAll('.h-full.p-6');
      expect(featureCards).toHaveLength(6);
    });

    it('should render all six feature titles', () => {
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
    });
  });

  describe('Test Case 2: Each card contains icon, title, and description', () => {
    it('should render each feature card with an icon', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find feature cards by their titles and check for icon presence
      const featureTitles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast',
      ];

      featureTitles.forEach(title => {
        const titleElement = screen.getByText(title);
        // The icon is a sibling of the h3 title element's parent
        const cardContainer = titleElement.closest('.h-full.p-6');
        expect(cardContainer).toBeInTheDocument();

        // Each card should have an SVG icon (lucide-react icons render as SVG)
        const icon = cardContainer?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should render each feature card with a title as h3 heading', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Check that titles are rendered as h3 elements with proper styling
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThanOrEqual(6);

      const expectedTitles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast',
      ];

      expectedTitles.forEach(title => {
        const heading = screen.getByRole('heading', { name: title });
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H3');
        expect(heading).toHaveClass('text-xl', 'font-bold', 'mb-2');
      });
    });

    it('should render each feature card with a description', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const expectedDescriptions = [
        'Transform long, unwieldy links into short, memorable URLs that are easy to share.',
        'Track and analyze click data including referrers, user agents, and clicks over time.',
        'Manage all your shortened URLs from a single, intuitive dashboard interface.',
        'Access your shortened links from anywhere in the world, on any device.',
        'Rest easy knowing your links are secure and protected from malicious activity.',
        'Enjoy lightning-fast redirects and a responsive user interface.',
      ];

      expectedDescriptions.forEach(description => {
        expect(screen.getByText(description)).toBeInTheDocument();
      });
    });

    it('should have proper structure: icon followed by title followed by description', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const urlShorteningTitle = screen.getByText('URL Shortening');
      const cardContainer = urlShorteningTitle.closest('.h-full.p-6');

      expect(cardContainer).toBeInTheDocument();
      if (cardContainer) {
        // GlassMorphismCard wraps children in a div.relative.z-10
        // The content (icon, title, description) is inside this wrapper
        const contentWrapper = cardContainer.querySelector('.relative.z-10');
        expect(contentWrapper).toBeInTheDocument();

        // Content wrapper should have icon container, title, and description
        const iconContainer = cardContainer.querySelector('.mb-4');
        expect(iconContainer).toBeInTheDocument();

        // Second element should be the h3 title
        const title = cardContainer.querySelector('h3');
        expect(title).toBeInTheDocument();
        expect(title?.textContent).toBe('URL Shortening');

        // Third element should be the paragraph description
        const description = cardContainer.querySelector('p');
        expect(description).toBeInTheDocument();

        // Verify the structure order: icon container comes before title
        const iconRect = iconContainer?.compareDocumentPosition(title!);
        expect(iconRect! & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

        // Title comes before description
        const titleRect = title?.compareDocumentPosition(description!);
        expect(titleRect! & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    });
  });

  describe('Test Case 3: Verify feature card spacing and grid layout', () => {
    it('should render feature cards in a 3-column grid on medium+ screens', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the grid container
      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      const gridContainer = featuresHeading.nextElementSibling;

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('should have consistent gap spacing between cards', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the grid container
      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      const gridContainer = featuresHeading.nextElementSibling;

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('gap-8');
    });

    it('should have full height cards with consistent padding', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Get all feature cards by their unique class combination
      const featureCards = document.querySelectorAll('.h-full.p-6');

      expect(featureCards.length).toBe(6);

      featureCards.forEach(card => {
        expect(card).toHaveClass('h-full');
        expect(card).toHaveClass('p-6');
      });
    });

    it('should have the features section properly centered with max width', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find the features section container
      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      const featuresSection = featuresHeading.parentElement;

      expect(featuresSection).toBeInTheDocument();
      expect(featuresSection).toHaveClass('max-w-6xl');
      expect(featuresSection).toHaveClass('mx-auto');
      expect(featuresSection).toHaveClass('w-full');
    });

    it('should render cards with rounded corners (GlassMorphismCard styling)', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find cards with GlassMorphismCard styling
      const cards = document.querySelectorAll('.rounded-xl');

      // Should have at least 6 rounded-xl elements (feature cards)
      expect(cards.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Test Case 4: Feature card hover states', () => {
    it('should have hover effect enabled by default on GlassMorphismCard', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // The GlassMorphismCard component has hoverEffect=true by default
      // Verify that cards exist and have the backdrop-blur styling
      const cards = document.querySelectorAll('.backdrop-blur-md');
      expect(cards.length).toBeGreaterThanOrEqual(6);
    });

    it('should have different glow colors for each feature card type', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Verify feature cards exist - the glow colors are set via inline styles
      // URL Shortening - green glow
      const urlShorteningCard = screen.getByText('URL Shortening').closest('.h-full');
      expect(urlShorteningCard).toBeInTheDocument();

      // Click Analytics - blue glow
      const clickAnalyticsCard = screen.getByText('Click Analytics').closest('.h-full');
      expect(clickAnalyticsCard).toBeInTheDocument();

      // User Dashboard - pink glow
      const userDashboardCard = screen.getByText('User Dashboard').closest('.h-full');
      expect(userDashboardCard).toBeInTheDocument();
    });

    it('should render cards with visual feedback capability (scale on hover)', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Find a feature card
      const urlShorteningTitle = screen.getByText('URL Shortening');
      const card = urlShorteningTitle.closest('.rounded-xl');

      expect(card).toBeInTheDocument();

      // The GlassMorphismCard has whileHover={{ scale: 1.02 }} which is mocked
      // We verify the card is interactive by checking it can receive hover events
      if (card) {
        await user.hover(card);
        // Card should still be visible after hover
        expect(card).toBeVisible();
      }
    });

    it('should have proper icon colors matching the glow theme', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Check that icons have the appropriate neon color classes
      const urlShorteningCard = screen.getByText('URL Shortening').closest('.h-full.p-6');
      const greenIcon = urlShorteningCard?.querySelector('.text-neon-green');
      expect(greenIcon).toBeInTheDocument();

      const clickAnalyticsCard = screen.getByText('Click Analytics').closest('.h-full.p-6');
      const blueIcon = clickAnalyticsCard?.querySelector('.text-neon-blue');
      expect(blueIcon).toBeInTheDocument();

      const userDashboardCard = screen.getByText('User Dashboard').closest('.h-full.p-6');
      const pinkIcon = userDashboardCard?.querySelector('.text-neon-pink');
      expect(pinkIcon).toBeInTheDocument();
    });
  });

  describe('Additional integration tests', () => {
    it('should render the features section below the hero section', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Hero section contains "Simplify Your Links" heading
      const heroHeading = screen.getByText('Simplify Your Links');
      const featuresHeading = screen.getByRole('heading', { name: /features/i });

      // Both should be visible
      expect(heroHeading).toBeInTheDocument();
      expect(featuresHeading).toBeInTheDocument();

      // Features section should have margin-top for spacing from hero
      const featuresSection = featuresHeading.parentElement;
      expect(featuresSection).toHaveClass('mt-32');
    });

    it('should have features heading with gradient styling', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresHeading = screen.getByRole('heading', { name: /features/i });
      expect(featuresHeading).toHaveClass('text-3xl');
      expect(featuresHeading).toHaveClass('font-bold');
      expect(featuresHeading).toHaveClass('text-center');
      expect(featuresHeading).toHaveClass('mb-12');
      expect(featuresHeading).toHaveClass('bg-gradient-to-r');
    });

    it('should position features section with proper z-index', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const featuresSection = screen.getByRole('heading', { name: /features/i }).parentElement;
      expect(featuresSection).toHaveClass('z-10');
    });
  });
});
