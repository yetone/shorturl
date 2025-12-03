import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the API module
vi.mock('../api', () => ({
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
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock BackgroundEffect to avoid Three.js issues in tests
vi.mock('../components/BackgroundEffect', () => ({
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

// Helper to render with all providers (unauthenticated)
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

// Mock AuthContext for controlled testing
const MockAuthProvider = ({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) => {
  const mockUser = isAuthenticated ? { id: 1, username: 'testuser', email: 'test@example.com', is_admin: 0 } : null;

  const value = {
    user: mockUser,
    loading: false,
    isAuthenticated,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

// Create a mock context
import { createContext, useContext } from 'react';

const MockAuthContext = createContext<{
  user: { id: number; username: string; email: string; is_admin: number } | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}>({
  user: null,
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: vi.fn(),
  logout: vi.fn(),
});

// Create a test version of Home component that uses our mock context
const HomeWithMockAuth = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  // We'll test the actual Home component by controlling the localStorage token
  return <Home />;
};

describe('Home Component - Authentication State Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Unit Tests', () => {
    it('Test Case 1: Get Started button links to /register when unauthenticated', async () => {
      // No token in localStorage = unauthenticated
      localStorageMock.getItem.mockReturnValue(null);

      renderWithProviders(<Home />);

      // Find the Get Started button/link
      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();

      // Check that the parent link has the correct href
      const getStartedLink = getStartedButton.closest('a');
      expect(getStartedLink).toHaveAttribute('href', '/register');
    });

    it('Test Case 2: Get Started button links to /dashboard when authenticated', async () => {
      // Simulate authenticated state by setting token
      localStorageMock.getItem.mockReturnValue('fake-token');

      // We need to mock the API call that validates the token
      const { getCurrentUser } = await import('../api');
      (getCurrentUser as any).mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_admin: 0,
      });

      renderWithProviders(<Home />);

      // Wait for the auth check to complete and user to be set
      await vi.waitFor(() => {
        const getStartedButton = screen.getByRole('button', { name: /get started/i });
        const getStartedLink = getStartedButton.closest('a');
        expect(getStartedLink).toHaveAttribute('href', '/dashboard');
      }, { timeout: 3000 });
    });
  });

  describe('Integration Tests', () => {
    it('Test Case 3: Click Get Started as unauthenticated user navigates to registration page', async () => {
      const user = userEvent.setup();

      // No token = unauthenticated
      localStorageMock.getItem.mockReturnValue(null);

      // Use MemoryRouter to track navigation
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

    it('Test Case 4: Click Get Started as authenticated user navigates to dashboard page', async () => {
      const user = userEvent.setup();

      // Simulate authenticated state
      localStorageMock.getItem.mockReturnValue('fake-token');

      const { getCurrentUser } = await import('../api');
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
      await vi.waitFor(() => {
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

// Helper component to track location changes
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const LocationTracker = ({ onLocationChange }: { onLocationChange: (location: string) => void }) => {
  const location = useLocation();

  useEffect(() => {
    onLocationChange(location.pathname);
  }, [location.pathname, onLocationChange]);

  return null;
};
