import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '../Home';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock the API module
vi.mock('../../api', () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
    button: ({ children, onHoverStart, onHoverEnd, whileHover, whileTap, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock BackgroundEffect to avoid Three.js issues in tests
vi.mock('../../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

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
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia for ThemeContext
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Helper component to track location changes
const LocationTracker = ({ onLocationChange }: { onLocationChange: (location: string) => void }) => {
  const location = useLocation();

  useEffect(() => {
    onLocationChange(location.pathname);
  }, [location.pathname, onLocationChange]);

  return null;
};

// Helper to render with all providers
const renderWithProviders = (ui: React.ReactElement, { initialEntries = ['/'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Home Component - Navigation Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Test Case 1: Click Get Started (unauthenticated) - Router navigates to /register', () => {
    it('should have Get Started button link to /register when unauthenticated', async () => {
      // No token in localStorage = unauthenticated
      localStorageMock.getItem.mockReturnValue(null);

      renderWithProviders(<Home />);

      // Find the Get Started button
      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();

      // Check that the parent link has the correct href
      const getStartedLink = getStartedButton.closest('a');
      expect(getStartedLink).toHaveAttribute('href', '/register');
    });

    it('should navigate to /register when clicking Get Started as unauthenticated user', async () => {
      const user = userEvent.setup();

      // No token = unauthenticated
      localStorageMock.getItem.mockReturnValue(null);

      let currentLocation = '/';

      render(
        <MemoryRouter initialEntries={['/']}>
          <ThemeProvider>
            <AuthProvider>
              <Home />
              <LocationTracker onLocationChange={(loc) => { currentLocation = loc; }} />
            </AuthProvider>
          </ThemeProvider>
        </MemoryRouter>
      );

      // Find and click the Get Started button
      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      await user.click(getStartedButton);

      // Check that navigation occurred to /register
      expect(currentLocation).toBe('/register');
    });
  });

  describe('Test Case 2: Click Login button - Router navigates to /login', () => {
    it('should have Login button link to /login', async () => {
      // Unauthenticated state
      localStorageMock.getItem.mockReturnValue(null);

      renderWithProviders(<Home />);

      // Find the Login button
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeInTheDocument();

      // Check that the parent link has the correct href
      const loginLink = loginButton.closest('a');
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('should navigate to /login when clicking Login button', async () => {
      const user = userEvent.setup();

      // Unauthenticated state
      localStorageMock.getItem.mockReturnValue(null);

      let currentLocation = '/';

      render(
        <MemoryRouter initialEntries={['/']}>
          <ThemeProvider>
            <AuthProvider>
              <Home />
              <LocationTracker onLocationChange={(loc) => { currentLocation = loc; }} />
            </AuthProvider>
          </ThemeProvider>
        </MemoryRouter>
      );

      // Find and click the Login button
      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      // Check that navigation occurred to /login
      expect(currentLocation).toBe('/login');
    });

    it('should have Login button always link to /login regardless of authentication state', async () => {
      // Simulate authenticated state
      localStorageMock.getItem.mockReturnValue('fake-token');

      const { getCurrentUser } = await import('../../api');
      (getCurrentUser as any).mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_admin: 0,
      });

      renderWithProviders(<Home />);

      // Wait for auth state to settle
      await waitFor(() => {
        const loginButton = screen.getByRole('button', { name: /login/i });
        expect(loginButton).toBeInTheDocument();
      });

      // Login button should still point to /login even when authenticated
      const loginButton = screen.getByRole('button', { name: /login/i });
      const loginLink = loginButton.closest('a');
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Test Case 3: Click Get Started (authenticated) - Router navigates to /dashboard', () => {
    it('should have Get Started button link to /dashboard when authenticated', async () => {
      // Simulate authenticated state by setting token
      localStorageMock.getItem.mockReturnValue('fake-token');

      // Mock the API call that validates the token
      const { getCurrentUser } = await import('../../api');
      (getCurrentUser as any).mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_admin: 0,
      });

      renderWithProviders(<Home />);

      // Wait for the auth check to complete and user to be set
      await waitFor(() => {
        const getStartedButton = screen.getByRole('button', { name: /get started/i });
        const getStartedLink = getStartedButton.closest('a');
        expect(getStartedLink).toHaveAttribute('href', '/dashboard');
      }, { timeout: 3000 });
    });

    it('should navigate to /dashboard when clicking Get Started as authenticated user', async () => {
      const user = userEvent.setup();

      // Simulate authenticated state
      localStorageMock.getItem.mockReturnValue('fake-token');

      const { getCurrentUser } = await import('../../api');
      (getCurrentUser as any).mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_admin: 0,
      });

      let currentLocation = '/';

      render(
        <MemoryRouter initialEntries={['/']}>
          <ThemeProvider>
            <AuthProvider>
              <Home />
              <LocationTracker onLocationChange={(loc) => { currentLocation = loc; }} />
            </AuthProvider>
          </ThemeProvider>
        </MemoryRouter>
      );

      // Wait for auth to complete - link should change to /dashboard
      await waitFor(() => {
        const getStartedButton = screen.getByRole('button', { name: /get started/i });
        const getStartedLink = getStartedButton.closest('a');
        expect(getStartedLink).toHaveAttribute('href', '/dashboard');
      }, { timeout: 3000 });

      // Now click the button
      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      await user.click(getStartedButton);

      // Check that navigation occurred to /dashboard
      expect(currentLocation).toBe('/dashboard');
    });
  });
});
