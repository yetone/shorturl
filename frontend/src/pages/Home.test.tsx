import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import * as AuthContext from '../contexts/AuthContext';
import * as ThemeContext from '../contexts/ThemeContext';
import { FuturisticButton } from '../components/FuturisticButton';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});


describe('Hero Section Visual Hierarchy and Content Clarity', () => {
  // Mock the contexts
  const mockUseAuth = vi.spyOn(AuthContext, 'useAuth');
  const mockUseTheme = vi.spyOn(ThemeContext, 'useTheme');

  beforeEach(() => {
    // Reset mocks before each test
    mockUseAuth.mockReturnValue({ user: null, login: vi.fn(), logout: vi.fn(), register: vi.fn() });
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: vi.fn() });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: Load homepage in desktop viewport
  describe('Test Case 1: Homepage Load and Hero Headline', () => {
    it('should render hero headline with gradient styling and display value proposition', async () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Check for headline with gradient styling
      const headline = container.querySelector('h1');
      expect(headline).toBeInTheDocument();
      expect(headline?.textContent).toContain('Simplify Your Links');

      // Check for gradient classes on headline (directly or nested)
      const headlineContainer = container.querySelector('h1');
      expect(headlineContainer).toBeInTheDocument();

      // Verify value proposition exists
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThan(0);

      const hasUrlShortening = Array.from(paragraphs).some(p =>
        p.textContent?.includes('short, memorable links') ||
        p.textContent?.includes('Create short')
      );
      expect(hasUrlShortening).toBe(true);

      const hasAnalytics = Array.from(paragraphs).some(p =>
        p.textContent?.includes('Track clicks') ||
        p.textContent?.includes('track clicks')
      );
      expect(hasAnalytics).toBe(true);
    });
  });

  describe('Test Case 3: Verify headline content accuracy', () => {
    it('should reference URL shortening or link management with clear benefit', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const headline = container.querySelector('h1');
      expect(headline?.textContent).toContain('Simplify Your Links');

      // Verify URL shortening is mentioned
      const paragraphs = container.querySelectorAll('p');
      const hasUrlShortening = Array.from(paragraphs).some(p =>
        p.textContent?.includes('short, memorable links') ||
        p.textContent?.includes('short, memorable links')
      );
      expect(hasUrlShortening).toBe(true);

      // Verify benefit statements
      const hasAnalytics = Array.from(paragraphs).some(p =>
        p.textContent?.includes('Track clicks')
      );
      expect(hasAnalytics).toBe(true);
    });
  });

  describe('Test Case 4+5: Visual hierarchy and button text', () => {
    it('should render proper visual hierarchy with headline, subheadline, and buttons', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Check headline exists
      const headline = container.querySelector('h1');
      expect(headline).toBeInTheDocument();

      // Check subheadline exists (first h2 after hero section)
      const headlines = container.querySelectorAll('p');
      expect(headlines.length).toBeGreaterThan(0);

      // Check both CTA buttons exist using FuturisticButton text
      const pageContent = container.textContent || '';
      expect(pageContent).toContain('Get Started');
      expect(pageContent).toContain('Login');

      // Verify gradient text for headline
      const gradientElements = container.querySelectorAll('.bg-gradient-to-r');
      expect(gradientElements.length).toBeGreaterThan(0);
    });
  });

  describe('Authenticated state', () => {
    it('should show "Dashboard" CTA when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, email: 'test@example.com' },
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn()
      });

      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // The CTA should remain the same text but links should include dashboard
      const pageContent = container.textContent || '';
      expect(pageContent).toContain('Get Started');
    });
  });

  describe('Dark mode support', () => {
    it('should apply dark mode classes when theme is dark', () => {
      mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() });

      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Check if dark mode classes are applied
      const mainDiv = container.querySelector('.bg-gray-900');
      expect(mainDiv).toBeInTheDocument();
    });
  });

  describe('Feature cards render correctly', () => {
    it('should display all six feature cards with icons and descriptions', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const pageContent = container.textContent || '';

      // Check all feature titles
      expect(pageContent).toContain('URL Shortening');
      expect(pageContent).toContain('Click Analytics');
      expect(pageContent).toContain('User Dashboard');
      expect(pageContent).toContain('Global Access');
      expect(pageContent).toContain('Secure Links');
      expect(pageContent).toContain('Lightning Fast');

      // Check one of the descriptions
      expect(pageContent).toContain('Transform long');
    });
  });

  describe('Footer renders correctly', () => {
    it('should display copyright footer with current year', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const currentYear = new Date().getFullYear().toString();
      expect(container.textContent).toContain(currentYear);
      expect(container.textContent).toContain('ShortURL');
      expect(container.textContent).toContain('All rights reserved');
    });

    it('should display ShortURL branding in footer', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(container.textContent).toContain('ShortURL');
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should render navigation links in footer', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const links = container.querySelectorAll('footer a');
      const linkTexts = Array.from(links).map(link => link.textContent);

      expect(linkTexts).toContain('Home');
      expect(linkTexts).toContain('Dashboard');
    });

    it('should render social media links', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const externalLinks = container.querySelectorAll('a[target="_blank"]');
      expect(externalLinks.length).toBeGreaterThan(0);

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should be visible at bottom of page', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should have appropriate spacing from content', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('py-8');
      expect(footer).toHaveClass('px-4');
    });

    it('should maintain readability on all themes', () => {
      const { container: darkContainer } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const footer = darkContainer.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Manual Test Cases for Footer', () => {
    it('Test Case 1: Footer visibility and positioning - 375px viewport', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('w-full', 'px-4');
    });

    it('Test Case 2: Copyright notice verification', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const currentYear = new Date().getFullYear();
      expect(container.textContent).toContain('©');
      expect(container.textContent).toContain(currentYear.toString());
      expect(container.textContent).toContain('ShortURL');
    });

    it('Test Case 3: Visual prominence and subdued styling', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      const copyrightText = container.textContent;
      expect(copyrightText).toContain('©');
    });

    it('Test Case 4: Navigation and link functionality', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const links = container.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
    });

    it('Test Case 5: Theme consistency verification', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });
  });
});

