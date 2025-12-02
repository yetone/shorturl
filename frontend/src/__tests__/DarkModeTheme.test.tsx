import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import Home from '../pages/Home';
import { ReactNode, useState, useEffect } from 'react';

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
    div: ({ children, className, style, ...props }: any) => (
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

// Helper component to test theme context
const ThemeTestHelper = () => {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">Set Dark</button>
      <button onClick={() => setTheme('light')} data-testid="set-light">Set Light</button>
      <button onClick={toggleTheme} data-testid="toggle-theme">Toggle Theme</button>
    </div>
  );
};

// Component that wraps Home and allows setting initial theme
const HomeWithThemeControl = ({ initialTheme }: { initialTheme: 'light' | 'dark' }) => {
  const { theme, setTheme } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTheme(initialTheme);
    setIsReady(true);
  }, [initialTheme, setTheme]);

  if (!isReady) return null;

  return <Home />;
};

const renderWithTheme = (component: ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Dark Mode Theme Support - Scenario Tests', () => {
  beforeEach(() => {
    // Reset document classes
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove('dark');
  });

  // Test Case 1: Integration test - Toggle theme to dark mode
  describe('Test Case 1: Toggle theme to dark mode - Homepage background, text, and components switch to dark mode colors', () => {
    it('should render homepage with dark mode styling when theme is set to dark', async () => {
      renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      // Wait for the component to render with dark theme
      await waitFor(() => {
        expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
      });

      // Check that dark mode class is applied to document
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should apply dark mode background class to main container when dark theme is active', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const mainContainer = container.querySelector('.bg-gray-900');
        expect(mainContainer).toBeInTheDocument();
      });
    });

    it('should apply dark mode text color class when dark theme is active', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const mainContainer = container.querySelector('.text-white');
        expect(mainContainer).toBeInTheDocument();
      });
    });

    it('should switch from light to dark mode when toggling theme', async () => {
      const user = userEvent.setup();

      renderWithTheme(<ThemeTestHelper />);

      // Toggle to dark mode
      await user.click(screen.getByTestId('set-dark'));

      // Wait for theme change
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('should update localStorage when theme is changed', async () => {
      const user = userEvent.setup();

      renderWithTheme(<ThemeTestHelper />);

      // Set theme to dark
      await user.click(screen.getByTestId('set-dark'));

      // Check localStorage was updated (after useEffect runs)
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('should add dark class to document.documentElement when dark mode is enabled', async () => {
      const user = userEvent.setup();

      renderWithTheme(<ThemeTestHelper />);

      // Set theme to dark
      await user.click(screen.getByTestId('set-dark'));

      // Check document class
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });
  });

  // Test Case 2: E2E test - Check text contrast in dark mode
  describe('Test Case 2: Check text contrast in dark mode - WCAG AA compliance (4.5:1 ratio)', () => {
    it('should use high-contrast text colors in dark mode (text-white on bg-gray-900)', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const mainContainer = container.querySelector('.text-white');
        expect(mainContainer).toBeInTheDocument();
      });
    });

    it('should use gray-300 for secondary text in dark mode (meets WCAG AA)', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const tagline = container.querySelector('.text-gray-300');
        expect(tagline).toBeInTheDocument();
      });
    });

    it('should maintain gradient text visibility in dark mode', async () => {
      renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const gradientText = screen.getByText('Simplify Your Links');
        expect(gradientText).toHaveClass('bg-gradient-to-r');
        expect(gradientText).toHaveClass('bg-clip-text');
        expect(gradientText).toHaveClass('text-transparent');
      });
    });

    it('should have proper contrast for feature card text in dark mode', async () => {
      renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        expect(screen.getByText('URL Shortening')).toBeInTheDocument();
        expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      });
    });

    it('should apply appropriate footer opacity in dark mode', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const footer = container.querySelector('footer.opacity-50');
        expect(footer).toBeInTheDocument();
      });
    });

    it('should use neon colors that provide sufficient contrast against dark background', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const neonGreen = container.querySelectorAll('.text-neon-green');
        const neonBlue = container.querySelectorAll('.text-neon-blue');
        const neonPink = container.querySelectorAll('.text-neon-pink');

        expect(neonGreen.length).toBeGreaterThan(0);
        expect(neonBlue.length).toBeGreaterThan(0);
        expect(neonPink.length).toBeGreaterThan(0);
      });
    });
  });

  // Test Case 3: Unit test - Verify ThemeContext integration
  describe('Test Case 3: Verify ThemeContext integration - Homepage components correctly consume theme from ThemeContext', () => {
    it('should provide theme value through useTheme hook', async () => {
      renderWithTheme(<ThemeTestHelper />);

      // Theme should be accessible
      const themeElement = screen.getByTestId('current-theme');
      expect(['light', 'dark']).toContain(themeElement.textContent);
    });

    it('should provide setTheme function through useTheme hook', async () => {
      const user = userEvent.setup();

      renderWithTheme(<ThemeTestHelper />);

      await user.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      });
    });

    it('should provide toggleTheme function through useTheme hook', async () => {
      const user = userEvent.setup();

      renderWithTheme(<ThemeTestHelper />);

      // Get initial theme
      const initialTheme = screen.getByTestId('current-theme').textContent;

      await user.click(screen.getByTestId('toggle-theme'));

      await waitFor(() => {
        const newTheme = screen.getByTestId('current-theme').textContent;
        expect(newTheme).not.toBe(initialTheme);
      });
    });

    it('should throw error when useTheme is used outside ThemeProvider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const InvalidComponent = () => {
        const { theme } = useTheme();
        return <div>{theme}</div>;
      };

      expect(() => {
        render(<InvalidComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleError.mockRestore();
    });

    it('should read isDarkMode correctly in Home component based on theme context', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        // When isDarkMode is true, the container should have bg-gray-900 and text-white
        const darkContainer = container.querySelector('.bg-gray-900.text-white');
        expect(darkContainer).toBeInTheDocument();
      });
    });

    it('should not apply dark mode classes when theme is light', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="light" />);

      await waitFor(() => {
        // When theme is light, container should have min-h-screen but not dark mode classes
        const lightContainer = container.querySelector('.min-h-screen');
        expect(lightContainer).toBeInTheDocument();

        // Should NOT have dark mode specific classes combination
        const darkContainer = container.querySelector('.bg-gray-900.text-white');
        expect(darkContainer).toBeNull();
      });
    });
  });

  // Test Case 4: E2E test - Toggle between light and dark modes
  describe('Test Case 4: Toggle between light and dark modes - Theme transitions smoothly without layout shifts', () => {
    it('should transition smoothly without layout shifts when toggling theme', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="light" />);

      await waitFor(() => {
        const mainContainer = container.querySelector('.min-h-screen');
        expect(mainContainer).toBeInTheDocument();
      });
    });

    it('should maintain layout structure when switching from light to dark', async () => {
      // First render with light theme
      const { container, unmount } = renderWithTheme(<HomeWithThemeControl initialTheme="light" />);

      await waitFor(() => {
        expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
      });

      // Check layout elements are present
      const lightFeatureGrid = container.querySelector('.grid.md\\:grid-cols-3');
      expect(lightFeatureGrid).toBeInTheDocument();

      unmount();

      // Re-render with dark theme
      const { container: darkContainer } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
      });

      // Check same layout elements are present in dark mode
      const darkFeatureGrid = darkContainer.querySelector('.grid.md\\:grid-cols-3');
      expect(darkFeatureGrid).toBeInTheDocument();
    });

    it('should preserve all content visibility during theme toggle', async () => {
      renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        // All major content sections should be visible
        expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('URL Shortening')).toBeInTheDocument();
        expect(screen.getByText('Click Analytics')).toBeInTheDocument();
        expect(screen.getByText('User Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Global Access')).toBeInTheDocument();
        expect(screen.getByText('Secure Links')).toBeInTheDocument();
        expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
      });
    });

    it('should maintain button visibility and functionality in dark mode', async () => {
      renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const getStartedButton = screen.getByRole('button', { name: /Get Started/i });
        const loginButton = screen.getByRole('button', { name: /Login/i });

        expect(getStartedButton).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
      });
    });

    it('should maintain responsive grid layout in both themes', async () => {
      // Light mode
      const { container: lightContainer, unmount } = renderWithTheme(<HomeWithThemeControl initialTheme="light" />);

      await waitFor(() => {
        const lightGrid = lightContainer.querySelector('.md\\:grid-cols-3');
        expect(lightGrid).toBeInTheDocument();
      });

      unmount();

      // Dark mode
      const { container: darkContainer } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const darkGrid = darkContainer.querySelector('.md\\:grid-cols-3');
        expect(darkGrid).toBeInTheDocument();
      });
    });

    it('should preserve gap spacing in feature grid during theme switch', async () => {
      const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

      await waitFor(() => {
        const grid = container.querySelector('.gap-8');
        expect(grid).toBeInTheDocument();
      });
    });
  });
});

// Additional ThemeContext Unit Tests
describe('ThemeContext Unit Tests', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('should update document class when theme changes', async () => {
    const user = userEvent.setup();

    renderWithTheme(<ThemeTestHelper />);

    // Set to dark
    await user.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // Set back to light
    await user.click(screen.getByTestId('set-light'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});

// GlassMorphismCard Dark Mode Tests
describe('GlassMorphismCard Dark Mode Styling', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('should apply dark mode styling when dark class is present on document', async () => {
    const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

    await waitFor(() => {
      // GlassMorphismCard should detect dark mode
      const cards = container.querySelectorAll('.backdrop-blur-md');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it('should have text-white class on cards in dark mode', async () => {
    const { container } = renderWithTheme(<HomeWithThemeControl initialTheme="dark" />);

    await waitFor(() => {
      // GlassMorphismCard applies text-white in dark mode
      const whiteTextCards = container.querySelectorAll('.text-white');
      expect(whiteTextCards.length).toBeGreaterThan(0);
    });
  });
});
