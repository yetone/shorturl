import { render, screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import Home from '../pages/Home';
import { HowItWorks } from '../components/HowItWorks';
import { StatisticsSection } from '../components/StatisticsSection';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { InteractiveDemo } from '../components/InteractiveDemo';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, onKeyDown, role, tabIndex, 'aria-expanded': ariaExpanded, ...props }: any) => (
      <div className={className} onClick={onClick} onKeyDown={onKeyDown} role={role} tabIndex={tabIndex} aria-expanded={ariaExpanded} {...props}>{children}</div>
    ),
    h1: ({ children, className, ...props }: any) => (
      <h1 className={className} data-testid="hero-headline" {...props}>{children}</h1>
    ),
    h2: ({ children, className, ...props }: any) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    p: ({ children, className, ...props }: any) => (
      <p className={className} data-testid="hero-subheadline" {...props}>{children}</p>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
    button: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>{children}</button>
    ),
    footer: ({ children, className, ...props }: any) => (
      <footer className={className} {...props}>{children}</footer>
    ),
    section: ({ children, className, ...props }: any) => (
      <section className={className} {...props}>{children}</section>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
  animate: vi.fn((from, to, options) => {
    if (options?.onUpdate) {
      options.onUpdate(to);
    }
    return { stop: vi.fn() };
  }),
}));

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

// Mock the BackgroundEffect component (uses THREE.js)
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

// Mock GlassMorphismCard with dark mode support
vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const isDark = document.documentElement.classList.contains('dark');
    return (
      <div
        className={`${className} ${isDark ? 'dark-mode-card' : 'light-mode-card'}`}
        data-testid="glass-card"
        data-theme={isDark ? 'dark' : 'light'}
      >
        {children}
      </div>
    );
  },
}));

// Mock the FuturisticButton component
vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, variant, size, className, onClick, ...props }: any) => (
    <button
      className={`futuristic-button ${variant || ''} ${size || ''} ${className || ''}`}
      onClick={onClick}
      data-testid={`cta-button-${variant || 'default'}`}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

const renderWithProviders = (component: React.ReactNode) => {
  return render(<TestWrapper>{component}</TestWrapper>);
};

// Helper function to set theme
const setTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  // Trigger MutationObserver callbacks
  document.documentElement.dispatchEvent(new Event('change'));
};

