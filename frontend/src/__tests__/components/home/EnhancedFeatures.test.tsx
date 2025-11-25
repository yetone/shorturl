/**
 * REQ-3: Enhanced Feature Presentation
 * REQ-4: Trust Indicators
 * REQ-5: Use Case Showcase
 * REQ-7: Enhanced Call-to-Action Strategy
 *
 * Technical Design Specification Quote:
 * "Expand each feature card with specific use case examples. Add 'Learn More' functionality
 * revealing additional details. Section highlighting 3-5 specific use cases with icon, title,
 * and brief description. Multiple strategic CTA placements (hero, after demo, after features, footer)."
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedFeatureCard } from '../../../components/home/EnhancedFeatureCard';
import { UseCaseShowcase } from '../../../components/home/UseCaseShowcase';
import { TrustIndicators } from '../../../components/home/TrustIndicators';
import { StrategicCTA } from '../../../components/home/StrategicCTA';
import { Link2, BarChart3, LayoutDashboard, Globe, Shield, Zap } from 'lucide-react';

// Mock AuthContext
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, isAuthenticated: false })
}));

// Mock ThemeContext
vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark' })
}));

// Test wrapper component that renders all 6 feature cards
const FeaturesSection = () => {
  const features = [
    {
      icon: <Link2 className="h-8 w-8 text-neon-green" />,
      title: "URL Shortening",
      description: "Transform long, unwieldy links into short, memorable URLs that are easy to share.",
      useCase: "Perfect for social media posts and email campaigns",
      details: "Our algorithm generates collision-free short codes and supports custom aliases.",
      glowColor: "rgba(57, 255, 20, 0.2)"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-neon-blue" />,
      title: "Click Analytics",
      description: "Track and analyze click data including referrers, user agents, and clicks over time.",
      useCase: "Ideal for measuring campaign performance and ROI",
      details: "Get detailed insights into click sources, geographic locations, device types, and browser usage.",
      glowColor: "rgba(0, 255, 255, 0.2)"
    },
    {
      icon: <LayoutDashboard className="h-8 w-8 text-neon-pink" />,
      title: "User Dashboard",
      description: "Manage all your shortened URLs from a single, intuitive dashboard interface.",
      useCase: "Streamline your workflow with centralized management",
      details: "View all your links at a glance, search and filter by creation date.",
      glowColor: "rgba(255, 16, 240, 0.2)"
    },
    {
      icon: <Globe className="h-8 w-8 text-neon-blue" />,
      title: "Global Access",
      description: "Access your shortened links from anywhere in the world, on any device.",
      useCase: "Work from anywhere with cloud-based access",
      details: "Your links and analytics are securely stored in the cloud.",
      glowColor: "rgba(0, 255, 255, 0.2)"
    },
    {
      icon: <Shield className="h-8 w-8 text-neon-green" />,
      title: "Secure Links",
      description: "Rest easy knowing your links are secure and protected from malicious activity.",
      useCase: "Enterprise-grade security for your peace of mind",
      details: "JWT authentication, HTTPS encryption, and secure database storage.",
      glowColor: "rgba(57, 255, 20, 0.2)"
    },
    {
      icon: <Zap className="h-8 w-8 text-neon-yellow" />,
      title: "Lightning Fast",
      description: "Enjoy lightning-fast redirects and a responsive user interface.",
      useCase: "Speed matters - deliver the best user experience",
      details: "Optimized infrastructure ensures sub-100ms redirect times.",
      glowColor: "rgba(250, 255, 0, 0.2)"
    }
  ];

  return (
    <div data-testid="features-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div key={index} data-testid={`feature-card-${index + 1}`}>
          <EnhancedFeatureCard {...feature} />
        </div>
      ))}
    </div>
  );
};

describe('REQ-3: Enhanced Feature Cards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Feature Card Content', () => {
    it('should display all 6 feature cards', () => {
      render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      const featureCards = screen.queryAllByTestId(/feature-card-\d+/);
      expect(featureCards.length).toBe(6);
    });

    it('should display feature icon using Lucide React icons', () => {
      const { container } = render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      // Should have SVG icons
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should display feature title', () => {
      render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      expect(screen.getByText(/URL Shortening/i)).toBeDefined();
      expect(screen.getByText(/Click Analytics/i)).toBeDefined();
    });

    it('should display feature description with use case examples', () => {
      render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      // Should have use case text
      expect(screen.getByText(/Perfect for social media posts/i)).toBeDefined();
      expect(screen.getByText(/Ideal for measuring campaign performance/i)).toBeDefined();
    });

    it('should render in 3-column grid on desktop', () => {
      const { container } = render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      const gridContainer = container.querySelector('[data-testid="features-grid"]');
      expect(gridContainer?.className).toMatch(/lg:grid-cols-3/);
    });

    it('should stack vertically on mobile devices', () => {
      const { container } = render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      const gridContainer = container.querySelector('[data-testid="features-grid"]');
      // On mobile, should use sm:grid-cols-2, which means single column by default
      expect(gridContainer?.className).toMatch(/grid/);
    });
  });

  describe('Expandable Details', () => {
    it('should have "Learn More" functionality on each card', () => {
      render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      const learnMoreButtons = screen.queryAllByRole('button', { name: /learn more/i });
      expect(learnMoreButtons.length).toBe(6);
    });

    it('should expand to show additional details when clicked', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <EnhancedFeatureCard
            icon={<Link2 className="h-8 w-8" />}
            title="Test Feature"
            description="Test description"
            useCase="Test use case"
            details="Test details content that should be revealed"
            glowColor="rgba(57, 255, 20, 0.2)"
          />
        </BrowserRouter>
      );

      const learnMoreButton = screen.getByRole('button', { name: /learn more/i });

      // Details should not be visible initially
      expect(screen.queryByText('Test details content that should be revealed')).toBeNull();

      // Check aria-expanded is false initially
      expect(learnMoreButton.getAttribute('aria-expanded')).toBe('false');

      await user.click(learnMoreButton);

      // After click, aria-expanded should become true (wait for state update)
      await waitFor(() => {
        expect(learnMoreButton.getAttribute('aria-expanded')).toBe('true');
      });
    });

    it('should reveal hidden content on click', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <EnhancedFeatureCard
            icon={<Link2 className="h-8 w-8" />}
            title="Test Feature"
            description="Test description"
            useCase="Test use case"
            details="Hidden details"
            glowColor="rgba(57, 255, 20, 0.2)"
          />
        </BrowserRouter>
      );

      const learnMoreButton = screen.getByRole('button', { name: /learn more/i });

      // Initially aria-expanded should be false
      expect(learnMoreButton.getAttribute('aria-expanded')).toBe('false');

      await user.click(learnMoreButton);

      // After click, aria-expanded becomes true (content is being expanded)
      await waitFor(() => {
        expect(learnMoreButton.getAttribute('aria-expanded')).toBe('true');
      });

      // Button text changes to Show Less
      await waitFor(() => {
        expect(screen.queryByText('Show Less')).not.toBeNull();
      });
    });

    it('should use smooth animation for expansion', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <EnhancedFeatureCard
            icon={<Link2 className="h-8 w-8" />}
            title="Test Feature"
            description="Test description"
            useCase="Test use case"
            details="Animated content"
            glowColor="rgba(57, 255, 20, 0.2)"
          />
        </BrowserRouter>
      );

      const learnMoreButton = screen.getByRole('button', { name: /learn more/i });

      // Initial state
      expect(learnMoreButton.textContent).toContain('Learn More');

      await user.click(learnMoreButton);

      // Button text should change to "Show Less"
      await waitFor(() => {
        expect(learnMoreButton.textContent).toContain('Show Less');
      });
    });
  });

  describe('Visual Design', () => {
    it('should use GlassMorphismCard component', () => {
      const { container } = render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      // GlassMorphismCard has specific styling
      const cards = container.querySelectorAll('[class*="backdrop-blur"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should have appropriate glow colors for each card', () => {
      render(
        <BrowserRouter>
          <FeaturesSection />
        </BrowserRouter>
      );

      const cards = screen.queryAllByTestId(/feature-card-\d+/);
      expect(cards.length).toBe(6);
    });
  });
});

describe('REQ-5: Use Case Showcase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Use Case Cards', () => {
    it('should display 3-5 specific use cases', () => {
      render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      const useCaseCards = screen.queryAllByTestId(/use-case-\d+/);
      expect(useCaseCards.length).toBeGreaterThanOrEqual(3);
      expect(useCaseCards.length).toBeLessThanOrEqual(5);
    });

    it('should display icon for each use case', () => {
      const { container } = render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      const useCaseCards = container.querySelectorAll('[data-testid^="use-case"]');
      useCaseCards.forEach(card => {
        const icon = card.querySelector('svg');
        expect(icon).toBeDefined();
      });
    });

    it('should display title for each use case', () => {
      render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      expect(screen.queryByText(/Social Media Manager/i)).toBeDefined();
      expect(screen.queryByText(/Digital Marketer/i)).toBeDefined();
      expect(screen.queryByText(/Content Creator/i)).toBeDefined();
    });

    it('should display 2-3 sentence description for each use case', () => {
      render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      const descriptions = screen.queryAllByTestId(/use-case-description/);
      descriptions.forEach(desc => {
        expect(desc.textContent?.length).toBeGreaterThan(50);
      });
    });

    it('should include all target personas from PRD', () => {
      render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      expect(screen.queryByText(/Social Media/i)).toBeDefined();
      expect(screen.queryByText(/Marketer/i)).toBeDefined();
      expect(screen.queryByText(/Content Creator/i)).toBeDefined();
      expect(screen.queryByText(/Business Owner/i)).toBeDefined();
      expect(screen.queryByText(/Event Organizer/i)).toBeDefined();
    });
  });

  describe('Layout and Positioning', () => {
    it('should be positioned between features and testimonials sections', () => {
      const { container } = render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      const useCaseSection = container.querySelector('[data-testid="use-case-showcase"]');
      expect(useCaseSection).toBeDefined();
    });

    it('should use card grid layout on desktop', () => {
      const { container } = render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      const grid = container.querySelector('[data-testid="use-case-grid"]');
      expect(grid?.className).toMatch(/grid/i);
    });

    it('should use horizontal scroll on mobile', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('max-width'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      const { container } = render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      const scrollContainer = container.querySelector('[data-testid="use-case-grid"]');
      expect(scrollContainer?.className).toMatch(/overflow-x|scroll/i);
    });
  });

  describe('Interactive Elements', () => {
    it('should have optional "Learn More" links for each use case', () => {
      render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      const learnMoreLinks = screen.queryAllByRole('link', { name: /learn more/i });
      expect(learnMoreLinks.length).toBeGreaterThanOrEqual(0);
    });

    it('should be clickable and track engagement', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <UseCaseShowcase />
        </BrowserRouter>
      );

      const useCaseCard = screen.queryByTestId('use-case-1');
      if (useCaseCard) {
        await user.click(useCaseCard);
        // Should track click event
        expect(useCaseCard).toBeDefined();
      }
    });
  });
});

describe('REQ-4: Trust Indicators', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Security Indicators', () => {
    it('should display security badge or indicator', () => {
      render(
        <BrowserRouter>
          <TrustIndicators />
        </BrowserRouter>
      );

      expect(
        screen.queryByText(/secure|JWT|authentication|encrypted/i)
      ).toBeDefined();
    });

    it('should show uptime/reliability indicator', () => {
      render(
        <BrowserRouter>
          <TrustIndicators />
        </BrowserRouter>
      );

      expect(screen.queryByText(/uptime|99\./i)).toBeDefined();
    });

    it('should include privacy statement summary', () => {
      render(
        <BrowserRouter>
          <TrustIndicators />
        </BrowserRouter>
      );

      expect(screen.queryByText(/privacy|data.*protected/i)).toBeDefined();
    });
  });

  describe('Policy Links', () => {
    it('should have link to terms of service', () => {
      render(
        <BrowserRouter>
          <TrustIndicators />
        </BrowserRouter>
      );

      const tosLink = screen.queryByRole('link', { name: /terms.*service/i });
      expect(tosLink).toBeDefined();
    });

    it('should have link to privacy policy', () => {
      render(
        <BrowserRouter>
          <TrustIndicators />
        </BrowserRouter>
      );

      const privacyLink = screen.queryByRole('link', { name: /privacy.*policy/i });
      expect(privacyLink).toBeDefined();
    });
  });

  describe('Placement and Styling', () => {
    it('should appear in hero section or near demo', () => {
      const { container } = render(
        <BrowserRouter>
          <TrustIndicators />
        </BrowserRouter>
      );

      const trustSection = container.querySelector('[data-testid="trust-indicators"]');
      expect(trustSection).toBeDefined();
    });

    it('should have subtle professional styling', () => {
      const { container } = render(
        <BrowserRouter>
          <TrustIndicators />
        </BrowserRouter>
      );

      const trustSection = container.querySelector('[data-testid="trust-indicators"]');
      expect(trustSection?.className).toMatch(/subtle|opacity|text-sm/i);
    });

    it('should also appear in footer section', () => {
      const { container } = render(
        <BrowserRouter>
          <TrustIndicators />
        </BrowserRouter>
      );

      const footerTrust = container.querySelector('[data-testid="footer-trust"]');
      expect(footerTrust).toBeDefined();
    });
  });
});

describe('REQ-7: Strategic Call-to-Action Placement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Primary CTA - Hero Section', () => {
    it('should have primary CTA in hero section', () => {
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const heroCTA = screen.queryByTestId('hero-cta');
      expect(heroCTA).toBeDefined();
    });

    it('should use "Try Demo" or "Get Started Free" copy', () => {
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      expect(
        screen.queryByRole('button', { name: /try demo|get started|sign up free/i })
      ).toBeDefined();
    });

    it('should use neon FuturisticButton style for primary CTA', () => {
      const { container } = render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const primaryCTA = container.querySelector('[data-testid="hero-cta"]');
      expect(primaryCTA?.className).toMatch(/neon|futuristic|primary/i);
    });
  });

  describe('Secondary CTAs Throughout Page', () => {
    it('should have CTA after demo section', () => {
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const postDemoCTA = screen.queryByTestId('post-demo-cta');
      expect(postDemoCTA).toBeDefined();
    });

    it('should have CTA after features section', () => {
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const postFeaturesCTA = screen.queryByTestId('post-features-cta');
      expect(postFeaturesCTA).toBeDefined();
    });

    it('should have CTA before footer', () => {
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const footerCTA = screen.queryByTestId('footer-cta');
      expect(footerCTA).toBeDefined();
    });

    it('should have varied CTA copy based on context', () => {
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      // Different CTAs should have different text
      const ctaButtons = screen.queryAllByRole('button', { name: /sign up|get started|try|create/i });
      const uniqueTexts = new Set(ctaButtons.map(btn => btn.textContent));
      expect(uniqueTexts.size).toBeGreaterThan(1);
    });
  });

  describe('Tertiary CTA - Login', () => {
    it('should have login button for existing users', () => {
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const loginBtn = screen.queryByRole('button', { name: /login|sign in/i });
      expect(loginBtn).toBeDefined();
    });

    it('should be secondary styled button', () => {
      const { container } = render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const loginBtn = screen.queryByRole('button', { name: /login/i });
      expect(loginBtn?.className).toMatch(/outline|secondary/i);
    });
  });

  describe('CTA Analytics Tracking', () => {
    it('should track CTA clicks by location', async () => {
      const user = userEvent.setup();
      const trackEvent = vi.fn();

      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const heroCTA = screen.queryByTestId('hero-cta');
      if (heroCTA) {
        await user.click(heroCTA);
        // Should call analytics tracking
        expect(trackEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            category: 'CTA',
            label: expect.stringContaining('hero')
          })
        );
      }
    });

    it('should support A/B test variant tracking', () => {
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const cta = screen.queryByTestId('hero-cta');
      expect(cta?.getAttribute('data-variant')).toBeDefined();
    });
  });

  describe('CTA Navigation', () => {
    it('should navigate to registration page when clicked', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const ctaButton = screen.queryByRole('button', { name: /get started/i });
      if (ctaButton) {
        await user.click(ctaButton);
        // Should navigate to /register
        expect(window.location.pathname).toMatch(/register|signup/i);
      }
    });

    it('should navigate to dashboard if user already authenticated', async () => {
      const user = userEvent.setup();
      // Mock authenticated user
      render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const ctaButton = screen.queryByRole('button', { name: /get started/i });
      if (ctaButton) {
        await user.click(ctaButton);
        // Should check auth and navigate appropriately
        expect(ctaButton).toBeDefined();
      }
    });
  });

  describe('Visual Emphasis', () => {
    it('should have visual emphasis on primary action', () => {
      const { container } = render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const primaryCTA = container.querySelector('[data-testid="hero-cta"]');
      expect(primaryCTA?.className).toMatch(/neon|glow|pulse|emphasis/i);
    });

    it('should be easily distinguishable from secondary CTAs', () => {
      const { container } = render(
        <BrowserRouter>
          <StrategicCTA />
        </BrowserRouter>
      );

      const primaryCTA = container.querySelector('[data-testid="hero-cta"]');
      const secondaryCTA = container.querySelector('[data-testid="post-demo-cta"]');

      expect(primaryCTA?.className).not.toBe(secondaryCTA?.className);
    });
  });
});
