import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import Home from './Home';
import { ReactNode } from 'react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: { children?: ReactNode; className?: string; [key: string]: unknown }) => (
      <div className={className} data-testid={props['data-testid'] as string}>{children}</div>
    ),
    h1: ({ children, className, ...props }: { children?: ReactNode; className?: string; [key: string]: unknown }) => (
      <h1 className={className} data-testid={props['data-testid'] as string}>{children}</h1>
    ),
    h2: ({ children, className, ...props }: { children?: ReactNode; className?: string; [key: string]: unknown }) => (
      <h2 className={className} data-testid={props['data-testid'] as string}>{children}</h2>
    ),
    p: ({ children, className, ...props }: { children?: ReactNode; className?: string; [key: string]: unknown }) => (
      <p className={className} data-testid={props['data-testid'] as string}>{children}</p>
    ),
    button: ({ children, className, onClick, type, disabled, ...props }: {
      children?: ReactNode;
      className?: string;
      onClick?: () => void;
      type?: string;
      disabled?: boolean;
      [key: string]: unknown
    }) => (
      <button
        className={className}
        onClick={onClick}
        type={type as 'button' | 'submit' | 'reset'}
        disabled={disabled}
        data-testid={props['data-testid'] as string}
      >
        {children}
      </button>
    ),
    footer: ({ children, className, ...props }: { children?: ReactNode; className?: string; [key: string]: unknown }) => (
      <footer className={className} data-testid={props['data-testid'] as string}>{children}</footer>
    ),
    span: ({ children, className, ...props }: { children?: ReactNode; className?: string; [key: string]: unknown }) => (
      <span className={className} data-testid={props['data-testid'] as string}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: null, // Not authenticated by default
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  })),
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

// Mock BackgroundEffect component
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

// Mock GlassMorphismCard component
vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className} data-testid="glass-card">{children}</div>
  ),
}));

// Import the mocked useAuth for manipulation
import { useAuth } from '../contexts/AuthContext';

const renderHome = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Hero Section Display - Scenario Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to unauthenticated state by default
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  // Test Case 1: Hero section displays with headline, tagline, and CTA buttons for unauthenticated user
  describe('Test Case 1: Hero section display for unauthenticated user', () => {
    it('should display hero section with headline when navigating to / as unauthenticated user', async () => {
      renderHome();

      // Verify hero headline is present
      await waitFor(() => {
        expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
      });
    });

    it('should display tagline text for non-authenticated visitors', async () => {
      renderHome();

      // Verify tagline is present
      await waitFor(() => {
        expect(screen.getByText(/Create short, memorable links/)).toBeInTheDocument();
        expect(screen.getByText(/Track clicks and analyze performance/)).toBeInTheDocument();
      });
    });

    it('should display "Get Started" button for unauthenticated user', async () => {
      renderHome();

      await waitFor(() => {
        const getStartedButton = screen.getByRole('button', { name: /Get Started/i });
        expect(getStartedButton).toBeInTheDocument();
      });
    });

    it('should display "Login" button for unauthenticated user', async () => {
      renderHome();

      await waitFor(() => {
        const loginButton = screen.getByRole('button', { name: /Login/i });
        expect(loginButton).toBeInTheDocument();
      });
    });

    it('should have "Get Started" button linking to /register for unauthenticated user', async () => {
      renderHome();

      await waitFor(() => {
        const getStartedLink = screen.getByRole('link', { name: /Get Started/i });
        expect(getStartedLink).toHaveAttribute('href', '/register');
      });
    });

    it('should have "Login" button linking to /login', async () => {
      renderHome();

      await waitFor(() => {
        const loginLink = screen.getByRole('link', { name: /Login/i });
        expect(loginLink).toHaveAttribute('href', '/login');
      });
    });
  });

  // Test Case 2: Headline has gradient text effect classes
  describe('Test Case 2: Hero headline gradient text effect', () => {
    it('should have gradient text effect classes on headline (from-blue-600 via-purple-600 to-pink-600)', async () => {
      renderHome();

      await waitFor(() => {
        const headlineSpan = screen.getByText('Simplify Your Links');
        expect(headlineSpan).toBeInTheDocument();

        // Check for gradient classes
        expect(headlineSpan).toHaveClass('bg-gradient-to-r');
        expect(headlineSpan).toHaveClass('from-blue-600');
        expect(headlineSpan).toHaveClass('via-purple-600');
        expect(headlineSpan).toHaveClass('to-pink-600');
      });
    });

    it('should have bg-clip-text class for gradient effect', async () => {
      renderHome();

      await waitFor(() => {
        const headlineSpan = screen.getByText('Simplify Your Links');
        expect(headlineSpan).toHaveClass('bg-clip-text');
      });
    });

    it('should have text-transparent class for gradient effect', async () => {
      renderHome();

      await waitFor(() => {
        const headlineSpan = screen.getByText('Simplify Your Links');
        expect(headlineSpan).toHaveClass('text-transparent');
      });
    });
  });

  // Test Case 3: Framer Motion animations are applied
  describe('Test Case 3: Hero section animation on load', () => {
    it('should render the hero section container', async () => {
      renderHome();

      // The hero section should render with content
      await waitFor(() => {
        expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
        expect(screen.getByText(/Create short, memorable links/)).toBeInTheDocument();
      });
    });

    it('should render CTA buttons container', async () => {
      renderHome();

      await waitFor(() => {
        // Both buttons should be present in the same container
        const getStartedButton = screen.getByRole('button', { name: /Get Started/i });
        const loginButton = screen.getByRole('button', { name: /Login/i });

        expect(getStartedButton).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
      });
    });

    it('should render the background effect component', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByTestId('background-effect')).toBeInTheDocument();
      });
    });
  });

  // Additional integration tests
  describe('Additional Hero Section Tests', () => {
    it('should render hero section visible and containing all expected elements', async () => {
      renderHome();

      await waitFor(() => {
        // Headline
        expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();

        // Tagline
        expect(screen.getByText(/Create short, memorable links/)).toBeInTheDocument();

        // CTA Buttons
        expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
      });
    });

    it('should display features section', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('URL Shortening')).toBeInTheDocument();
        expect(screen.getByText('Click Analytics')).toBeInTheDocument();
        expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      });
    });

    it('should display footer with copyright notice', async () => {
      renderHome();

      await waitFor(() => {
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
        expect(screen.getByText(/ShortURL/)).toBeInTheDocument();
      });
    });
  });

  // Test authenticated user behavior
  describe('Authenticated User Behavior', () => {
    it('should link "Get Started" to /dashboard for authenticated user', async () => {
      // Mock authenticated user
      vi.mocked(useAuth).mockReturnValue({
        user: { id: 1, username: 'testuser', email: 'test@example.com', is_admin: 0 },
        loading: false,
        isAuthenticated: true,
        isAdmin: false,
        login: vi.fn(),
        logout: vi.fn(),
      });

      renderHome();

      await waitFor(() => {
        const getStartedLink = screen.getByRole('link', { name: /Get Started/i });
        expect(getStartedLink).toHaveAttribute('href', '/dashboard');
      });
    });
  });
});
