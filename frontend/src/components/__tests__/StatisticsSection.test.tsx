import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StatisticsSection, DEFAULT_STATS, StatItem } from '../StatisticsSection';

// Mock framer-motion to simplify testing
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useInView: vi.fn(() => true), // Default to being in view for tests
    animate: vi.fn((from, to, options) => {
      // Immediately call onUpdate with the final value to complete animation
      if (options?.onUpdate) {
        options.onUpdate(to);
      }
      return { stop: vi.fn() };
    }),
  };
});

// Mock the GlassMorphismCard component
vi.mock('../GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className, 'data-testid': testId }: {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    hoverEffect?: boolean;
    'data-testid'?: string;
  }) => (
    <div className={className} data-testid={testId}>
      {children}
    </div>
  ),
}));

describe('StatisticsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Test Case 1: Statistics section renders on page load', () => {
    it('should render statistics section with at least 2 metric counters', () => {
      render(<StatisticsSection />);

      // Check that the statistics section is rendered
      const section = screen.getByTestId('statistics-section');
      expect(section).toBeInTheDocument();

      // Check for at least 2 stat cards (URLs shortened and Clicks tracked)
      const urlsShortenedCard = screen.getByTestId('stat-card-urls-shortened');
      const clicksTrackedCard = screen.getByTestId('stat-card-clicks-tracked');

      expect(urlsShortenedCard).toBeInTheDocument();
      expect(clicksTrackedCard).toBeInTheDocument();
    });

    it('should render all default statistics cards', () => {
      render(<StatisticsSection />);

      // Check all four default stats are present
      expect(screen.getByTestId('stat-card-urls-shortened')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-clicks-tracked')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-active-users')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-uptime')).toBeInTheDocument();
    });

    it('should display the section heading', () => {
      render(<StatisticsSection />);

      const heading = screen.getByRole('heading', { name: /trusted by thousands/i });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Test Case 2: Counter animation triggers on scroll into view', () => {
    it('should use useInView hook for scroll detection', async () => {
      const { useInView } = await import('framer-motion');
      render(<StatisticsSection />);

      // Verify useInView was called
      expect(useInView).toHaveBeenCalled();
    });

    it('should animate numbers from 0 to target value', async () => {
      const { animate } = await import('framer-motion');
      render(<StatisticsSection />);

      // Verify animate was called for the counters
      await waitFor(() => {
        expect(animate).toHaveBeenCalled();
      });
    });

    it('should pass correct animation options', async () => {
      const { animate } = await import('framer-motion');
      render(<StatisticsSection />);

      await waitFor(() => {
        // Check that animate was called with starting value 0
        const calls = (animate as ReturnType<typeof vi.fn>).mock.calls;
        expect(calls.length).toBeGreaterThan(0);

        // First argument should be starting value (0)
        expect(calls[0][0]).toBe(0);

        // Third argument should have duration and ease options
        expect(calls[0][2]).toHaveProperty('duration');
        expect(calls[0][2]).toHaveProperty('ease');
      });
    });
  });

  describe('Test Case 3: Statistics component with mock data', () => {
    const mockStats: StatItem[] = [
      {
        id: 'custom-urls',
        label: 'Custom URLs',
        value: 5000,
        icon: () => <svg data-testid="custom-icon" />,
        glowColor: 'rgba(255, 0, 0, 0.2)',
        iconColor: 'text-red-500',
      },
      {
        id: 'custom-clicks',
        label: 'Custom Clicks',
        value: 100000,
        icon: () => <svg data-testid="custom-icon-2" />,
        glowColor: 'rgba(0, 255, 0, 0.2)',
        iconColor: 'text-green-500',
      },
    ];

    it('should render with custom mock data', () => {
      render(<StatisticsSection stats={mockStats} />);

      expect(screen.getByTestId('stat-card-custom-urls')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-custom-clicks')).toBeInTheDocument();
    });

    it('should display formatted numbers with appropriate suffixes', () => {
      render(<StatisticsSection stats={mockStats} />);

      // 5000 should be formatted as "5K"
      expect(screen.getByText(/5K/)).toBeInTheDocument();

      // 100000 should be formatted as "100K"
      expect(screen.getByText(/100K/)).toBeInTheDocument();
    });

    it('should render icons for each metric', () => {
      render(<StatisticsSection stats={mockStats} />);

      const icons = screen.getAllByTestId(/custom-icon/);
      expect(icons.length).toBeGreaterThanOrEqual(2);
    });

    it('should display labels for each metric', () => {
      render(<StatisticsSection stats={mockStats} />);

      expect(screen.getByText('Custom URLs')).toBeInTheDocument();
      expect(screen.getByText('Custom Clicks')).toBeInTheDocument();
    });

    it('should handle large numbers with proper formatting', () => {
      const largeStats: StatItem[] = [
        {
          id: 'billions',
          label: 'Billions',
          value: 2500000000,
          icon: () => <svg />,
          glowColor: 'rgba(0, 0, 255, 0.2)',
          iconColor: 'text-blue-500',
        },
        {
          id: 'millions',
          label: 'Millions',
          value: 45000000,
          icon: () => <svg />,
          glowColor: 'rgba(0, 0, 255, 0.2)',
          iconColor: 'text-blue-500',
        },
      ];

      render(<StatisticsSection stats={largeStats} />);

      // 2.5B for billions
      expect(screen.getByText(/2\.5B/)).toBeInTheDocument();
      // 45M for millions
      expect(screen.getByText(/45M/)).toBeInTheDocument();
    });

    it('should handle suffix values like percentage', () => {
      const statsWithSuffix: StatItem[] = [
        {
          id: 'percentage',
          label: 'Success Rate',
          value: 99.9,
          suffix: '%',
          icon: () => <svg />,
          glowColor: 'rgba(0, 255, 0, 0.2)',
          iconColor: 'text-green-500',
        },
      ];

      render(<StatisticsSection stats={statsWithSuffix} />);

      expect(screen.getByText(/99\.9%/)).toBeInTheDocument();
    });
  });

  describe('Test Case 4: Screen reader accessibility', () => {
    it('should have proper aria-label for the section', () => {
      render(<StatisticsSection />);

      const section = screen.getByRole('region', { name: /platform statistics/i });
      expect(section).toBeInTheDocument();
    });

    it('should have proper role="list" for the statistics grid', () => {
      render(<StatisticsSection />);

      const list = screen.getByRole('list', { name: /statistics metrics/i });
      expect(list).toBeInTheDocument();
    });

    it('should have list items for each stat', () => {
      render(<StatisticsSection />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(DEFAULT_STATS.length);
    });

    it('should have accessible labels for counter values', () => {
      render(<StatisticsSection />);

      // Each counter should have an aria-label with the formatted value
      // Values: URLs = 1,250,000 -> 1.2M, Clicks = 45,000,000 -> 45M
      const counters = screen.getAllByRole('text');
      expect(counters.length).toBeGreaterThanOrEqual(2);

      // Check that aria-labels are present on counters
      const urlsCounter = counters.find(c => c.getAttribute('aria-label')?.includes('M'));
      expect(urlsCounter).toBeDefined();
      expect(urlsCounter?.getAttribute('aria-label')).toMatch(/\d/);
    });

    it('should mark icons as decorative (aria-hidden)', () => {
      render(<StatisticsSection />);

      // Icons should be hidden from screen readers
      const iconContainers = document.querySelectorAll('[aria-hidden="true"]');
      expect(iconContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Layout and styling', () => {
    it('should have responsive grid layout', () => {
      render(<StatisticsSection />);

      const grid = screen.getByRole('list');
      expect(grid).toHaveClass('grid');
      expect(grid).toHaveClass('grid-cols-2');
      expect(grid).toHaveClass('md:grid-cols-4');
    });

    it('should accept custom className', () => {
      render(<StatisticsSection className="custom-class" />);

      const section = screen.getByTestId('statistics-section');
      expect(section).toHaveClass('custom-class');
    });
  });

  describe('Default data verification', () => {
    it('should have URLs Shortened in default stats', () => {
      const urlsStat = DEFAULT_STATS.find(s => s.id === 'urls-shortened');
      expect(urlsStat).toBeDefined();
      expect(urlsStat?.label).toBe('URLs Shortened');
      expect(urlsStat?.value).toBeGreaterThan(0);
    });

    it('should have Clicks Tracked in default stats', () => {
      const clicksStat = DEFAULT_STATS.find(s => s.id === 'clicks-tracked');
      expect(clicksStat).toBeDefined();
      expect(clicksStat?.label).toBe('Clicks Tracked');
      expect(clicksStat?.value).toBeGreaterThan(0);
    });

    it('should have at minimum 2 metrics as required', () => {
      expect(DEFAULT_STATS.length).toBeGreaterThanOrEqual(2);
    });
  });
});
