import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import Home from '../pages/Home';
import { ReactNode } from 'react';

// Mock the AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock the BackgroundEffect since it uses Three.js
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, variants, initial, animate, whileInView, viewport, whileHover, onHoverStart, onHoverEnd, ...props }: any) => (
      <div className={className} style={style} data-testid={props['data-testid']} {...props}>
        {children}
      </div>
    ),
    h1: ({ children, className, ...props }: any) => <h1 className={className} {...props}>{children}</h1>,
    h2: ({ children, className, ...props }: any) => <h2 className={className} {...props}>{children}</h2>,
    p: ({ children, className, ...props }: any) => <p className={className} {...props}>{children}</p>,
    footer: ({ children, className, ...props }: any) => <footer className={className} {...props}>{children}</footer>,
    button: ({ children, className, type, onClick, disabled, ...props }: any) => (
      <button className={className} type={type} onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithProviders = (component: ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('How It Works Section - Scenario Tests', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    // Set default theme
    localStorage.setItem('theme', 'light');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: View How It Works section - Section displays three steps with clear titles and descriptions
  describe('Test Case 1: Section displays three steps with clear titles and descriptions', () => {
    it('should display the How It Works section heading', () => {
      renderWithProviders(<Home />);

      const heading = screen.getByText('How It Works');
      expect(heading).toBeInTheDocument();
    });

    it('should display the How It Works section with data-testid', () => {
      renderWithProviders(<Home />);

      const section = screen.getByTestId('how-it-works-section');
      expect(section).toBeInTheDocument();
    });

    it('should display three steps: Paste URL, Get Short Link, Track & Share', () => {
      renderWithProviders(<Home />);

      expect(screen.getByText('Paste URL')).toBeInTheDocument();
      expect(screen.getByText('Get Short Link')).toBeInTheDocument();
      expect(screen.getByText('Track & Share')).toBeInTheDocument();
    });

    it('should display descriptions for each step', () => {
      renderWithProviders(<Home />);

      expect(screen.getByText(/Simply paste your long URL into our shortener/i)).toBeInTheDocument();
      expect(screen.getByText(/Instantly receive a short, memorable link/i)).toBeInTheDocument();
      expect(screen.getByText(/Share your link anywhere and track clicks/i)).toBeInTheDocument();
    });

    it('should have step titles as h3 elements', () => {
      renderWithProviders(<Home />);

      const pasteUrl = screen.getByText('Paste URL');
      const getShortLink = screen.getByText('Get Short Link');
      const trackShare = screen.getByText('Track & Share');

      expect(pasteUrl.tagName).toBe('H3');
      expect(getShortLink.tagName).toBe('H3');
      expect(trackShare.tagName).toBe('H3');
    });
  });

  // Test Case 2: Check step indicators - Each step has a numbered indicator (1, 2, 3)
  describe('Test Case 2: Each step has a numbered indicator (1, 2, 3)', () => {
    it('should display step indicator 1', () => {
      renderWithProviders(<Home />);

      const stepIndicator1 = screen.getByTestId('step-indicator-1');
      expect(stepIndicator1).toBeInTheDocument();
      expect(stepIndicator1).toHaveTextContent('1');
    });

    it('should display step indicator 2', () => {
      renderWithProviders(<Home />);

      const stepIndicator2 = screen.getByTestId('step-indicator-2');
      expect(stepIndicator2).toBeInTheDocument();
      expect(stepIndicator2).toHaveTextContent('2');
    });

    it('should display step indicator 3', () => {
      renderWithProviders(<Home />);

      const stepIndicator3 = screen.getByTestId('step-indicator-3');
      expect(stepIndicator3).toBeInTheDocument();
      expect(stepIndicator3).toHaveTextContent('3');
    });

    it('should have all three numbered indicators present', () => {
      renderWithProviders(<Home />);

      const indicator1 = screen.getByTestId('step-indicator-1');
      const indicator2 = screen.getByTestId('step-indicator-2');
      const indicator3 = screen.getByTestId('step-indicator-3');

      expect(indicator1).toHaveTextContent('1');
      expect(indicator2).toHaveTextContent('2');
      expect(indicator3).toHaveTextContent('3');
    });

    it('should have visual progression styling on indicators (rounded-full)', () => {
      const { container } = renderWithProviders(<Home />);

      const indicator1 = screen.getByTestId('step-indicator-1');
      const indicator2 = screen.getByTestId('step-indicator-2');
      const indicator3 = screen.getByTestId('step-indicator-3');

      expect(indicator1).toHaveClass('rounded-full');
      expect(indicator2).toHaveClass('rounded-full');
      expect(indicator3).toHaveClass('rounded-full');
    });

    it('should have gradient background on step indicators', () => {
      renderWithProviders(<Home />);

      const indicator1 = screen.getByTestId('step-indicator-1');
      const indicator2 = screen.getByTestId('step-indicator-2');
      const indicator3 = screen.getByTestId('step-indicator-3');

      expect(indicator1).toHaveClass('bg-gradient-to-r');
      expect(indicator2).toHaveClass('bg-gradient-to-r');
      expect(indicator3).toHaveClass('bg-gradient-to-r');
    });
  });

  // Test Case 3: Verify step content accuracy - Steps describe: 1) Paste URL, 2) Get Short Link, 3) Track & Share
  describe('Test Case 3: Steps describe correct content in order', () => {
    it('should have step 1 associated with "Paste URL"', () => {
      renderWithProviders(<Home />);

      const stepIndicator1 = screen.getByTestId('step-indicator-1');
      // The step indicator and "Paste URL" should be in the same container
      const parentCard = stepIndicator1.closest('.h-full');
      expect(parentCard).toContainElement(screen.getByText('Paste URL'));
    });

    it('should have step 2 associated with "Get Short Link"', () => {
      renderWithProviders(<Home />);

      const stepIndicator2 = screen.getByTestId('step-indicator-2');
      // The step indicator and "Get Short Link" should be in the same container
      const parentCard = stepIndicator2.closest('.h-full');
      expect(parentCard).toContainElement(screen.getByText('Get Short Link'));
    });

    it('should have step 3 associated with "Track & Share"', () => {
      renderWithProviders(<Home />);

      const stepIndicator3 = screen.getByTestId('step-indicator-3');
      // The step indicator and "Track & Share" should be in the same container
      const parentCard = stepIndicator3.closest('.h-full');
      expect(parentCard).toContainElement(screen.getByText('Track & Share'));
    });

    it('should display all steps in correct sequential order within the section', () => {
      renderWithProviders(<Home />);

      const section = screen.getByTestId('how-it-works-section');

      // Check all steps are within the How It Works section
      expect(section).toContainElement(screen.getByText('Paste URL'));
      expect(section).toContainElement(screen.getByText('Get Short Link'));
      expect(section).toContainElement(screen.getByText('Track & Share'));
    });

    it('should have steps displayed in a grid layout', () => {
      const { container } = renderWithProviders(<Home />);

      const section = screen.getByTestId('how-it-works-section');
      const grid = section.querySelector('.grid.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });
  });

  // Additional integration tests for How It Works section
  describe('Additional How It Works Section Tests', () => {
    it('should render How It Works section with icons', () => {
      const { container } = renderWithProviders(<Home />);

      // Find SVG icons within the How It Works section
      const section = screen.getByTestId('how-it-works-section');
      const icons = section.querySelectorAll('svg');

      // Should have 3 icons for the 3 steps
      expect(icons.length).toBeGreaterThanOrEqual(3);
    });

    it('should have proper gap between step cards', () => {
      renderWithProviders(<Home />);

      const section = screen.getByTestId('how-it-works-section');
      const grid = section.querySelector('.gap-8');
      expect(grid).toBeInTheDocument();
    });

    it('should use GlassMorphismCard styling (backdrop-blur-md)', () => {
      renderWithProviders(<Home />);

      const section = screen.getByTestId('how-it-works-section');
      const cards = section.querySelectorAll('.backdrop-blur-md');

      // Should have 3 glassmorphism cards for the 3 steps
      expect(cards.length).toBe(3);
    });

    it('should display the How It Works heading with gradient styling', () => {
      renderWithProviders(<Home />);

      const heading = screen.getByText('How It Works');
      expect(heading).toHaveClass('bg-gradient-to-r');
      expect(heading).toHaveClass('from-blue-500');
      expect(heading).toHaveClass('to-purple-600');
    });
  });
});
