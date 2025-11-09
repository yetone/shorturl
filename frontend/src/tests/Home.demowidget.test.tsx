import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const renderWithProviders = (component: React.ReactElement, user = null) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user } as any}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: vi.fn() } as any}>
          {component}
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Home Page - Demo Widget and Quick Start (REQ-4)', () => {
  describe('Demo Widget Presence', () => {
    it('should display quick-start URL shortening widget for logged-out users', () => {
      renderWithProviders(<Home />, null);

      // PRD: "Add quick-start URL shortening widget for logged-out users"
      const demoWidget = screen.queryByTestId('demo-widget');
      expect(demoWidget).toBeInTheDocument();
    });

    it('should show demo widget in the hero section or prominently above fold', () => {
      renderWithProviders(<Home />, null);

      const demoWidget = screen.queryByTestId('demo-widget');
      const heroSection = screen.getByRole('heading', { level: 1 }).parentElement;

      // Demo widget should be within or near hero section
      expect(demoWidget || within(heroSection!).queryByPlaceholderText(/enter url|paste url/i)).toBeTruthy();
    });

    it('should display "Try it without signing up" messaging', () => {
      renderWithProviders(<Home />, null);

      const tryMessage = screen.queryByText(/try it without|try before|no signup required|demo/i);
      expect(tryMessage).toBeInTheDocument();
    });
  });

  describe('Demo Widget Functionality', () => {
    it('should provide input field for URL entry', async () => {
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url|enter.*link/i);
      expect(urlInput).toBeInTheDocument();
      expect(urlInput).toHaveAttribute('type', 'text');
    });

    it('should allow users to paste a URL into the demo widget', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      if (urlInput) {
        await user.type(urlInput, 'https://example.com/very-long-url');
        expect(urlInput).toHaveValue('https://example.com/very-long-url');
      }
    });

    it('should have a button to trigger URL shortening', () => {
      renderWithProviders(<Home />, null);

      const shortenButton = screen.queryByRole('button', { name: /shorten|try it|demo/i });
      expect(shortenButton).toBeInTheDocument();
    });

    it('should generate a simulated short URL when demo button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        await user.type(urlInput, 'https://example.com/very-long-url');
        await user.click(shortenButton);

        // Should show simulated short URL
        const shortUrl = await screen.findByText(/short\.url\/\w+|demo\.link/i);
        expect(shortUrl).toBeInTheDocument();
      }
    });

    it('should display simulated analytics or stats after shortening', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        await user.type(urlInput, 'https://example.com/test');
        await user.click(shortenButton);

        // Should show simulated stats
        const stats = await screen.findByText(/\d+\s*clicks?|views|analytics/i);
        expect(stats).toBeInTheDocument();
      }
    });
  });

  describe('Demo Mode Indication', () => {
    it('should clearly indicate that this is a demo/preview mode', () => {
      renderWithProviders(<Home />, null);

      const demoIndicator = screen.queryByText(/demo mode|preview|simulation|example/i);
      expect(demoIndicator).toBeInTheDocument();
    });

    it('should show "Demo Mode" label or badge on the widget', () => {
      renderWithProviders(<Home />, null);

      const demoBadge = screen.queryByTestId('demo-badge') || screen.queryByText(/demo/i);
      expect(demoBadge).toBeInTheDocument();
    });

    it('should use visual distinction to indicate demo (border, badge, color)', () => {
      renderWithProviders(<Home />, null);

      const demoWidget = screen.queryByTestId('demo-widget');
      if (demoWidget) {
        // Should have visual styling to indicate it's a demo
        expect(demoWidget.className).toMatch(/border|badge|demo/);
      }
    });

    it('should not make real backend calls during demo', async () => {
      const user = userEvent.setup();
      const fetchSpy = vi.spyOn(global, 'fetch');

      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        await user.type(urlInput, 'https://example.com/test');
        await user.click(shortenButton);

        // Should NOT make fetch calls
        expect(fetchSpy).not.toHaveBeenCalled();
      }

      fetchSpy.mockRestore();
    });
  });

  describe('Post-Demo Call-to-Action', () => {
    it('should show CTA after demo interaction: "Create Real Short URLs"', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        await user.type(urlInput, 'https://example.com/test');
        await user.click(shortenButton);

        // Should show CTA after demo
        const cta = await screen.findByText(/create real|sign up|get started|register/i);
        expect(cta).toBeInTheDocument();
      }
    });

    it('should link CTA to registration page', () => {
      renderWithProviders(<Home />, null);

      const cta = screen.queryByRole('link', { name: /create real|sign up to create/i });
      if (cta) {
        expect(cta).toHaveAttribute('href', '/register');
      }
    });

    it('should make CTA prominent but not intrusive', () => {
      renderWithProviders(<Home />, null);

      const demoWidget = screen.queryByTestId('demo-widget');
      if (demoWidget) {
        const cta = within(demoWidget).queryByText(/sign up|register|get started/i);
        expect(cta).toBeInTheDocument();
      }
    });
  });

  describe('Demo Widget Client-Side Logic', () => {
    it('should generate realistic short codes client-side', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        await user.type(urlInput, 'https://example.com/test');
        await user.click(shortenButton);

        // Should generate codes like "abc123" or similar
        const shortCode = await screen.findByText(/\w{5,8}/);
        expect(shortCode).toBeInTheDocument();
      }
    });

    it('should validate URL format before shortening', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        await user.type(urlInput, 'not-a-valid-url');
        await user.click(shortenButton);

        // Should show error or validation message
        const error = await screen.findByText(/invalid url|please enter.*valid/i);
        expect(error).toBeInTheDocument();
      }
    });

    it('should handle edge cases gracefully (empty input, special chars)', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        // Test empty input
        await user.click(shortenButton);
        const error = await screen.findByText(/required|enter.*url/i);
        expect(error).toBeInTheDocument();
      }
    });
  });

  describe('Secondary CTAs Throughout Page (REQ-4)', () => {
    it('should have CTAs beyond the hero section', () => {
      renderWithProviders(<Home />, null);

      const allCTAs = screen.queryAllByRole('link', { name: /get started|sign up|register/i });
      expect(allCTAs.length).toBeGreaterThan(1);
    });

    it('should display CTA after features section', () => {
      renderWithProviders(<Home />, null);

      const features = screen.getByRole('heading', { name: /Features/i });
      const featuresSection = features.parentElement;

      // Check for CTA after features
      const nextElement = featuresSection?.nextElementSibling;
      const cta = nextElement?.querySelector('[href*="register"]');

      expect(cta).toBeTruthy();
    });

    it('should create clear visual path from feature discovery to registration', () => {
      renderWithProviders(<Home />, null);

      // Should have multiple touchpoints for conversion
      const heroCTA = screen.getByRole('link', { name: /Get Started/i });
      const additionalCTAs = screen.queryAllByText(/sign up|register|get started/i);

      expect(heroCTA).toBeInTheDocument();
      expect(additionalCTAs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Try Before Committing (User Story 4)', () => {
    it('should allow cautious visitors to try URL shortening without account', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const demoWidget = screen.queryByTestId('demo-widget');
      expect(demoWidget).toBeInTheDocument();

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      if (urlInput) {
        await user.type(urlInput, 'https://example.com/test');
        expect(urlInput).toHaveValue('https://example.com/test');
      }
    });

    it('should clearly indicate demo mode to avoid confusion', () => {
      renderWithProviders(<Home />, null);

      const demoIndicator = screen.queryByText(/demo|preview|simulation/i);
      expect(demoIndicator).toBeInTheDocument();
    });

    it('should show clear CTA to create real short URLs after demo', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        await user.type(urlInput, 'https://example.com/test');
        await user.click(shortenButton);

        const realUrlsCTA = await screen.findByText(/create real|actual short urls/i);
        expect(realUrlsCTA).toBeInTheDocument();
      }
    });
  });

  describe('Demo Widget Accessibility', () => {
    it('should have proper labels for screen readers', () => {
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByLabelText(/url|link to shorten/i);
      expect(urlInput).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      if (urlInput) {
        urlInput.focus();
        expect(document.activeElement).toBe(urlInput);
      }
    });

    it('should announce demo results to screen readers', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />, null);

      const urlInput = screen.queryByPlaceholderText(/enter url|paste url/i);
      const shortenButton = screen.queryByRole('button', { name: /shorten|try it/i });

      if (urlInput && shortenButton) {
        await user.type(urlInput, 'https://example.com/test');
        await user.click(shortenButton);

        // Result should have aria-live or similar
        const result = await screen.findByRole('status');
        expect(result).toBeInTheDocument();
      }
    });
  });
});
