import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialProof } from './SocialProof';

// Mock the contexts
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark' })
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

describe('SocialProof Component', () => {
  describe('Unit Tests - Render and Display', () => {
    it('should render social proof section', () => {
      render(<SocialProof />);
      const section = screen.getByTestId('social-proof-section');
      expect(section).toBeInTheDocument();
    });

    it('should display usage statistics with large numbers and labels', () => {
      render(<SocialProof />);

      // Check for statistics
      expect(screen.getByText('10,000+')).toBeInTheDocument();
      expect(screen.getByText('URLs Shortened')).toBeInTheDocument();
      expect(screen.getByText('1M+')).toBeInTheDocument();
      expect(screen.getByText('Clicks Tracked')).toBeInTheDocument();
      expect(screen.getByText('5,000+')).toBeInTheDocument();
      expect(screen.getByText('Active Users')).toBeInTheDocument();
    });

    it('should display at least 2-3 key metrics (URLs shortened, clicks tracked, users)', () => {
      render(<SocialProof />);

      // Verify all three key metrics are present
      const urlsStat = screen.getByTestId('stat-urls-shortened');
      const clicksStat = screen.getByTestId('stat-clicks-tracked');
      const usersStat = screen.getByTestId('stat-active-users');

      expect(urlsStat).toBeInTheDocument();
      expect(clicksStat).toBeInTheDocument();
      expect(usersStat).toBeInTheDocument();
    });

    it('should display trust indicators with security badges/icons', () => {
      render(<SocialProof />);

      // Check for trust badges
      expect(screen.getByText('Secure & Encrypted')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
      expect(screen.getByText('99.9% Uptime')).toBeInTheDocument();

      // Verify they have test IDs
      expect(screen.getByTestId('trust-badge-security')).toBeInTheDocument();
      expect(screen.getByTestId('trust-badge-performance')).toBeInTheDocument();
      expect(screen.getByTestId('trust-badge-reliability')).toBeInTheDocument();
    });

    it('should render heading and description text', () => {
      render(<SocialProof />);

      expect(screen.getByText('Trusted by Thousands')).toBeInTheDocument();
      expect(screen.getByText('Join our growing community of users who trust us with their links')).toBeInTheDocument();
    });
  });

  describe('Integration Tests - Responsive Layout', () => {
    it('should have grid layout classes for statistics on desktop', () => {
      render(<SocialProof />);

      const statsContainer = screen.getByTestId('stat-urls-shortened').parentElement;
      expect(statsContainer?.className).toMatch(/grid/);
      expect(statsContainer?.className).toMatch(/md:grid-cols-3/);
    });

    it('should have single column on mobile (grid-cols-1)', () => {
      render(<SocialProof />);

      const statsContainer = screen.getByTestId('stat-urls-shortened').parentElement;
      expect(statsContainer?.className).toMatch(/grid-cols-1/);
    });

    it('should use flexbox for trust badges that wraps on small screens', () => {
      render(<SocialProof />);

      const trustBadgeContainer = screen.getByTestId('trust-badge-security').parentElement;
      expect(trustBadgeContainer?.className).toMatch(/flex/);
      expect(trustBadgeContainer?.className).toMatch(/flex-wrap/);
    });

    it('should have responsive text sizes', () => {
      render(<SocialProof />);

      const statValue = screen.getByText('10,000+');
      expect(statValue.className).toMatch(/text-3xl/);
      expect(statValue.className).toMatch(/md:text-4xl/);
    });
  });

  describe('E2E Tests - Visual Elements', () => {
    it('should verify trust indicators (badges/icons) are visible', () => {
      render(<SocialProof />);

      // Check that all trust badges are rendered and visible
      const securityBadge = screen.getByTestId('trust-badge-security');
      const performanceBadge = screen.getByTestId('trust-badge-performance');
      const reliabilityBadge = screen.getByTestId('trust-badge-reliability');

      expect(securityBadge).toBeVisible();
      expect(performanceBadge).toBeVisible();
      expect(reliabilityBadge).toBeVisible();

      // Verify badge content
      expect(securityBadge).toHaveTextContent('Secure & Encrypted');
      expect(performanceBadge).toHaveTextContent('Lightning Fast');
      expect(reliabilityBadge).toHaveTextContent('99.9% Uptime');
    });

    it('should have proper styling classes for visual presentation', () => {
      render(<SocialProof />);

      const section = screen.getByTestId('social-proof-section');
      expect(section.className).toMatch(/max-w-6xl/);
      expect(section.className).toMatch(/mx-auto/);
    });

    it('should display gradient text for heading', () => {
      render(<SocialProof />);

      const heading = screen.getByText('Trusted by Thousands');
      expect(heading.className).toMatch(/bg-gradient-to-r/);
      expect(heading.className).toMatch(/bg-clip-text/);
      expect(heading.className).toMatch(/text-transparent/);
    });
  });
});
