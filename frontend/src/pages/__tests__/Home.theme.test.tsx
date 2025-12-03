import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import React from 'react';

// Mock the API module
vi.mock('../../api', () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
      <div className={className} style={style} {...props}>{children}</div>
    ),
    h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={className} {...props}>{children}</h1>
    ),
    h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className} {...props}>{children}</p>
    ),
    footer: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <footer className={className} {...props}>{children}</footer>
    ),
    button: ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} {...props}>{children}</button>
    ),
    span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock BackgroundEffect to avoid Three.js issues in tests
vi.mock('../../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

// Create a mock AuthContext that returns unauthenticated state
vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn().mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    _reset: () => {
      store = {};
    },
    _getStore: () => store,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock matchMedia for theme context
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

// Helper component to expose theme controls for testing
const ThemeTestHelper = ({ onThemeChange }: { onThemeChange: (theme: string, toggleFn: () => void) => void }) => {
  const { theme, toggleTheme } = useTheme();
  React.useEffect(() => {
    onThemeChange(theme, toggleTheme);
  }, [theme, toggleTheme, onThemeChange]);
  return null;
};

// Helper to render with theme provider and specified theme
const renderWithTheme = (initialTheme: 'light' | 'dark' = 'light') => {
  localStorageMock.clear();
  localStorageMock._reset();
  localStorageMock.getItem.mockReturnValue(initialTheme);
  document.documentElement.classList.remove('dark');
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  let capturedTheme = initialTheme;
  let capturedToggle: (() => void) | null = null;

  const result = render(
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider>
        <ThemeTestHelper onThemeChange={(theme, toggle) => {
          capturedTheme = theme as 'light' | 'dark';
          capturedToggle = toggle;
        }} />
        <Home />
      </ThemeProvider>
    </MemoryRouter>
  );

  return {
    ...result,
    getTheme: () => capturedTheme,
    toggleTheme: () => {
      if (capturedToggle) {
        act(() => {
          capturedToggle!();
        });
      }
    }
  };
};

describe('Home - Theme Mode Support', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock._reset();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  describe('Test Case 1: Render Home with ThemeContext theme="light"', () => {
    it('should render the homepage in light mode without dark mode classes', () => {
      const { container } = renderWithTheme('light');

      // Main container should NOT have dark mode classes
      const mainContainer = container.querySelector('.relative.min-h-screen');
      expect(mainContainer).not.toHaveClass('bg-gray-900');
      expect(mainContainer).not.toHaveClass('text-white');
    });

    it('should apply appropriate light mode styling to the tagline', () => {
      const { container } = renderWithTheme('light');

      // The tagline paragraph should not have dark mode text color
      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).not.toHaveClass('text-gray-300');
    });

    it('should render footer with appropriate light mode opacity', () => {
      const { container } = renderWithTheme('light');

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      // In light mode, footer has opacity-75 class (not opacity-50)
      expect(footer?.className).toContain('opacity-75');
      expect(footer?.className).not.toContain('opacity-50');
    });

    it('should not have dark class on document element in light mode', () => {
      renderWithTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Test Case 2: Render Home with ThemeContext theme="dark"', () => {
    it('should render the homepage with dark mode classes applied', () => {
      const { container } = renderWithTheme('dark');

      // Main container should have dark mode classes
      const mainContainer = container.querySelector('.relative.min-h-screen');
      expect(mainContainer).toHaveClass('bg-gray-900');
      expect(mainContainer).toHaveClass('text-white');
    });

    it('should apply dark mode text color to the tagline', () => {
      renderWithTheme('dark');

      // The tagline paragraph should have dark mode text color class
      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).toHaveClass('text-gray-300');
    });

    it('should render footer with dark mode opacity styling', () => {
      const { container } = renderWithTheme('dark');

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      // In dark mode, footer has opacity-50 class (not opacity-75)
      expect(footer?.className).toContain('opacity-50');
    });

    it('should have dark class on document element in dark mode', () => {
      renderWithTheme('dark');
      // ThemeProvider adds 'dark' class to document.documentElement
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Test Case 3: Toggle theme from light to dark', () => {
    it('should transition all elements to dark mode styling when theme is toggled', async () => {
      const { container, toggleTheme, getTheme } = renderWithTheme('light');

      // Verify starting in light mode
      expect(getTheme()).toBe('light');
      let mainContainer = container.querySelector('.relative.min-h-screen');
      expect(mainContainer).not.toHaveClass('bg-gray-900');

      // Toggle to dark mode
      toggleTheme();

      // Wait for state update and re-render
      await waitFor(() => {
        expect(getTheme()).toBe('dark');
      });

      // Re-query the DOM after toggle
      await waitFor(() => {
        mainContainer = container.querySelector('.relative.min-h-screen');
        expect(mainContainer).toHaveClass('bg-gray-900');
        expect(mainContainer).toHaveClass('text-white');
      });
    });

    it('should update tagline styling when toggling from light to dark', async () => {
      const { toggleTheme, getTheme } = renderWithTheme('light');

      // Verify tagline is in light mode
      let tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).not.toHaveClass('text-gray-300');

      // Toggle to dark mode
      toggleTheme();

      await waitFor(() => {
        expect(getTheme()).toBe('dark');
      });

      // Re-query after toggle
      await waitFor(() => {
        tagline = screen.getByText(/Create short, memorable links/i);
        expect(tagline).toHaveClass('text-gray-300');
      });
    });

    it('should persist theme preference to localStorage on toggle', async () => {
      const { toggleTheme } = renderWithTheme('light');

      // Toggle to dark mode
      toggleTheme();

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      });
    });

    it('should toggle document dark class when theme changes', async () => {
      const { toggleTheme, getTheme } = renderWithTheme('light');

      // Initially no dark class
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Toggle to dark
      toggleTheme();

      await waitFor(() => {
        expect(getTheme()).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });
  });

  describe('Test Case 4: Verify text contrast in light mode', () => {
    // Note: Actual color contrast computation requires computed styles
    // We verify that the correct classes are applied which provide proper contrast

    it('should use appropriate text color classes for light mode readability', () => {
      const { container } = renderWithTheme('light');

      // Check headline text is visible (gradient text)
      const headline = screen.getByRole('heading', { level: 1 });
      const gradientSpan = headline.querySelector('span');
      expect(gradientSpan).toHaveClass('bg-gradient-to-r');
      expect(gradientSpan).toHaveClass('text-transparent');
      expect(gradientSpan).toHaveClass('bg-clip-text');
    });

    it('should ensure tagline has readable contrast in light mode', () => {
      renderWithTheme('light');

      // In light mode, tagline does not have text-gray-300 (which is for dark mode)
      // Default text color provides good contrast on light backgrounds
      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).not.toHaveClass('text-gray-300');
      // The text should be readable (inherits default dark text on light bg)
    });

    it('should apply proper footer text styling in light mode for readability', () => {
      const { container } = renderWithTheme('light');

      const footer = container.querySelector('footer');
      // Footer in light mode has opacity-75 which maintains readability
      expect(footer?.className).toContain('opacity-75');
    });

    it('should have feature section title with gradient for visibility', () => {
      renderWithTheme('light');

      const featuresHeading = screen.getByRole('heading', { level: 2, name: /Features/i });
      expect(featuresHeading).toHaveClass('bg-gradient-to-r');
      expect(featuresHeading).toHaveClass('from-blue-500');
      expect(featuresHeading).toHaveClass('to-purple-600');
      expect(featuresHeading).toHaveClass('bg-clip-text');
      expect(featuresHeading).toHaveClass('text-transparent');
    });
  });

  describe('Test Case 5: Verify text contrast in dark mode', () => {
    it('should use white text color for dark mode readability', () => {
      const { container } = renderWithTheme('dark');

      // Main container should have text-white class for readability
      const mainContainer = container.querySelector('.relative.min-h-screen');
      expect(mainContainer).toHaveClass('text-white');
    });

    it('should apply gray-300 text color to tagline for dark mode readability', () => {
      renderWithTheme('dark');

      // In dark mode, tagline has text-gray-300 for appropriate contrast
      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).toHaveClass('text-gray-300');
    });

    it('should have dark background for proper text contrast in dark mode', () => {
      const { container } = renderWithTheme('dark');

      // Dark mode background (bg-gray-900) ensures white text is readable
      const mainContainer = container.querySelector('.relative.min-h-screen');
      expect(mainContainer).toHaveClass('bg-gray-900');
    });

    it('should maintain feature card visibility in dark mode', () => {
      renderWithTheme('dark');

      // Feature titles should be visible (part of the card text)
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    });

    it('should apply appropriate footer opacity for dark mode readability', () => {
      const { container } = renderWithTheme('dark');

      const footer = container.querySelector('footer');
      // Footer in dark mode has opacity-50 for subtle appearance while maintaining readability
      expect(footer?.className).toContain('opacity-50');
    });
  });

  describe('GlassMorphismCard theme integration', () => {
    it('should render feature cards correctly in light mode', () => {
      renderWithTheme('light');

      // Feature cards should be present
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });

    it('should render feature cards correctly in dark mode', () => {
      renderWithTheme('dark');

      // Feature cards should be present in dark mode too
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });
  });

  describe('Theme consistency across all homepage elements', () => {
    it('should render all major sections in light mode', () => {
      renderWithTheme('light');

      // Hero section
      expect(screen.getByRole('heading', { level: 1, name: /Simplify Your Links/i })).toBeInTheDocument();
      expect(screen.getByText(/Create short, memorable links/i)).toBeInTheDocument();

      // CTA buttons
      expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();

      // Features section
      expect(screen.getByRole('heading', { level: 2, name: /Features/i })).toBeInTheDocument();

      // Footer
      expect(screen.getByText(/ShortURL. All rights reserved/i)).toBeInTheDocument();

      // Background effect
      expect(screen.getByTestId('background-effect')).toBeInTheDocument();
    });

    it('should render all major sections in dark mode', () => {
      renderWithTheme('dark');

      // Hero section
      expect(screen.getByRole('heading', { level: 1, name: /Simplify Your Links/i })).toBeInTheDocument();
      expect(screen.getByText(/Create short, memorable links/i)).toBeInTheDocument();

      // CTA buttons
      expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();

      // Features section
      expect(screen.getByRole('heading', { level: 2, name: /Features/i })).toBeInTheDocument();

      // Footer
      expect(screen.getByText(/ShortURL. All rights reserved/i)).toBeInTheDocument();

      // Background effect
      expect(screen.getByTestId('background-effect')).toBeInTheDocument();
    });
  });
});
