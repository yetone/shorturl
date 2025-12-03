import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock the BackgroundEffect component since it uses Three.js
vi.mock('../../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect">Background Effect Mock</div>,
}));

// Mock the ErrorBoundary component
vi.mock('../../components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock ThemeContext
const mockUseTheme = vi.fn();
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

// Wrapper component with all providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const renderHome = () => {
  return render(
    <TestWrapper>
      <Home />
    </TestWrapper>
  );
};

describe('Home - Hero Section Display and Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: unauthenticated user with light theme
    mockUseAuth.mockReturnValue({ user: null });
    mockUseTheme.mockReturnValue({ theme: 'light' });
  });

  describe('Test Case 1: Hero section renders with headline text containing value proposition', () => {
    it('should render the hero section with the value proposition headline', () => {
      renderHome();

      // Check for the main headline text
      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toBeInTheDocument();
      expect(headline).toHaveTextContent('Simplify Your Links');
    });

    it('should display the headline with gradient styling', () => {
      renderHome();

      const headline = screen.getByRole('heading', { level: 1 });
      const gradientSpan = headline.querySelector('span');

      expect(gradientSpan).toBeInTheDocument();
      expect(gradientSpan).toHaveClass('bg-gradient-to-r');
      expect(gradientSpan).toHaveClass('from-blue-600');
      expect(gradientSpan).toHaveClass('via-purple-600');
      expect(gradientSpan).toHaveClass('to-pink-600');
    });

    it('should display the tagline paragraph', () => {
      renderHome();

      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).toBeInTheDocument();
      expect(tagline).toHaveTextContent('Track clicks and analyze performance with our dashboard');
    });

    it('should render hero section with proper structure as unauthenticated user', () => {
      mockUseAuth.mockReturnValue({ user: null });
      renderHome();

      // Verify the hero section structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/Create short, memorable links/i)).toBeInTheDocument();
    });
  });

  describe('Test Case 2: Get Started button is rendered and visible', () => {
    it('should render the Get Started button', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();
    });

    it('should have the Get Started button visible in the document', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      expect(getStartedButton).toBeVisible();
    });

    it('should wrap Get Started button in a link to register for unauthenticated users', () => {
      mockUseAuth.mockReturnValue({ user: null });
      renderHome();

      const links = screen.getAllByRole('link');
      const registerLink = links.find(link => link.getAttribute('href') === '/register');

      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toContainElement(screen.getByRole('button', { name: /get started/i }));
    });

    it('should wrap Get Started button in a link to dashboard for authenticated users', () => {
      mockUseAuth.mockReturnValue({ user: { id: 1, username: 'testuser', email: 'test@test.com', is_admin: 0 } });
      renderHome();

      const links = screen.getAllByRole('link');
      const dashboardLink = links.find(link => link.getAttribute('href') === '/dashboard');

      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toContainElement(screen.getByRole('button', { name: /get started/i }));
    });
  });

  describe('Test Case 3: Login button is rendered and visible', () => {
    it('should render the Login button', () => {
      renderHome();

      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('should have the Login button visible in the document', () => {
      renderHome();

      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeVisible();
    });

    it('should wrap Login button in a link to login page', () => {
      renderHome();

      const links = screen.getAllByRole('link');
      const loginLink = links.find(link => link.getAttribute('href') === '/login');

      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toContainElement(screen.getByRole('button', { name: /login/i }));
    });
  });

  describe('Test Case 4: Button visual hierarchy - Get Started (primary) vs Login (secondary)', () => {
    it('should render Get Started button with neon (primary) variant styling', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });

      // The neon variant has gradient background styling
      expect(getStartedButton).toHaveClass('bg-gradient-to-r');
      expect(getStartedButton).toHaveClass('from-indigo-500');
      expect(getStartedButton).toHaveClass('to-purple-600');
    });

    it('should render Login button with outline (secondary) variant styling', () => {
      renderHome();

      const loginButton = screen.getByRole('button', { name: /login/i });

      // The outline variant has border styling and transparent background
      expect(loginButton).toHaveClass('border-2');
      expect(loginButton).toHaveClass('border-indigo-500');
      expect(loginButton).toHaveClass('bg-transparent');
    });

    it('should render both buttons with large size', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Large size classes
      expect(getStartedButton).toHaveClass('px-6');
      expect(getStartedButton).toHaveClass('py-3');
      expect(getStartedButton).toHaveClass('text-lg');

      expect(loginButton).toHaveClass('px-6');
      expect(loginButton).toHaveClass('py-3');
      expect(loginButton).toHaveClass('text-lg');
    });

    it('should ensure Get Started has primary variant while Login has secondary', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Get Started (neon variant) has solid background
      const getStartedHasGradient = getStartedButton.className.includes('bg-gradient-to-r');

      // Login (outline variant) has transparent background with border
      const loginHasOutline = loginButton.className.includes('border-2') &&
                              loginButton.className.includes('bg-transparent');

      expect(getStartedHasGradient).toBe(true);
      expect(loginHasOutline).toBe(true);
    });

    it('should display buttons in a flex container for proper alignment', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });

      // The buttons should be within a flex container
      const buttonContainer = getStartedButton.closest('.flex');
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass('gap-4');
    });
  });

  describe('Additional hero section tests', () => {
    it('should render with dark mode styling when theme is dark', () => {
      mockUseTheme.mockReturnValue({ theme: 'dark' });
      renderHome();

      // The main container should have dark mode classes
      const mainContainer = screen.getByRole('heading', { level: 1 }).closest('.relative');
      expect(mainContainer).toHaveClass('bg-gray-900');
      expect(mainContainer).toHaveClass('text-white');
    });

    it('should render the BackgroundEffect component', () => {
      renderHome();

      const backgroundEffect = screen.getByTestId('background-effect');
      expect(backgroundEffect).toBeInTheDocument();
    });

    it('should render the footer with copyright text', () => {
      renderHome();

      const footer = screen.getByText(/ShortURL. All rights reserved/i);
      expect(footer).toBeInTheDocument();
    });
  });
});