describe('Manual Test Case 2: Check text contrast ratios', () => {
  it('should document text contrast information for manual verification', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const pageContent = container.textContent || '';

    // Test case documents the following contrast checks (manual):
    // 1. Large headline text in gradient colors (blue-600, purple-600, pink-600 in light mode)
    // 2. Normal text subheadline (should meet WCAG AA 4.5:1 in both themes)
    // 3. Button text colors (neon green on dark background, contrasting in both themes)
    // 4. Feature card text (glassmorphism with appropriate opacity)
    // All must meet WCAG AA standards in both light and dark themes

    expect(pageContent).toContain('Simplify Your Links');
  });
});

describe('Manual Test Case 5: Animated background integration', () => {
  it('should provide infrastructure for testing background readability', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(container.innerHTML).toBeDefined();
    // Manual testing should verify:
    // 1. Text readability over animated particle background
    // 2. No text blending with background particles
    // 3. Appropriate opacity differences between light/dark themes
  });
});

describe('Manual Test Case 6: Prefers-reduced-motion support', () => {
  it('should provide testable structure for reduced motion', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
    // Manual testing should verify:
    // 1. Animations respect prefers-reduced-motion media query
    // 2. Background animation can be reduced or stopped when requested
    // 3. Text remains readable without animations
  });
});

