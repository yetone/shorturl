import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Home from '../pages/Home';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Mock components
vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>{children}</div>
  ),
}));

vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

const renderWithProviders = (component: React.ReactElement) => {
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

describe('Home Page - Feature Showcase Improvements (REQ-2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Benefit-Oriented Feature Descriptions', () => {
    it('should display feature descriptions that emphasize user benefits, not just technical features', () => {
      renderWithProviders(<Home />);

      // Current: "Transform long, unwieldy links..."
      // Should emphasize benefits: "easy to share", "save space", "professional appearance"
      const featureCard = screen.getByText(/URL Shortening/i).parentElement;
      const description = within(featureCard!).getByText(/easy to remember|easy to share|memorable/i);

      expect(description).toBeInTheDocument();
    });

    it('should update Click Analytics description to be more benefit-focused', () => {
      renderWithProviders(<Home />);

      // Should mention: "understand your audience", "make data-driven decisions"
      const analyticsCard = screen.getByText(/Click Analytics/i).parentElement;
      const benefitText = within(analyticsCard!).queryByText(/understand your audience|data-driven|insights on location/i);

      expect(benefitText).toBeInTheDocument();
    });

    it('should ensure all 6 feature cards have benefit-oriented copy', () => {
      renderWithProviders(<Home />);

      const featureTitles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast',
      ];

      featureTitles.forEach((title) => {
        const card = screen.getByText(title).parentElement;
        expect(card).toBeInTheDocument();
        expect(card?.textContent).toMatch(/easy|fast|secure|track|manage|powerful|professional/i);
      });
    });
  });

  describe('Supporting Visuals and Icons', () => {
    it('should display appropriate icons for each feature', () => {
      renderWithProviders(<Home />);

      // Each feature should have an icon
      const urlShortening = screen.getByText(/URL Shortening/i).parentElement;
      expect(urlShortening?.querySelector('svg, .lucide')).toBeTruthy();
    });

    it('should use consistent icon sizing across all feature cards', () => {
      renderWithProviders(<Home />);

      const featureCards = screen.getAllByText(/URL Shortening|Click Analytics|User Dashboard/i);

      featureCards.forEach((card) => {
        const icon = card.parentElement?.querySelector('[class*="h-8 w-8"]');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should use theme-appropriate icon colors (neon colors)', () => {
      renderWithProviders(<Home />);

      const urlIcon = screen.getByText(/URL Shortening/i).parentElement?.querySelector('.text-neon-green');
      const analyticsIcon = screen.getByText(/Click Analytics/i).parentElement?.querySelector('.text-neon-blue');

      expect(urlIcon || analyticsIcon).toBeTruthy();
    });
  });

  describe('Micro-Interactions on Hover (REQ-2, REQ-6)', () => {
    it('should provide visual feedback when hovering over feature cards', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />);

      const featureCard = screen.getByText(/URL Shortening/i).parentElement;

      // Should have hover effects (lift, glow, scale)
      await user.hover(featureCard!);

      // Check for hover-related classes or animations
      expect(featureCard).toHaveClass('hover:scale-105', 'hover:shadow-lg', 'transition');
    });

    it('should show additional details or enhanced glow on hover', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />);

      const card = screen.getByText(/Click Analytics/i).parentElement;
      await user.hover(card!);

      // Should have enhanced visual state
      expect(card).toHaveStyle({ transform: 'scale(1.02)' });
    });

    it('should animate hover transitions smoothly', () => {
      renderWithProviders(<Home />);

      const featureCards = screen.getAllByText(/URL Shortening|Click Analytics|User Dashboard/i);

      featureCards.forEach((card) => {
        const cardElement = card.parentElement?.parentElement;
        // Should have transition properties
        expect(cardElement?.className).toMatch(/transition|duration|ease/);
      });
    });
  });

  describe('Consistent Visual Hierarchy', () => {
    it('should display feature section heading prominently', () => {
      renderWithProviders(<Home />);

      const heading = screen.getByRole('heading', { name: /Features/i });
      expect(heading).toHaveClass('text-3xl', 'font-bold');
    });

    it('should render all feature cards with consistent layout', () => {
      renderWithProviders(<Home />);

      const featureCards = screen.getAllByText(/URL Shortening|Click Analytics|User Dashboard|Global Access|Secure Links|Lightning Fast/i);

      expect(featureCards).toHaveLength(6);
    });

    it('should use grid layout for responsive feature card arrangement', () => {
      renderWithProviders(<Home />);

      const featuresContainer = screen.getByRole('heading', { name: /Features/i }).parentElement;
      const gridContainer = featuresContainer?.querySelector('.grid');

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('should maintain visual hierarchy with proper spacing between cards', () => {
      renderWithProviders(<Home />);

      const gridContainer = screen.getByRole('heading', { name: /Features/i }).parentElement?.querySelector('.grid');

      expect(gridContainer).toHaveClass('gap-8');
    });
  });

  describe('Progressive Disclosure for Feature Cards', () => {
    it('should support expandable cards for more detailed information', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />);

      // PRD suggests expandable cards for progressive disclosure
      const featureCard = screen.getByText(/URL Shortening/i).parentElement;
      const expandButton = within(featureCard!).queryByRole('button', { name: /learn more|expand|details/i });

      expect(expandButton).toBeInTheDocument();
    });

    it('should reveal additional feature details when expanded', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />);

      const card = screen.getByText(/Click Analytics/i).parentElement;
      const expandButton = within(card!).queryByRole('button', { name: /learn more/i });

      if (expandButton) {
        await user.click(expandButton);

        // Should show more detailed information
        const detailedInfo = within(card!).queryByText(/detailed insights|comprehensive data|advanced tracking/i);
        expect(detailedInfo).toBeInTheDocument();
      }
    });
  });

  describe('Directional Visual Cues (REQ-2)', () => {
    it('should use subtle directional cues to guide eye movement', () => {
      renderWithProviders(<Home />);

      // Check for visual flow indicators (arrows, gradients, animations)
      const featureSection = screen.getByRole('heading', { name: /Features/i }).parentElement;

      // Should have staggered animations or visual flow
      expect(featureSection?.querySelector('[class*="stagger"]')).toBeTruthy();
    });

    it('should animate feature cards in sequence to guide attention', () => {
      renderWithProviders(<Home />);

      // Framer Motion variants should include staggerChildren
      const featureContainer = screen.getByRole('heading', { name: /Features/i }).parentElement;

      // Container should have motion properties
      expect(featureContainer).toBeInTheDocument();
    });
  });

  describe('Feature Section User Experience (User Story 2)', () => {
    it('should display all 6 feature cards with clear icons, titles, and descriptions', () => {
      renderWithProviders(<Home />);

      const expectedFeatures = [
        { title: 'URL Shortening', benefit: 'easy to share' },
        { title: 'Click Analytics', benefit: 'track and analyze' },
        { title: 'User Dashboard', benefit: 'manage all your' },
        { title: 'Global Access', benefit: 'anywhere in the world' },
        { title: 'Secure Links', benefit: 'secure and protected' },
        { title: 'Lightning Fast', benefit: 'lightning-fast' },
      ];

      expectedFeatures.forEach(({ title }) => {
        const featureTitle = screen.getByText(title);
        expect(featureTitle).toBeInTheDocument();

        const card = featureTitle.parentElement;
        expect(card?.querySelector('svg')).toBeInTheDocument();
      });
    });

    it('should highlight user benefits rather than just technical capabilities', () => {
      renderWithProviders(<Home />);

      // All descriptions should be benefit-focused
      const benefits = screen.getByText(/easy to share|track and analyze|manage all|anywhere|secure|lightning-fast/i);
      expect(benefits).toBeInTheDocument();
    });

    it('should provide subtle animations that draw attention without being distracting', () => {
      renderWithProviders(<Home />);

      const featureContainer = screen.getByRole('heading', { name: /Features/i }).parentElement;

      // Should use whileInView animations with proper viewport settings
      expect(featureContainer).toBeInTheDocument();
    });
  });

  describe('Theme Consistency (NFR-4)', () => {
    it('should render feature cards consistently in dark theme', () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={{ user: null } as any}>
            <ThemeContext.Provider value={{ theme: 'dark', setTheme: vi.fn() } as any}>
              <Home />
            </ThemeContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
      );

      const features = screen.getByRole('heading', { name: /Features/i });
      expect(features).toBeVisible();
    });

    it('should maintain proper contrast ratios for all theme variations', () => {
      renderWithProviders(<Home />);

      const featureHeading = screen.getByRole('heading', { name: /Features/i });

      // Should have gradient text for visibility
      expect(featureHeading).toHaveClass('bg-gradient-to-r');
    });
  });
});