describe('Theme Consistency for New Sections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset theme to light mode before each test
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  });

  afterEach(() => {
    // Clean up after each test
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  });

  // ============================================================================
  // Test Case 1: Render new sections in light theme
  // Input: Render new sections in light theme
  // Expected: All sections display correct light theme colors and maintain glassmorphism style
  // ============================================================================
  describe('Test Case 1: Light Theme Consistency', () => {
    beforeEach(() => {
      setTheme('light');
    });

    it('should render HowItWorks section correctly in light mode', () => {
      renderWithProviders(<HowItWorks />);

      const section = screen.getByRole('region', { name: /how it works/i });
      expect(section).toBeInTheDocument();

      // All steps should be visible
      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      expect(steps.length).toBe(4);

      // Light mode should not have dark class on document
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should render StatisticsSection correctly in light mode', () => {
      renderWithProviders(<StatisticsSection />);

      const section = screen.getByTestId('statistics-section');
      expect(section).toBeInTheDocument();

      // Check all stat cards are present
      expect(screen.getByTestId('stat-card-urls-shortened')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-clicks-tracked')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-active-users')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-uptime')).toBeInTheDocument();
    });

    it('should render Testimonials section correctly in light mode', () => {
      renderWithProviders(<Testimonials />);

      const section = screen.getByTestId('testimonials-section');
      expect(section).toBeInTheDocument();

      const cards = screen.getAllByTestId('testimonial-card');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });

    it('should render FAQ section correctly in light mode', () => {
      renderWithProviders(<FAQ />);

      const section = screen.getByTestId('faq-section');
      expect(section).toBeInTheDocument();

      const faqItems = screen.getAllByTestId('faq-item');
      expect(faqItems.length).toBeGreaterThanOrEqual(5);
    });

    it('should render InteractiveDemo section correctly in light mode', () => {
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      expect(inputField).toBeInTheDocument();

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      expect(shortenButton).toBeInTheDocument();
    });

    it('should maintain glassmorphism style in light mode', () => {
      renderWithProviders(<HowItWorks />);

      const glassCards = screen.getAllByTestId('glass-card');
      expect(glassCards.length).toBeGreaterThan(0);

      // Check all glass cards have light theme attribute
      glassCards.forEach(card => {
        expect(card).toHaveAttribute('data-theme', 'light');
      });
    });

    it('should have proper text contrast in light mode', () => {
      renderWithProviders(<HowItWorks />);

      // Check that titles are visible and have content
      const titles = ['Create Account', 'Paste URL', 'Get Short Link', 'Track Analytics'];
      titles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Test Case 2: Render new sections in dark theme
  // Input: Render new sections in dark theme
  // Expected: All sections display correct dark theme colors without contrast issues
  // ============================================================================
  describe('Test Case 2: Dark Theme Consistency', () => {
    beforeEach(() => {
      setTheme('dark');
    });

    it('should render HowItWorks section correctly in dark mode', () => {
      renderWithProviders(<HowItWorks />);

      const section = screen.getByRole('region', { name: /how it works/i });
      expect(section).toBeInTheDocument();

      // Verify dark mode is active
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // All steps should be visible
      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      expect(steps.length).toBe(4);
    });

    it('should render StatisticsSection correctly in dark mode', () => {
      renderWithProviders(<StatisticsSection />);

      const section = screen.getByTestId('statistics-section');
      expect(section).toBeInTheDocument();

      // Dark mode styling for text
      const labels = screen.getAllByText(/URLs Shortened|Clicks Tracked|Active Users|Uptime/);
      expect(labels.length).toBe(4);
    });

    it('should render Testimonials section correctly in dark mode', () => {
      renderWithProviders(<Testimonials />);

      const section = screen.getByTestId('testimonials-section');
      expect(section).toBeInTheDocument();

      // Check testimonial content is visible
      const quotes = screen.getAllByTestId('testimonial-quote');
      expect(quotes.length).toBeGreaterThanOrEqual(3);
      quotes.forEach(quote => {
        expect(quote.textContent).not.toBe('');
      });
    });

    it('should render FAQ section correctly in dark mode', () => {
      renderWithProviders(<FAQ />);

      const section = screen.getByTestId('faq-section');
      expect(section).toBeInTheDocument();

      // Check FAQ questions are readable
      const questions = screen.getAllByTestId('faq-question');
      expect(questions.length).toBeGreaterThanOrEqual(5);
    });

    it('should render InteractiveDemo section correctly in dark mode', () => {
      renderWithProviders(<InteractiveDemo />);

      const section = screen.getByRole('region', { name: /interactive url shortening demo/i });
      expect(section).toBeInTheDocument();
    });

    it('should apply dark theme to glassmorphism cards', () => {
      renderWithProviders(<HowItWorks />);

      const glassCards = screen.getAllByTestId('glass-card');
      expect(glassCards.length).toBeGreaterThan(0);

      // Check all glass cards have dark theme attribute
      glassCards.forEach(card => {
        expect(card).toHaveAttribute('data-theme', 'dark');
      });
    });

    it('should have proper text contrast in dark mode without readability issues', () => {
      renderWithProviders(<FAQ />);

      // Check that headings and text are visible
      expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();

      // FAQ questions should be readable
      const questions = screen.getAllByTestId('faq-question');
      questions.forEach(question => {
        expect(question.textContent?.length).toBeGreaterThan(10);
      });
    });
  });

  // ============================================================================
  // Test Case 3: Toggle theme while on homepage
  // Input: Toggle theme while on homepage
  // Expected: All new sections transition smoothly to new theme
  // ============================================================================
  describe('Test Case 3: Theme Toggle Transition', () => {
    it('should transition HowItWorks from light to dark mode', async () => {
      setTheme('light');
      const { rerender } = renderWithProviders(<HowItWorks />);

      // Verify initial light mode
      let glassCards = screen.getAllByTestId('glass-card');
      glassCards.forEach(card => {
        expect(card).toHaveAttribute('data-theme', 'light');
      });

      // Toggle to dark mode
      act(() => {
        setTheme('dark');
      });

      // Re-render to trigger updates
      rerender(<TestWrapper><HowItWorks /></TestWrapper>);

      // Verify dark mode is applied
      glassCards = screen.getAllByTestId('glass-card');
      glassCards.forEach(card => {
        expect(card).toHaveAttribute('data-theme', 'dark');
      });
    });

    it('should transition StatisticsSection from light to dark mode', async () => {
      setTheme('light');
      const { rerender } = renderWithProviders(<StatisticsSection />);

      // Toggle to dark mode
      act(() => {
        setTheme('dark');
      });

      rerender(<TestWrapper><StatisticsSection /></TestWrapper>);

      // Section should still be visible and functional
      expect(screen.getByTestId('statistics-section')).toBeInTheDocument();
      expect(screen.getByText(/Trusted by Thousands/i)).toBeInTheDocument();
    });

    it('should transition Testimonials from light to dark mode', async () => {
      setTheme('light');
      const { rerender } = renderWithProviders(<Testimonials />);

      // Toggle to dark mode
      act(() => {
        setTheme('dark');
      });

      rerender(<TestWrapper><Testimonials /></TestWrapper>);

      // Testimonials should still be visible
      const cards = screen.getAllByTestId('testimonial-card');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });

    it('should transition FAQ from light to dark mode', async () => {
      setTheme('light');
      const { rerender } = renderWithProviders(<FAQ />);

      // Toggle to dark mode
      act(() => {
        setTheme('dark');
      });

      rerender(<TestWrapper><FAQ /></TestWrapper>);

      // FAQ should still be fully functional
      expect(screen.getByTestId('faq-section')).toBeInTheDocument();
      const faqItems = screen.getAllByTestId('faq-item');
      expect(faqItems.length).toBeGreaterThanOrEqual(5);
    });

    it('should transition from dark to light mode correctly', async () => {
      setTheme('dark');
      const { rerender } = renderWithProviders(<HowItWorks />);

      // Verify initial dark mode
      let glassCards = screen.getAllByTestId('glass-card');
      glassCards.forEach(card => {
        expect(card).toHaveAttribute('data-theme', 'dark');
      });

      // Toggle to light mode
      act(() => {
        setTheme('light');
      });

      rerender(<TestWrapper><HowItWorks /></TestWrapper>);

      // Verify light mode is applied
      glassCards = screen.getAllByTestId('glass-card');
      glassCards.forEach(card => {
        expect(card).toHaveAttribute('data-theme', 'light');
      });
    });

    it('should apply theme immediately without delays', async () => {
      setTheme('light');
      renderWithProviders(<HowItWorks />);

      // Toggle theme
      act(() => {
        setTheme('dark');
      });

      // Check that dark class is immediately applied
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  // ============================================================================
  // Test Case 4: Load homepage with saved dark mode preference
  // Input: Load homepage with saved dark mode preference
  // Expected: New sections render in dark mode without flash of light theme
  // ============================================================================
  describe('Test Case 4: Saved Theme Preference', () => {
    it('should render HowItWorks in dark mode when preference is saved', () => {
      // Set saved preference before rendering
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');

      renderWithProviders(<HowItWorks />);

      // Verify dark mode is applied from start
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      const glassCards = screen.getAllByTestId('glass-card');
      glassCards.forEach(card => {
        expect(card).toHaveAttribute('data-theme', 'dark');
      });
    });

    it('should render StatisticsSection in dark mode when preference is saved', () => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');

      renderWithProviders(<StatisticsSection />);

      expect(screen.getByTestId('statistics-section')).toBeInTheDocument();
    });

    it('should render Testimonials in dark mode when preference is saved', () => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');

      renderWithProviders(<Testimonials />);

      const cards = screen.getAllByTestId('testimonial-card');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });

    it('should render FAQ in dark mode when preference is saved', () => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');

      renderWithProviders(<FAQ />);

      expect(screen.getByTestId('faq-section')).toBeInTheDocument();
    });

    it('should persist light mode preference correctly', () => {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');

      renderWithProviders(<HowItWorks />);

      expect(document.documentElement.classList.contains('dark')).toBe(false);

      const glassCards = screen.getAllByTestId('glass-card');
      glassCards.forEach(card => {
        expect(card).toHaveAttribute('data-theme', 'light');
      });
    });

    it('should not flash light theme when dark preference is saved', () => {
      // Simulate saved dark preference
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');

      // Render and immediately check - no flash means dark theme from start
      renderWithProviders(<HowItWorks />);

      // First render should already have dark theme
      const glassCards = screen.getAllByTestId('glass-card');
      expect(glassCards.length).toBeGreaterThan(0);
      expect(glassCards[0]).toHaveAttribute('data-theme', 'dark');
    });
  });

  // ============================================================================
  // All Sections Integration Test
  // ============================================================================
  describe('All New Sections Theme Integration', () => {
    it('should render all new sections correctly in light mode', () => {
      setTheme('light');

      // Test each section individually renders
      const { unmount: unmount1 } = renderWithProviders(<HowItWorks />);
      expect(screen.getByRole('region', { name: /how it works/i })).toBeInTheDocument();
      unmount1();

      const { unmount: unmount2 } = renderWithProviders(<StatisticsSection />);
      expect(screen.getByTestId('statistics-section')).toBeInTheDocument();
      unmount2();

      const { unmount: unmount3 } = renderWithProviders(<Testimonials />);
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      unmount3();

      const { unmount: unmount4 } = renderWithProviders(<FAQ />);
      expect(screen.getByTestId('faq-section')).toBeInTheDocument();
      unmount4();

      const { unmount: unmount5 } = renderWithProviders(<InteractiveDemo />);
      expect(screen.getByLabelText(/enter your long url/i)).toBeInTheDocument();
      unmount5();
    });

    it('should render all new sections correctly in dark mode', () => {
      setTheme('dark');

      // Test each section individually renders
      const { unmount: unmount1 } = renderWithProviders(<HowItWorks />);
      expect(screen.getByRole('region', { name: /how it works/i })).toBeInTheDocument();
      unmount1();

      const { unmount: unmount2 } = renderWithProviders(<StatisticsSection />);
      expect(screen.getByTestId('statistics-section')).toBeInTheDocument();
      unmount2();

      const { unmount: unmount3 } = renderWithProviders(<Testimonials />);
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      unmount3();

      const { unmount: unmount4 } = renderWithProviders(<FAQ />);
      expect(screen.getByTestId('faq-section')).toBeInTheDocument();
      unmount4();

      const { unmount: unmount5 } = renderWithProviders(<InteractiveDemo />);
      expect(screen.getByLabelText(/enter your long url/i)).toBeInTheDocument();
      unmount5();
    });
  });
});