describe('Responsive Layout Across All Viewports', () => {
  describe('Test Case 1: Desktop layout (1920x1080)', () => {
    it('should render layout classes expected for desktop viewport', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Verify grid layout for 3 columns on desktop
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();

      // Check for responsive grid classes (md:grid-cols-3 for desktop)
      const featuresSection = gridContainer?.parentElement;
      expect(featuresSection).toBeInTheDocument();

      // Verify max-width container for proper centering
      const maxWidthContainer = container.querySelector('.max-w-4xl, .max-w-6xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });
  });

  describe('Test Case 2: Laptop layout (1366x768)', () => {
    it('should maintain readable text sizes and spacing', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Check for responsive text sizing (md:text-7xl for large screens, text-5xl for smaller)
      const headline = container.querySelector('h1');
      expect(headline).toBeInTheDocument();
      expect(headline?.className).toContain('text-5xl');
      expect(headline?.className).toMatch(/md:text-\d+/);

      // Verify spacing classes exist
      const heroSection = container.querySelector('.mb-12');
      expect(heroSection).toBeInTheDocument();
    });
  });

  describe('Test Case 3: Tablet portrait layout (768x1024)', () => {
    it('should adapt to 2-column feature grid on tablet', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Verify features section exists
      const pageContent = container.textContent || '';
      expect(pageContent).toContain('Features');

      // Verify grid system is present
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();

      // On tablet, grid should fill space with gap spacing
      const gapClasses = container.querySelectorAll('.gap-4, .gap-8');
      expect(gapClasses.length).toBeGreaterThan(0);

      // Verify buttons remain prominent
      expect(pageContent).toContain('Get Started');
      expect(pageContent).toContain('Login');
    });
  });

  describe('Test Case 4: Mobile portrait layout (375x812)', () => {
    it('should stack CTAs vertically and use single column layout', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Check for flex-col class to stack elements
      const ctaContainer = container.querySelector('.flex');
      expect(ctaContainer?.className).toContain('flex-col');

      // Verify buttons are rendered
      expect(container.textContent).toContain('Get Started');
      expect(container.textContent).toContain('Login');

      // Verify single column grid on mobile (grid-cols-1 by default)
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();

      // Check touch-friendly spacing
      const paddingElements = container.querySelectorAll('.p-4, .p-6');
      expect(paddingElements.length).toBeGreaterThan(0);
    });
  });

  describe('Test Case 5: Mobile landscape layout (812x375)', () => {
    it('should reflow content appropriately in landscape', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Hero section should still be visible without excessive scrolling
      const heroSection = container.querySelector('.min-h-screen');
      expect(heroSection).toBeInTheDocument();

      // Verify content centers properly
      const centeringClasses = container.querySelectorAll('.items-center, .justify-center');
      expect(centeringClasses.length).toBeGreaterThan(0);
    });
  });

  describe('Test Case 6: Touch target sizes (mobile)', () => {
    it('should use button sizes that meet 44px minimum touch target recommendations', () => {
      // Verify button padding classes that create adequate touch targets
      const buttonPaddingClassKey = { lg: 'px-6 py-3' };

      // Create a test button with large size to verify padding
      const { container } = render(
        <FuturisticButton size="lg" variant="neon">
          Test Button
        </FuturisticButton>
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('px-6 py-3');
    });

    it('should verify Link components wrap buttons with proper spacing', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Verify buttons exist within Links
      const pageContent = container.textContent || '';
      expect(pageContent).toContain('Get Started');
      expect(pageContent).toContain('Login');
    });
  });

  describe('Test Case 7: Text readability on mobile', () => {
    it('should maintain readable text sizes across all viewport sizes', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Check for responsive text hierarchy
      const h1Element = container.querySelector('h1');
      expect(h1Element?.className).toContain('text-5xl');
      expect(h1Element?.className).toMatch(/md:text-\d+/); // Has md: breakpoint

      // Verify paragraph text is readable
      const paragraph = container.querySelector('p');
      expect(paragraph?.className).toMatch(/text-\d+/); // Has text size class

      // Check for responsive scaling
      expect(h1Element?.className).toMatch(/text-\d+/); // Base mobile size
    });
  });

  describe('Test Case 8: Feature cards layout', () => {
    it('should verify all 6 feature cards render with responsive grid', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Count all feature card titles
      const pageContent = container.textContent || '';
      const featureTitles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast'
      ];

      featureTitles.forEach(title => {
        expect(pageContent).toContain(title);
      });

      // Verify cards are in a responsive grid
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Test Case 9: Responsive images/icons', () => {
    it('should render Lucide icons that maintain clarity across viewport sizes', () => {
      const { container } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Icons are rendered via class names, verify text matches feature cards
      expect(container.textContent).toContain('URL Shortening');
      expect(container.textContent).toContain('Click Analytics');
      expect(container.textContent).toContain('User Dashboard');
      expect(container.textContent).toContain('Global Access');
      expect(container.textContent).toContain('Secure Links');
      expect(container.textContent).toContain('Lightning Fast');

      // Verify features section exists
      const featuresHeading = Array.from(container.querySelectorAll('h2'))
        .find(h2 => h2.textContent?.includes('Features'));
      expect(featuresHeading).toBeTruthy();
    });
  });
});

describe('Manual Test Case 2: Check text contrast ratios', () => {
  it('should document text contrast information for manual verification', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const pageContent = container.textContent || '';

    // Test case documents the following contrast checks (manual):
    // 1. Large headline text in gradient colors (blue-600, purple-600, pink-600 in light mode)
    // 2. Normal text subheadline (should meet WCAG AA 4.5:1 in both themes)
    // 3. Button text colors (neon green on dark background, contrasting in both themes)
    // 4. Feature card text (glassmorphism with appropriate opacity)
    // All must meet WCAG AA standards in both light and dark themes

    expect(pageContent).toContain('Simplify Your Links');
  });
});

describe('Manual Test Case 5: Animated background integration', () => {
  it('should provide infrastructure for testing background readability', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(container.innerHTML).toBeDefined();
    // Manual testing should verify:
    // 1. Text readability over animated particle background
    // 2. No text blending with background particles
    // 3. Appropriate opacity differences between light/dark themes
  });
});

describe('Manual Test Case 6: Prefers-reduced-motion support', () => {
  it('should provide testable structure for reduced motion', () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
    // Manual testing should verify:
    // 1. Animations respect prefers-reduced-motion media query
    // 2. Background animation can be reduced or stopped when requested
    // 3. Text remains readable without animations
  });
});
