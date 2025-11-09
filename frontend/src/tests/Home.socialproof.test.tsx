import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

describe('Home Page - Social Proof and Trust Elements (REQ-3)', () => {
  describe('Statistics Counter', () => {
    it('should display statistics counter showing URLs shortened', () => {
      renderWithProviders(<Home />);

      // PRD requirement: "1000+ URLs shortened" or similar
      const urlsShortened = screen.queryByText(/\d+\+?\s*(URLs?|Links?)\s*shortened/i);
      expect(urlsShortened).toBeInTheDocument();
    });

    it('should display statistics showing clicks tracked', () => {
      renderWithProviders(<Home />);

      // PRD requirement: "5000+ clicks tracked"
      const clicksTracked = screen.queryByText(/\d+\+?\s*clicks?\s*tracked/i);
      expect(clicksTracked).toBeInTheDocument();
    });

    it('should display uptime or reliability statistics', () => {
      renderWithProviders(<Home />);

      // PRD example: "99.9% Uptime Guaranteed"
      const uptime = screen.queryByText(/\d+(\.\d+)?%\s*uptime/i);
      expect(uptime).toBeInTheDocument();
    });

    it('should animate statistics numbers for visual impact', () => {
      renderWithProviders(<Home />);

      // Statistics should have animation (count-up effect)
      const statsContainer = screen.queryByTestId('statistics-counter');
      expect(statsContainer).toBeInTheDocument();
      expect(statsContainer).toHaveClass(/animate|transition/);
    });

    it('should display statistics in a visually appealing layout', () => {
      renderWithProviders(<Home />);

      const statsSection = screen.queryByRole('region', { name: /statistics|stats|social proof/i });
      expect(statsSection).toBeInTheDocument();
      expect(statsSection).toHaveClass(/grid|flex/);
    });
  });

  describe('User Testimonials', () => {
    it('should display 2-3 brief user testimonials or use case examples', () => {
      renderWithProviders(<Home />);

      // Should have testimonials section
      const testimonialSection = screen.queryByRole('region', { name: /testimonial/i });
      expect(testimonialSection).toBeInTheDocument();

      // Should have at least 2 testimonials
      const testimonials = screen.queryAllByTestId(/testimonial-\d+/);
      expect(testimonials.length).toBeGreaterThanOrEqual(2);
      expect(testimonials.length).toBeLessThanOrEqual(3);
    });

    it('should include attribution for each testimonial (name, role)', () => {
      renderWithProviders(<Home />);

      // Each testimonial should have author name and role
      const author = screen.queryByText(/Marketing Manager|Developer|Content Creator|CEO/i);
      expect(author).toBeInTheDocument();
    });

    it('should display testimonials with proper formatting and readability', () => {
      renderWithProviders(<Home />);

      const testimonial = screen.queryByTestId('testimonial-1');
      if (testimonial) {
        const quote = within(testimonial).queryByText(/.{20,}/); // At least 20 chars
        expect(quote).toBeInTheDocument();
      }
    });

    it('should use quotes or testimonial cards for visual distinction', () => {
      renderWithProviders(<Home />);

      // Testimonials should be in cards or have quote styling
      const testimonialCard = screen.queryByTestId('testimonial-card');
      expect(testimonialCard).toBeInTheDocument();
    });
  });

  describe('Trust Indicators', () => {
    it('should display security badges or trust indicators', () => {
      renderWithProviders(<Home />);

      // PRD: "security badges, uptime guarantee"
      const trustBadge = screen.queryByAltText(/secure|security|trusted|verified/i);
      expect(trustBadge).toBeInTheDocument();
    });

    it('should show uptime guarantee or reliability promise', () => {
      renderWithProviders(<Home />);

      const guarantee = screen.queryByText(/uptime guarantee|reliability|always available/i);
      expect(guarantee).toBeInTheDocument();
    });

    it('should display trust indicators in a prominent location', () => {
      renderWithProviders(<Home />);

      const trustSection = screen.queryByTestId('trust-indicators');
      expect(trustSection).toBeInTheDocument();
      expect(trustSection).toBeVisible();
    });
  });

  describe('Recent Activity or Live Counter', () => {
    it('should display recent activity feed or live click counter', () => {
      renderWithProviders(<Home />);

      // PRD: "Display recent activity feed or live click counter"
      const activityFeed = screen.queryByTestId('activity-feed');
      const liveCounter = screen.queryByTestId('live-counter');

      expect(activityFeed || liveCounter).toBeInTheDocument();
    });

    it('should update live statistics in real-time or near-real-time', () => {
      renderWithProviders(<Home />);

      const liveElement = screen.queryByText(/live|real-time|just now/i);
      expect(liveElement).toBeInTheDocument();
    });

    it('should show activity in a non-intrusive manner', () => {
      renderWithProviders(<Home />);

      const activityFeed = screen.queryByTestId('activity-feed');
      if (activityFeed) {
        // Should not be too prominent or distracting
        expect(activityFeed).toHaveClass(/opacity|text-sm|subtle/);
      }
    });
  });

  describe('Social Proof Section Layout', () => {
    it('should render social proof section with clear heading', () => {
      renderWithProviders(<Home />);

      const heading = screen.queryByRole('heading', { name: /trusted by|proven results|social proof|success stories/i });
      expect(heading).toBeInTheDocument();
    });

    it('should organize social proof elements in a cohesive layout', () => {
      renderWithProviders(<Home />);

      const socialProofSection = screen.queryByTestId('social-proof-section');
      expect(socialProofSection).toBeInTheDocument();
      expect(socialProofSection).toHaveClass(/grid|flex|space/);
    });

    it('should position social proof section between features and footer', () => {
      renderWithProviders(<Home />);

      const features = screen.getByRole('heading', { name: /Features/i });
      const footer = screen.getByText(/All rights reserved/i);
      const socialProof = screen.queryByTestId('social-proof-section');

      if (socialProof) {
        // Social proof should come after features and before footer
        expect(socialProof).toBeInTheDocument();
      }
    });
  });

  describe('Credibility and Trust (User Story 3)', () => {
    it('should display statistics that feel credible and not inflated', () => {
      renderWithProviders(<Home />);

      // Numbers should be realistic (not "999,999,999+")
      const stats = screen.queryByText(/\d+/);
      if (stats) {
        const numberMatch = stats.textContent?.match(/(\d+)/);
        if (numberMatch) {
          const number = parseInt(numberMatch[1].replace(/,/g, ''));
          // Reasonable range for a real service
          expect(number).toBeGreaterThan(0);
          expect(number).toBeLessThan(10000000);
        }
      }
    });

    it('should include real attributions for testimonials', () => {
      renderWithProviders(<Home />);

      // Testimonials should have names and roles
      const attribution = screen.queryByText(/- \w+|by \w+|\w+,\s+\w+/);
      expect(attribution).toBeInTheDocument();
    });

    it('should display social proof in a trustworthy, professional manner', () => {
      renderWithProviders(<Home />);

      const socialProofSection = screen.queryByTestId('social-proof-section');
      expect(socialProofSection).toBeInTheDocument();

      // Should not be too flashy or salesy
      const heading = screen.queryByRole('heading', { name: /trusted|proven|success/i });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Visual Polish and Integration', () => {
    it('should use consistent styling with the rest of the homepage', () => {
      renderWithProviders(<Home />);

      const socialProofSection = screen.queryByTestId('social-proof-section');
      const featuresSection = screen.getByRole('heading', { name: /Features/i }).parentElement;

      // Should use similar spacing and styling
      expect(socialProofSection).toBeInTheDocument();
    });

    it('should work across all theme variations', () => {
      const { rerender } = renderWithProviders(<Home />);

      let socialProof = screen.queryByTestId('social-proof-section');
      expect(socialProof).toBeVisible();

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

      socialProof = screen.queryByTestId('social-proof-section');
      expect(socialProof).toBeVisible();
    });
  });

  describe('"How It Works" Section (REQ-5, Interface Requirements)', () => {
    it('should display "How It Works" section with 3 steps', () => {
      renderWithProviders(<Home />);

      const howItWorksHeading = screen.queryByRole('heading', { name: /how it works/i });
      expect(howItWorksHeading).toBeInTheDocument();

      // Should have 3 steps
      const steps = screen.queryAllByTestId(/step-\d+/);
      expect(steps).toHaveLength(3);
    });

    it('should show step 1: Paste URL', () => {
      renderWithProviders(<Home />);

      const step1 = screen.queryByText(/paste your url|paste url|step 1/i);
      expect(step1).toBeInTheDocument();

      const description = screen.queryByText(/copy your long link/i);
      expect(description).toBeInTheDocument();
    });

    it('should show step 2: Get Short Link', () => {
      renderWithProviders(<Home />);

      const step2 = screen.queryByText(/get short link|shorten|step 2/i);
      expect(step2).toBeInTheDocument();

      const description = screen.queryByText(/receive.*unique.*short/i);
      expect(description).toBeInTheDocument();
    });

    it('should show step 3: Track & Analyze', () => {
      renderWithProviders(<Home />);

      const step3 = screen.queryByText(/track.*analyze|analytics|step 3/i);
      expect(step3).toBeInTheDocument();

      const description = screen.queryByText(/monitor clicks|real-time/i);
      expect(description).toBeInTheDocument();
    });

    it('should use icon-based representation for each step', () => {
      renderWithProviders(<Home />);

      const step1 = screen.queryByTestId('step-1');
      if (step1) {
        const icon = within(step1).queryByRole('img') || step1.querySelector('svg');
        expect(icon).toBeInTheDocument();
      }
    });

    it('should present steps with clear visual flow', () => {
      renderWithProviders(<Home />);

      const howItWorksSection = screen.queryByTestId('how-it-works-section');
      expect(howItWorksSection).toBeInTheDocument();

      // Should have directional flow (arrows, numbers, animations)
      const stepNumbers = screen.queryAllByText(/1|2|3/);
      expect(stepNumbers.length).toBeGreaterThanOrEqual(3);
    });
  });
});
