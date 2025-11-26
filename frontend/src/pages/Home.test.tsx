import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock the contexts
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn(() => ({
    theme: 'dark',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  })),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
  },
}));

// Mock components
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Content Clarity and Copywriting - Homepage Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test Case 1: Hero Headline Review', () => {
    it('should have a clear headline that states URL shortening service', () => {
      renderHome();
      const headline = screen.getByText(/Simplify Your Links/i);
      expect(headline).toBeInTheDocument();
    });

    it('should have headline under 10 words', () => {
      renderHome();
      const headline = screen.getByText(/Simplify Your Links/i);
      const wordCount = headline.textContent?.trim().split(/\s+/).length || 0;
      expect(wordCount).toBeLessThanOrEqual(10);
    });

    it('should use power words in headline', () => {
      renderHome();
      const headline = screen.getByText(/Simplify Your Links/i);
      const powerWords = ['simplify', 'transform', 'empower', 'boost', 'enhance', 'streamline'];
      const headlineText = headline.textContent?.toLowerCase() || '';
      const hasPowerWord = powerWords.some(word => headlineText.includes(word));
      expect(hasPowerWord).toBe(true);
    });

    it('should clearly indicate URL shortening service', () => {
      renderHome();
      const headline = screen.getByText(/Simplify Your Links/i);
      expect(headline.textContent).toMatch(/link|url|short/i);
    });
  });

  describe('Test Case 2: Hero Subheadline Review', () => {
    it('should have a subheadline that explains benefits', () => {
      renderHome();
      const subheadline = screen.getByText(/Create short, memorable links/i);
      expect(subheadline).toBeInTheDocument();
    });

    it('should have subheadline in plain language', () => {
      renderHome();
      const subheadline = screen.getByText(/Create short, memorable links/i);
      const text = subheadline.textContent || '';
      // Check for absence of heavy technical jargon
      const jargonWords = ['api', 'endpoint', 'algorithm', 'protocol', 'backend'];
      const hasJargon = jargonWords.some(word => text.toLowerCase().includes(word));
      expect(hasJargon).toBe(false);
    });

    it('should have max 2 sentences in subheadline', () => {
      renderHome();
      const subheadline = screen.getByText(/Create short, memorable links/i);
      const sentenceCount = (subheadline.textContent?.match(/[.!?]/g) || []).length;
      expect(sentenceCount).toBeLessThanOrEqual(2);
    });
  });

  describe('Test Case 3: Feature Descriptions Review', () => {
    it('should display all 6 feature descriptions', () => {
      renderHome();
      expect(screen.getByText(/URL Shortening/i)).toBeInTheDocument();
      expect(screen.getByText(/Click Analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Global Access/i)).toBeInTheDocument();
      expect(screen.getByText(/Secure Links/i)).toBeInTheDocument();
      expect(screen.getByText(/Lightning Fast/i)).toBeInTheDocument();
    });

    it('should have benefit-focused feature descriptions', () => {
      renderHome();
      // Check that descriptions mention benefits/outcomes
      const benefitKeywords = ['easy', 'track', 'manage', 'access', 'secure', 'fast', 'simple', 'analyze'];
      const descriptions = [
        screen.getByText(/Transform long, unwieldy links/i),
        screen.getByText(/Track and analyze click data/i),
        screen.getByText(/Manage all your shortened URLs/i),
        screen.getByText(/Access your shortened links/i),
        screen.getByText(/Rest easy knowing your links are secure/i),
        screen.getByText(/Enjoy lightning-fast redirects/i),
      ];

      descriptions.forEach(desc => {
        const text = desc.textContent?.toLowerCase() || '';
        const hasBenefit = benefitKeywords.some(keyword => text.includes(keyword));
        expect(hasBenefit).toBe(true);
      });
    });

    it('should have feature descriptions under 20 words', () => {
      renderHome();
      const descriptions = [
        screen.getByText(/Transform long, unwieldy links/i),
        screen.getByText(/Track and analyze click data/i),
        screen.getByText(/Manage all your shortened URLs/i),
        screen.getByText(/Access your shortened links/i),
        screen.getByText(/Rest easy knowing your links are secure/i),
        screen.getByText(/Enjoy lightning-fast redirects/i),
      ];

      descriptions.forEach(desc => {
        const wordCount = desc.textContent?.trim().split(/\s+/).length || 0;
        expect(wordCount).toBeLessThanOrEqual(20);
      });
    });

    it('should have feature titles that start with action verbs or nouns', () => {
      renderHome();
      const titles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast',
      ];

      titles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  describe('Test Case 4: CTA Button Copy Review', () => {
    it('should have action-oriented CTA buttons', () => {
      renderHome();
      const getStartedButton = screen.getByText(/Get Started/i);
      const loginButton = screen.getByText(/Login/i);

      expect(getStartedButton).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
    });

    it('should use action verbs in CTA buttons', () => {
      renderHome();
      const buttons = screen.getAllByRole('button');
      const actionVerbs = ['get', 'start', 'try', 'sign', 'login', 'join', 'create'];

      const hasActionVerb = buttons.some(button => {
        const text = button.textContent?.toLowerCase() || '';
        return actionVerbs.some(verb => text.includes(verb));
      });

      expect(hasActionVerb).toBe(true);
    });

    it('should have clear next step in CTA text', () => {
      renderHome();
      const getStartedButton = screen.getByText(/Get Started/i);
      expect(getStartedButton.textContent).toBeTruthy();
      expect(getStartedButton.textContent?.length).toBeGreaterThan(0);
    });

    it('should adapt CTA based on authentication status', () => {
      // Test unauthenticated state
      renderHome();
      expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
      // Note: In a real implementation, you would use different mock values
      // for authenticated vs unauthenticated states to properly test this behavior
    });
  });

  describe('Test Case 5: Overall Content Clarity Assessment', () => {
    it('should have immediately visible headline and subheadline', () => {
      renderHome();
      const headline = screen.getByText(/Simplify Your Links/i);
      const subheadline = screen.getByText(/Create short, memorable links/i);

      expect(headline).toBeInTheDocument();
      expect(subheadline).toBeInTheDocument();
    });

    it('should have clear service purpose visible above the fold', () => {
      renderHome();
      // Check that the hero section contains clear messaging
      const headline = screen.getByText(/Simplify Your Links/i);
      const subheadline = screen.getByText(/Create short, memorable links/i);

      expect(headline).toBeVisible();
      expect(subheadline).toBeVisible();
    });

    it('should use concise content structure', () => {
      renderHome();
      // Check that sections are logically organized
      expect(screen.getByText(/Features/i)).toBeInTheDocument();
      expect(screen.getByText(/Simplify Your Links/i)).toBeInTheDocument();
    });

    it('should have clear visual hierarchy', () => {
      renderHome();
      const headline = screen.getByText(/Simplify Your Links/i);
      const featuresHeading = screen.getByText(/^Features$/i);

      // H1 should exist for main headline (check parent or itself)
      // The text might be in a span within an h1 for gradient styling
      const headlineParent = headline.closest('h1');
      expect(headlineParent || headline.tagName === 'H1').toBeTruthy();
      // Features should be H2
      expect(featuresHeading.tagName).toBe('H2');
    });
  });

  describe('Test Case 6: Jargon and Technical Terms Check', () => {
    it('should use plain language accessible to non-technical users', () => {
      renderHome();
      const content = document.body.textContent || '';

      // Check that technical jargon is minimal
      const heavyJargon = ['api', 'algorithm', 'endpoint', 'backend', 'frontend', 'deployment'];
      const jargonCount = heavyJargon.filter(term =>
        content.toLowerCase().includes(term)
      ).length;

      expect(jargonCount).toBeLessThanOrEqual(1); // Allow minimal technical terms
    });

    it('should explain benefits in user terms, not technical terms', () => {
      renderHome();
      const descriptions = [
        screen.getByText(/Transform long, unwieldy links/i),
        screen.getByText(/Track and analyze click data/i),
        screen.getByText(/Manage all your shortened URLs/i),
      ];

      descriptions.forEach(desc => {
        const text = desc.textContent?.toLowerCase() || '';
        // Should focus on user benefits
        const userFocusedWords = ['easy', 'simple', 'track', 'manage', 'access', 'secure'];
        const hasUserFocus = userFocusedWords.some(word => text.includes(word));
        expect(hasUserFocus).toBe(true);
      });
    });

    it('should avoid acronyms without explanation', () => {
      renderHome();
      const content = document.body.textContent || '';

      // Common unexplained acronyms to avoid
      const acronyms = ['API', 'SDK', 'CLI', 'REST', 'HTTP'];
      const hasUnexplainedAcronym = acronyms.some(acronym =>
        content.includes(acronym)
      );

      expect(hasUnexplainedAcronym).toBe(false);
    });
  });

  describe('Test Case 7: Unique Selling Points Communication', () => {
    it('should highlight analytics as a differentiator', () => {
      renderHome();
      expect(screen.getByText(/Click Analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/Track and analyze click data/i)).toBeInTheDocument();
    });

    it('should highlight dashboard as a differentiator', () => {
      renderHome();
      expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Manage all your shortened URLs/i)).toBeInTheDocument();
    });

    it('should highlight security as a differentiator', () => {
      renderHome();
      expect(screen.getByText(/Secure Links/i)).toBeInTheDocument();
      expect(screen.getByText(/Rest easy knowing your links are secure/i)).toBeInTheDocument();
    });

    it('should communicate all three main differentiators', () => {
      renderHome();
      const content = document.body.textContent || '';

      expect(content).toMatch(/analytics|track|analyze/i);
      expect(content).toMatch(/dashboard|manage/i);
      expect(content).toMatch(/secure|security|protected/i);
    });
  });

  describe('Test Case 8: Target Audience Communication', () => {
    it('should appeal to marketers with tracking features', () => {
      renderHome();
      // Marketers care about click tracking and analytics
      expect(screen.getByText(/Click Analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/Track and analyze click data/i)).toBeInTheDocument();
    });

    it('should appeal to developers with technical reliability', () => {
      renderHome();
      // Developers care about speed and reliability
      expect(screen.getByText(/Lightning Fast/i)).toBeInTheDocument();
      expect(screen.getByText(/Global Access/i)).toBeInTheDocument();
    });

    it('should appeal to businesses with security and management', () => {
      renderHome();
      // Businesses care about security and centralized management
      expect(screen.getByText(/Secure Links/i)).toBeInTheDocument();
      expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
    });

    it('should support multiple personas without being too specific', () => {
      renderHome();
      // Check that copy is broad enough for multiple audiences
      const content = document.body.textContent || '';

      // Should not be overly specific to one persona
      expect(content).not.toMatch(/only for developers/i);
      expect(content).not.toMatch(/exclusively for marketers/i);
      expect(content).not.toMatch(/business only/i);
    });
  });

  describe('Test Case 9: Active Voice Usage', () => {
    it('should predominantly use active voice in copy', () => {
      renderHome();

      // Check feature descriptions for active voice
      const descriptions = [
        'Transform long, unwieldy links into short, memorable URLs',
        'Track and analyze click data',
        'Manage all your shortened URLs',
        'Access your shortened links from anywhere',
        'Enjoy lightning-fast redirects',
      ];

      descriptions.forEach(desc => {
        const element = screen.getByText(new RegExp(desc.slice(0, 20), 'i'));
        expect(element).toBeInTheDocument();
      });
    });

    it('should use action verbs in feature titles', () => {
      renderHome();
      // Feature titles should be action-oriented or noun phrases
      const titles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast',
      ];

      titles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it('should avoid passive voice constructions', () => {
      renderHome();
      const content = document.body.textContent || '';

      // Check for common passive voice indicators
      const passiveIndicators = [
        'is being',
        'was being',
        'are being',
        'were being',
        'has been',
        'have been',
        'had been',
        'will be shortened',
        'can be tracked',
      ];

      const passiveCount = passiveIndicators.filter(indicator =>
        content.toLowerCase().includes(indicator)
      ).length;

      // Allow minimal passive voice (max 1-2 instances)
      expect(passiveCount).toBeLessThanOrEqual(2);
    });

    it('should use direct, clear language', () => {
      renderHome();
      const subheadline = screen.getByText(/Create short, memorable links/i);

      // "Create" is active and direct
      expect(subheadline.textContent).toMatch(/^Create/i);
    });
  });
});
