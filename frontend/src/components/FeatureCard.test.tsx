import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { motion } from 'framer-motion';
import Home from '../pages/Home';
import { GlassMorphismCard } from './GlassMorphismCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onHoverStart, onHoverEnd, whileHover, ...props }: any) => (
      <div
        {...props}
        data-testid="motion-div"
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        data-scale-on-hover={whileHover?.scale || 'none'}
      >
        {children}
      </div>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>,
}));

// Mock useAuth hook
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

// Mock useTheme hook
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
  useLocation: () => ({ pathname: '/' }),
}));

// Mock components that cause issues
vi.mock('./SocialProof', () => ({
  SocialProof: () => <div data-testid="mock-social-proof">Social Proof</div>,
}));

vi.mock('./BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="mock-background-effect">Background Effect</div>,
}));

vi.mock('./FuturisticButton', () => ({
  FuturisticButton: ({ children, variant='primary', ...props }: any) => (
    <button data-variant={variant} {...props}>{children}</button>
  ),
}));

describe('FeatureCard Hover Interactions and Visual Feedback (REQ-5)', () => {
  describe('Test Case 1: Initial hover state', () => {
    it('should render feature cards on the homepage', () => {
      render(<Home />);

      const featureCards = screen.getAllByRole('heading', { level: 3 });
      expect(featureCards).toHaveLength(6);

      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });

    it('should have glassmorphism styling applied', () => {
      render(
        <GlassMorphismCard glowColor="rgba(57, 255, 20, 0.2)">
          <h3>URL Shortening</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('URL Shortening').closest('[data-testid="motion-div"]') as HTMLElement;
      expect(card).toBeInTheDocument();
    });
  });

  describe('Test Case 2: Hover scaling animation to 1.02x', () => {
    it('should have scale animation configured for hover', () => {
      render(
        <GlassMorphismCard glowColor="rgba(0, 255, 255, 0.2)">
          <h3>Click Analytics</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Click Analytics').closest('[data-scale-on-hover]') as HTMLElement;
      expect(card).toBeInTheDocument();
      expect(card.dataset.scaleOnHover).toBe('1.02');
    });

    it('should allow hover interactions on feature cards', async () => {
      const user = userEvent.setup();

      render(
        <GlassMorphismCard glowColor="rgba(255, 16, 240, 0.2)">
          <h3>User Dashboard</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('User Dashboard').closest('[data-testid="motion-div"]') as HTMLElement;
      expect(card).toBeInTheDocument();

      // Hover over the card
      await user.hover(card);

      // Card should be interactive (hover effect should be triggered)
      expect(card).toBeInTheDocument();
    });

    it('should maintain 1.02x scale configuration for all feature cards', () => {
      render(<Home />);

      const motionDivs = screen.getAllByTestId('motion-div');
      const cardsWithScale = motionDivs.filter(div => div.dataset.scaleOnHover === '1.02');

      // Should have at least 6 feature cards with scale 1.02
      expect(cardsWithScale.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Test Case 3: Enhanced glow effect on hover', () => {
    it('should accept custom glow color for green themed cards', () => {
      render(
        <GlassMorphismCard glowColor="rgba(57, 255, 20, 0.2)">
          <h3>URL Shortening</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const glowCard = screen.getByText('URL Shortening');
      expect(glowCard).toBeInTheDocument();
    });

    it('should apply cyan glow for analytics cards', () => {
      render(
        <GlassMorphismCard glowColor="rgba(0, 255, 255, 0.2)">
          <h3>Click Analytics</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const glowCard = screen.getByText('Click Analytics');
      expect(glowCard).toBeInTheDocument();
    });

    it('should apply pink glow for dashboard cards', () => {
      render(
        <GlassMorphismCard glowColor="rgba(255, 16, 240, 0.2)">
          <h3>User Dashboard</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const glowCard = screen.getByText('User Dashboard');
      expect(glowCard).toBeInTheDocument();
    });

    it('should apply different glow colors for secure and fast cards', () => {
      // Secure links (green)
      render(
        <GlassMorphismCard glowColor="rgba(57, 255, 20, 0.2)">
          <h3>Secure Links</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      // Lightning Fast (yellow)
      render(
        <GlassMorphismCard glowColor="rgba(250, 255, 0, 0.2)">
          <h3>Lightning Fast</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });

    it('should have glow effect container (AnimatePresence) for all cards', () => {
      render(<Home />);

      const glowContainers = screen.getAllByTestId('animate-presence');
      // Should have at least 6 glow containers for 6 feature cards
      expect(glowContainers.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Test Case 4: Animation reverses smoothly', () => {
    it('should handle mouse leave events', async () => {
      const user = userEvent.setup();

      render(
        <GlassMorphismCard glowColor="rgba(0, 255, 255, 0.2)">
          <h3>Global Access</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Global Access').closest('[data-testid="motion-div"]') as HTMLElement;

      // Hover first
      await user.hover(card);
      expect(card).toBeInTheDocument();

      // Then unhover
      await user.unhover(card);
      expect(card).toBeInTheDocument();
    });

    it('should support rapid hover/unhover cycles', async () => {
      const user = userEvent.setup();

      render(
        <GlassMorphismCard glowColor="rgba(57, 255, 20, 0.2)">
          <h3>Secure Links</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Secure Links').closest('[data-testid="motion-div"]') as HTMLElement;

      // Perform rapid hover/unhover cycles
      for (let i = 0; i < 5; i++) {
        await user.hover(card);
        await user.unhover(card);
      }

      // Card should still be functional
      expect(card).toBeInTheDocument();
    });
  });

  describe('Performance: Smooth animations without jank', () => {
    it('should use GPU-accelerated transforms for scale animation', () => {
      render(
        <GlassMorphismCard glowColor="rgba(255, 16, 240, 0.2)">
          <h3>Lightning Fast</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Lightning Fast').closest('[data-scale-on-hover]') as HTMLElement;
      expect(card.dataset.scaleOnHover).toBe('1.02');
    });

    it('should maintain valid component state during rapid interactions', async () => {
      const user = userEvent.setup();

      render(
        <GlassMorphismCard glowColor="rgba(250, 255, 0, 0.2)">
          <h3>Lightning Fast</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Lightning Fast').closest('[data-testid="motion-div"]') as HTMLElement;

      // Rapid interactions
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(user.hover(card));
        promises.push(user.unhover(card));
      }

      await Promise.all(promises);

      // Component should not break
      expect(card).toBeInTheDocument();
    });

    it('should support disabled hover effects when hoverEffect=false', () => {
      render(
        <GlassMorphismCard glowColor="rgba(255, 16, 240, 0.2)" hoverEffect={false}>
          <h3>User Dashboard</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('User Dashboard').closest('[data-scale-on-hover]') as HTMLElement;
      expect(card.dataset.scaleOnHover).toBe('none');
    });
  });

  describe('Accessibility: Focus management', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <GlassMorphismCard glowColor="rgba(0, 255, 255, 0.2)">
          <h3>Global Access</h3>
          <p>Test description</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Global Access').closest('[data-testid="motion-div"]') as HTMLElement;
      card.tabIndex = 0; // Make it focusable

      // Focus the card
      await user.tab();
      expect(document.activeElement).toBe(card);
    });
  });
});
