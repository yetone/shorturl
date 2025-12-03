import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 {...props}>{children}</h2>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
    button: ({ children, onClick, className, disabled, type, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} className={className} disabled={disabled} type={type} {...props}>
        {children}
      </button>
    ),
    footer: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <footer {...props}>{children}</footer>
    ),
    article: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <article {...props}>{children}</article>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Home - Error Boundary Handling', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for tests that expect errors
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Test Case 1: Render Home when WebGL is unavailable', () => {
    it('should render homepage without background effect when WebGL fails to initialize', () => {
      // Mock BackgroundEffect to throw an error simulating WebGL unavailability
      vi.doMock('../../components/BackgroundEffect', () => ({
        BackgroundEffect: () => {
          throw new Error('WebGL is not supported');
        },
      }));

      render(
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <Home />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      );

      // The homepage should still render its main content
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/Simplify Your Links/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should render all feature cards even when background effect crashes', () => {
      vi.doMock('../../components/BackgroundEffect', () => ({
        BackgroundEffect: () => {
          throw new Error('WebGL context lost');
        },
      }));

      render(
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <Home />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      );

      // All feature cards should still be visible
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });

    it('should render footer when WebGL is unavailable', () => {
      vi.doMock('../../components/BackgroundEffect', () => ({
        BackgroundEffect: () => {
          throw new Error('WebGL not available');
        },
      }));

      render(
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <Home />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.getByText(/ShortURL. All rights reserved/i)).toBeInTheDocument();
    });
  });

  describe('Test Case 2: Render Home with missing AuthContext', () => {
    it('should handle missing AuthContext gracefully and render with unauthenticated state', () => {
      // Render without AuthProvider - the component should use fallback values
      render(
        <BrowserRouter>
          <ThemeProvider>
            <Home />
          </ThemeProvider>
        </BrowserRouter>
      );

      // Homepage should render with unauthenticated state (Get Started links to /register)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/Simplify Your Links/i)).toBeInTheDocument();

      const links = screen.getAllByRole('link');
      const registerLink = links.find(link => link.getAttribute('href') === '/register');
      expect(registerLink).toBeInTheDocument();
    });

    it('should not crash when AuthContext is missing', () => {
      // This test ensures no runtime errors occur
      expect(() => {
        render(
          <BrowserRouter>
            <ThemeProvider>
              <Home />
            </ThemeProvider>
          </BrowserRouter>
        );
      }).not.toThrow();
    });

    it('should show Get Started button linking to register when auth context unavailable', () => {
      render(
        <BrowserRouter>
          <ThemeProvider>
            <Home />
          </ThemeProvider>
        </BrowserRouter>
      );

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();

      // When auth is unavailable, user is treated as unauthenticated
      const links = screen.getAllByRole('link');
      const registerLink = links.find(link => link.getAttribute('href') === '/register');
      expect(registerLink).toContainElement(getStartedButton);
    });
  });

  describe('Test Case 3: Render Home with missing ThemeContext', () => {
    it('should handle missing ThemeContext gracefully with default light theme', () => {
      // Render without ThemeProvider - the component should use fallback values
      render(
        <BrowserRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </BrowserRouter>
      );

      // Homepage should render with default (light) theme
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/Simplify Your Links/i)).toBeInTheDocument();

      // Main container should NOT have dark mode classes when using default theme
      const mainContainer = screen.getByRole('heading', { level: 1 }).closest('main');
      expect(mainContainer).not.toHaveClass('bg-gray-900');
      expect(mainContainer).not.toHaveClass('text-white');
    });

    it('should not crash when ThemeContext is missing', () => {
      // This test ensures no runtime errors occur
      expect(() => {
        render(
          <BrowserRouter>
            <AuthProvider>
              <Home />
            </AuthProvider>
          </BrowserRouter>
        );
      }).not.toThrow();
    });

    it('should render all feature cards with default theme when ThemeContext unavailable', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </BrowserRouter>
      );

      // All features should render regardless of theme context
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    });

    it('should display footer correctly without ThemeContext', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </BrowserRouter>
      );

      const footer = screen.getByText(/ShortURL. All rights reserved/i);
      expect(footer).toBeInTheDocument();
      // Without dark theme, footer should have default opacity
      expect(footer.closest('footer')).not.toHaveClass('opacity-50');
    });
  });

  describe('Combined error scenarios', () => {
    it('should handle both missing contexts gracefully', () => {
      // Render without any providers
      expect(() => {
        render(
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        );
      }).not.toThrow();

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/Simplify Your Links/i)).toBeInTheDocument();
    });

    it('should render complete homepage structure without any context providers', () => {
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      // Hero section
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/Create short, memorable links/i)).toBeInTheDocument();

      // CTA buttons
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

      // Features section
      expect(screen.getByRole('heading', { level: 2, name: /features/i })).toBeInTheDocument();

      // Footer
      expect(screen.getByText(/ShortURL. All rights reserved/i)).toBeInTheDocument();
    });
  });
});
