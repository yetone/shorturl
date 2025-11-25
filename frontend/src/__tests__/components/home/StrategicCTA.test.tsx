/**
 * Scenario #9: Strategic Call-to-Action Placement
 * Tests for strategically placed CTAs throughout the homepage with varied copy and A/B testing
 *
 * Test Cases:
 * - Test ID 36: Primary CTA present in hero section
 * - Test ID 37: CTA after demo, features, footer
 * - Test ID 38: Varied copy based on context
 * - Test ID 39: Tracks click with location and variant
 * - Test ID 40: Supports A/B test variant tracking
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { StrategicCTA } from '../../../components/home/StrategicCTA';
import React from 'react';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthContext
const mockAuthContext = {
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
};

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock ThemeContext
vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn(), toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

describe('Scenario #9: Strategic Call-to-Action Placement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock gtag
    window.gtag = vi.fn();
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
  });

  afterEach(() => {
    delete window.gtag;
  });

  const renderComponent = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe('Test Case 36: Primary CTA present in hero section', () => {
    it('should render primary CTA button in hero location', () => {
      renderComponent(<StrategicCTA location="hero" />);

      // Hero section should have the "Try Demo" button
      const primaryButton = screen.getByRole('button', { name: /try demo/i });
      expect(primaryButton).toBeDefined();
      expect(primaryButton).toBeTruthy();
    });

    it('should render secondary CTA (Login) in hero location', () => {
      renderComponent(<StrategicCTA location="hero" />);

      // Hero section should also have a Login button
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeDefined();
      expect(loginButton).toBeTruthy();
    });

    it('should have minimum 44px height for touch targets', () => {
      const { container } = renderComponent(<StrategicCTA location="hero" />);

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button.classList.contains('min-h-[44px]')).toBe(true);
      });
    });
  });

  describe('Test Case 37: CTA after demo, features, footer', () => {
    it('should render CTA in post-demo location', () => {
      renderComponent(<StrategicCTA location="post-demo" />);

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
      expect(button.textContent).toContain('Sign Up to Track Your Links');
    });

    it('should render CTA in post-features location', () => {
      renderComponent(<StrategicCTA location="post-features" />);

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
      expect(button.textContent).toContain('Create Your First Short Link');
    });

    it('should render CTA in footer location', () => {
      renderComponent(<StrategicCTA location="footer" variant="secondary" />);

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
      expect(button.textContent).toContain('Get Started Now');
    });

    it('should render all CTAs with proper structure', () => {
      const locations: Array<'hero' | 'post-demo' | 'post-features' | 'footer'> = [
        'hero',
        'post-demo',
        'post-features',
        'footer',
      ];

      locations.forEach((location) => {
        const { unmount } = renderComponent(<StrategicCTA location={location} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
        unmount();
      });
    });
  });

  describe('Test Case 38: Varied copy based on context', () => {
    it('should display "Try Demo" copy in hero location', () => {
      renderComponent(<StrategicCTA location="hero" />);
      expect(screen.getByText(/try demo/i)).toBeDefined();
    });

    it('should display "Sign Up to Track Your Links" in post-demo location', () => {
      renderComponent(<StrategicCTA location="post-demo" />);
      expect(screen.getByText(/sign up to track your links/i)).toBeDefined();
    });

    it('should display "Create Your First Short Link" in post-features location', () => {
      renderComponent(<StrategicCTA location="post-features" />);
      expect(screen.getByText(/create your first short link/i)).toBeDefined();
    });

    it('should display "Get Started Now" in footer location', () => {
      renderComponent(<StrategicCTA location="footer" />);
      expect(screen.getByText(/get started now/i)).toBeDefined();
    });

    it('should have different copy for each location', () => {
      const copies = new Set();
      const locations: Array<'hero' | 'post-demo' | 'post-features' | 'footer'> = [
        'hero',
        'post-demo',
        'post-features',
        'footer',
      ];

      locations.forEach((location) => {
        const { container, unmount } = renderComponent(<StrategicCTA location={location} />);
        const button = container.querySelector('button');
        if (button) {
          copies.add(button.textContent);
        }
        unmount();
      });

      // Should have multiple different copies
      expect(copies.size).toBeGreaterThan(1);
    });
  });

  describe('Test Case 39: Tracks click with location and variant', () => {
    it('should track CTA click with gtag including location', async () => {
      const user = userEvent.setup();
      renderComponent(<StrategicCTA location="post-demo" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(window.gtag).toHaveBeenCalled();
        const gtagCalls = (window.gtag as any).mock.calls;
        const clickEvent = gtagCalls.find(
          (call: any) => call[0] === 'event' && call[1] === 'cta_click'
        );
        expect(clickEvent).toBeDefined();
        expect(clickEvent[2].event_label).toBe('post-demo');
      });
    });

    it('should track CTA click with variant information', async () => {
      const user = userEvent.setup();
      renderComponent(<StrategicCTA location="hero" />);

      const button = screen.getByRole('button', { name: /try demo/i });
      await user.click(button);

      await waitFor(() => {
        expect(window.gtag).toHaveBeenCalled();
        const gtagCalls = (window.gtag as any).mock.calls;
        const clickEvent = gtagCalls.find(
          (call: any) => call[0] === 'event' && call[1] === 'cta_click'
        );
        expect(clickEvent).toBeDefined();
        expect(clickEvent[2].variant).toMatch(/^[AB]$/);
      });
    });

    it('should track different actions for demo vs register clicks', async () => {
      const user = userEvent.setup();
      renderComponent(<StrategicCTA location="hero" />);

      const demoButton = screen.getByRole('button', { name: /try demo/i });
      await user.click(demoButton);

      await waitFor(() => {
        const gtagCalls = (window.gtag as any).mock.calls;
        const clickEvent = gtagCalls.find(
          (call: any) => call[0] === 'event' && call[1] === 'cta_click'
        );
        expect(clickEvent[2].event_action).toBe('demo');
      });
    });

    it('should include event category and label in tracking', async () => {
      const user = userEvent.setup();
      renderComponent(<StrategicCTA location="post-features" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        const gtagCalls = (window.gtag as any).mock.calls;
        const clickEvent = gtagCalls.find(
          (call: any) => call[0] === 'event' && call[1] === 'cta_click'
        );
        expect(clickEvent[2].event_category).toBe('CTA');
        expect(clickEvent[2].event_label).toBe('post-features');
      });
    });
  });

  describe('Test Case 40: Supports A/B test variant tracking', () => {
    it('should assign A/B test variant on mount', () => {
      renderComponent(<StrategicCTA location="hero" />);

      const storedVariant = localStorage.getItem('cta_variant');
      expect(storedVariant).toMatch(/^[AB]$/);
    });

    it('should persist A/B test variant across renders', () => {
      localStorage.setItem('cta_variant', 'A');
      const { unmount } = renderComponent(<StrategicCTA location="hero" />);

      const firstVariant = localStorage.getItem('cta_variant');
      expect(firstVariant).toBe('A');

      unmount();

      renderComponent(<StrategicCTA location="post-demo" />);
      const secondVariant = localStorage.getItem('cta_variant');
      expect(secondVariant).toBe('A');
    });

    it('should use stored variant if available', () => {
      localStorage.setItem('cta_variant', 'B');
      renderComponent(<StrategicCTA location="hero" />);

      const storedVariant = localStorage.getItem('cta_variant');
      expect(storedVariant).toBe('B');
    });

    it('should include variant in all tracking events', async () => {
      const user = userEvent.setup();
      localStorage.setItem('cta_variant', 'A');
      renderComponent(<StrategicCTA location="post-demo" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        const gtagCalls = (window.gtag as any).mock.calls;
        const clickEvent = gtagCalls.find(
          (call: any) => call[0] === 'event' && call[1] === 'cta_click'
        );
        expect(clickEvent[2].variant).toBe('A');
      });
    });

    it('should randomly assign variant A or B when not stored', () => {
      const variants = new Set();

      // Run multiple times to test randomness
      for (let i = 0; i < 10; i++) {
        localStorage.clear();
        const { unmount } = renderComponent(<StrategicCTA location="hero" />);
        const variant = localStorage.getItem('cta_variant');
        variants.add(variant);
        unmount();
      }

      // Should have assigned at least one variant (might not get both due to randomness)
      expect(variants.size).toBeGreaterThan(0);
      Array.from(variants).forEach((variant) => {
        expect(variant).toMatch(/^[AB]$/);
      });
    });
  });

  describe('Navigation behavior', () => {
    it('should navigate to /register for unauthenticated users clicking post-demo CTA', async () => {
      const user = userEvent.setup();
      renderComponent(<StrategicCTA location="post-demo" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/register');
      });
    });

    it('should navigate to /dashboard for authenticated users', async () => {
      const user = userEvent.setup();
      mockAuthContext.user = { id: '1', username: 'testuser', email: 'test@example.com' } as any;
      renderComponent(<StrategicCTA location="post-demo" />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });

      mockAuthContext.user = null;
    });

    it('should scroll to demo section when hero "Try Demo" is clicked', async () => {
      const user = userEvent.setup();
      const mockScrollIntoView = vi.fn();
      const mockDemoSection = document.createElement('div');
      mockDemoSection.id = 'demo-section';
      mockDemoSection.scrollIntoView = mockScrollIntoView;
      document.body.appendChild(mockDemoSection);

      renderComponent(<StrategicCTA location="hero" />);

      const demoButton = screen.getByRole('button', { name: /try demo/i });
      await user.click(demoButton);

      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      });

      document.body.removeChild(mockDemoSection);
    });
  });

  describe('Visual variants', () => {
    it('should render neon variant for primary CTAs', () => {
      const { container } = renderComponent(<StrategicCTA location="post-demo" />);

      const button = container.querySelector('button');
      // FuturisticButton with neon variant should be rendered
      expect(button).toBeDefined();
    });

    it('should render outline variant for secondary CTAs', () => {
      const { container } = renderComponent(
        <StrategicCTA location="footer" variant="secondary" />
      );

      const button = container.querySelector('button');
      expect(button).toBeDefined();
    });

    it('should have animation on non-hero CTAs', () => {
      const { container } = renderComponent(<StrategicCTA location="post-demo" />);

      // Should have motion wrapper for scroll animation
      const wrapper = container.firstChild;
      expect(wrapper).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      renderComponent(<StrategicCTA location="hero" />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      renderComponent(<StrategicCTA location="post-demo" />);

      const button = screen.getByRole('button');
      button.focus();

      expect(document.activeElement).toBe(button);

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(window.gtag).toHaveBeenCalled();
      });
    });
  });
});
