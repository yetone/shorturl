import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Mock components to avoid dependency issues in tests
vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

const renderWithProviders = (component: React.ReactElement, authValue = { user: null }, theme = 'light') => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue as any}>
        <ThemeContext.Provider value={{ theme, setTheme: vi.fn() } as any}>
          {component}
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Home Page - Hero Section Enhancements (REQ-1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Enhanced Headline Copy', () => {
    it('should display an action-oriented, compelling headline that explains the service', () => {
      renderWithProviders(<Home />);

      // Current implementation shows "Simplify Your Links"
      // PRD requirement: "Shorten, Share, Track — All in One Place" or similar action-oriented copy
      const headline = screen.queryByText(/Shorten, Share, Track/i);
      expect(headline).toBeInTheDocument();
    });

    it('should have a headline that is benefit-focused and not just feature-focused', () => {
      renderWithProviders(<Home />);

      // Should communicate benefits to users
      const benefitText = screen.queryByText(/All in One Place|Track Every Click|Powerful Analytics/i);
      expect(benefitText).toBeInTheDocument();
    });

    it('should render headline with proper gradient styling for visual impact', () => {
      renderWithProviders(<Home />);

      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toHaveClass('bg-gradient-to-r');
    });
  });

  describe('Subheadline with Target Audience and Value', () => {
    it('should display a subheadline that clarifies target audience', () => {
      renderWithProviders(<Home />);

      // PRD requirement: "Perfect for marketers, developers, and content creators" or similar
      const subheadline = screen.queryByText(/Perfect for marketers, developers|content creators|target audience/i);
      expect(subheadline).toBeInTheDocument();
    });

    it('should display a subheadline that explains the use case clearly', () => {
      renderWithProviders(<Home />);

      // Should clarify what users can do with the service
      const useCase = screen.queryByText(/memorable short links|track every click|powerful analytics/i);
      expect(useCase).toBeInTheDocument();
    });

    it('should ensure subheadline is visible and readable in all themes', () => {
      const { rerender } = renderWithProviders(<Home />, { user: null }, 'light');
      let paragraph = screen.getAllByRole('paragraph')[0];
      expect(paragraph).toBeVisible();

      // Test dark theme
      rerender(
        <BrowserRouter>
          <AuthContext.Provider value={{ user: null } as any}>
            <ThemeContext.Provider value={{ theme: 'dark', setTheme: vi.fn() } as any}>
              <Home />
            </ThemeContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
      );
      paragraph = screen.getAllByRole('paragraph')[0];
      expect(paragraph).toHaveClass('text-gray-300');
    });
  });

  describe('CTA Button Hierarchy and Optimization', () => {
    it('should display primary CTA button with conversion-optimized text', () => {
      renderWithProviders(<Home />);

      // Current: "Get Started" - Should remain or improve
      const primaryCTA = screen.getByRole('link', { name: /Get Started/i });
      expect(primaryCTA).toBeInTheDocument();
    });

    it('should display secondary CTA for existing users (Login)', () => {
      renderWithProviders(<Home />);

      const secondaryCTA = screen.getByRole('link', { name: /Login|Sign In/i });
      expect(secondaryCTA).toBeInTheDocument();
    });

    it('should display tertiary CTA for demo/preview (Try Demo)', () => {
      renderWithProviders(<Home />);

      // PRD requirement: Add "Try Demo" or "Try it without signing up"
      const tertiaryCTA = screen.queryByRole('button', { name: /Try Demo|Try it|Preview/i });
      expect(tertiaryCTA).toBeInTheDocument();
    });

    it('should route authenticated users to dashboard instead of register', () => {
      renderWithProviders(<Home />, { user: { id: '1', email: 'test@example.com' } });

      const primaryCTA = screen.getByRole('link', { name: /Get Started/i });
      expect(primaryCTA).toHaveAttribute('href', '/dashboard');
    });

    it('should route unauthenticated users to register page', () => {
      renderWithProviders(<Home />, { user: null });

      const primaryCTA = screen.getByRole('link', { name: /Get Started/i });
      expect(primaryCTA).toHaveAttribute('href', '/register');
    });
  });

  describe('Animated Demo or Preview', () => {
    it('should display an animated demo showing URL transformation process', () => {
      renderWithProviders(<Home />);

      // PRD requirement: Add animated illustration showing URL transformation
      const demo = screen.queryByTestId('url-transformation-demo');
      expect(demo).toBeInTheDocument();
    });

    it('should show visual representation of URL shortening workflow', () => {
      renderWithProviders(<Home />);

      // Should show: Long URL → Short URL transformation
      const demoVisualization = screen.queryByLabelText(/URL shortening demonstration|transformation/i);
      expect(demoVisualization).toBeInTheDocument();
    });

    it('should include animated elements that respect prefers-reduced-motion', () => {
      renderWithProviders(<Home />);

      // Animation should be conditional based on user preferences
      const animatedElement = screen.queryByTestId('animated-demo');
      expect(animatedElement).toBeInTheDocument();
    });
  });

  describe('Hero Section Layout and Spacing', () => {
    it('should render hero section with proper vertical spacing', () => {
      renderWithProviders(<Home />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('mb-8'); // or similar spacing class
    });

    it('should center align hero content for better visual hierarchy', () => {
      renderWithProviders(<Home />);

      const heading = screen.getByRole('heading', { level: 1 });
      const container = heading.parentElement;
      expect(container).toHaveClass('text-center');
    });

    it('should stack CTA buttons vertically on mobile and horizontally on desktop', () => {
      renderWithProviders(<Home />);

      const ctaContainer = screen.getByRole('link', { name: /Get Started/i }).parentElement;
      expect(ctaContainer).toHaveClass('flex-col', 'md:flex-row');
    });
  });

  describe('Value Proposition Clarity (User Story 1)', () => {
    it('should allow users to understand service value within 3 seconds', () => {
      renderWithProviders(<Home />);

      // Should have headline + subheadline visible immediately
      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getAllByText(/Create short|Track clicks|memorable links/i)[0];

      expect(heading).toBeVisible();
      expect(description).toBeVisible();
    });

    it('should communicate core value proposition clearly in hero text', () => {
      renderWithProviders(<Home />);

      // Should mention: shortening, tracking, analytics
      const heroText = screen.getByRole('heading', { level: 1 }).parentElement?.textContent || '';

      expect(heroText.toLowerCase()).toMatch(/shorten|track|analytic|click/);
    });
  });
});
