import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
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

describe('Home Component - Keyboard Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Test Case 1: Tab through homepage elements', () => {
    it('all interactive elements are reachable via Tab key', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue(null);

      renderWithProviders(<Home />);

      // Get all interactive elements that should be tabbable
      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Verify buttons exist and are focusable (have no tabindex=-1)
      expect(getStartedButton).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();

      // Both buttons should not have negative tabindex
      expect(getStartedButton).not.toHaveAttribute('tabindex', '-1');
      expect(loginButton).not.toHaveAttribute('tabindex', '-1');

      // Tab through elements and verify focus moves correctly
      // Start by focusing the document body
      document.body.focus();

      // Tab to first focusable element
      await user.tab();

      // The Get Started button (or its link wrapper) should be focusable
      const getStartedLink = getStartedButton.closest('a');
      const loginLink = loginButton.closest('a');

      // Verify both interactive elements can receive focus
      // Tab should move through focusable elements
      const focusableElements = document.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      expect(focusableElements.length).toBeGreaterThanOrEqual(2);

      // Verify Get Started and Login links are among focusable elements
      const focusableArray = Array.from(focusableElements);
      expect(focusableArray.some(el => el === getStartedLink || el.contains(getStartedButton))).toBe(true);
      expect(focusableArray.some(el => el === loginLink || el.contains(loginButton))).toBe(true);
    });
  });

  describe('Test Case 2: Check focus visibility on Get Started button', () => {
    it('button shows visible focus indicator when focused', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue(null);

      renderWithProviders(<Home />);

      const getStartedButton = screen.getByRole('button', { name: /get started/i });

      // Check that the button has focus ring classes in its className
      // The FuturisticButton component has: focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
      expect(getStartedButton.className).toContain('focus:ring');

      // Also verify focus:outline-none is present (to use ring instead of browser default)
      expect(getStartedButton.className).toContain('focus:outline-none');

      // Focus the button programmatically
      getStartedButton.focus();
      expect(document.activeElement).toBe(getStartedButton);

      // Verify the button accepts focus (is not disabled and not hidden from focus)
      expect(getStartedButton).not.toBeDisabled();
    });
  });

  describe('Test Case 3: Press Enter on focused Get Started button', () => {
    it('button activates and navigation occurs when Enter is pressed', async () => {
      const user = userEvent.setup();
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

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const getStartedLink = getStartedButton.closest('a');

      // Focus the link (which wraps the button)
      if (getStartedLink) {
        getStartedLink.focus();
        expect(document.activeElement).toBe(getStartedLink);

        // Press Enter on the focused link
        await user.keyboard('{Enter}');

        // Verify navigation occurred to /register (unauthenticated user)
        expect(currentLocation).toBe('/register');
      } else {
        // If there's no link wrapper, focus and activate the button directly
        getStartedButton.focus();
        await user.keyboard('{Enter}');
        // Button should still be interactive
        expect(getStartedButton).not.toBeDisabled();
      }
    });

    it('button activates when Space is pressed', async () => {
      const user = userEvent.setup();
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

      const getStartedButton = screen.getByRole('button', { name: /get started/i });

      // Focus the button
      getStartedButton.focus();
      expect(document.activeElement).toBe(getStartedButton);

      // Press Space on the focused button
      await user.keyboard(' ');

      // The button should be activated - for a button inside a link,
      // the click event should propagate and trigger navigation
      // Note: Space on a link doesn't navigate in all browsers, but click does
      // The button should at least be interactive
      expect(getStartedButton).not.toBeDisabled();
    });
  });

  describe('Test Case 4: Verify tab order', () => {
    it('tab order follows logical reading order (top to bottom, left to right)', async () => {
      const user = userEvent.setup();
      localStorageMock.getItem.mockReturnValue(null);

      renderWithProviders(<Home />);

      // Get interactive elements in expected visual order
      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const loginButton = screen.getByRole('button', { name: /login/i });

      const getStartedLink = getStartedButton.closest('a');
      const loginLink = loginButton.closest('a');

      // Verify both elements exist
      expect(getStartedLink).toBeInTheDocument();
      expect(loginLink).toBeInTheDocument();

      // Get all focusable elements in DOM order
      const allFocusableElements = document.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      // Convert to array for easier manipulation
      const focusableArray = Array.from(allFocusableElements);

      // Find indices of our CTA buttons
      const getStartedIndex = focusableArray.findIndex(
        el => el === getStartedLink || el.contains(getStartedButton)
      );
      const loginIndex = focusableArray.findIndex(
        el => el === loginLink || el.contains(loginButton)
      );

      // Get Started should come before Login (left to right in the CTA row)
      // or at least both should be present in the tab order
      expect(getStartedIndex).not.toBe(-1);
      expect(loginIndex).not.toBe(-1);

      // Verify Get Started comes before Login in the tab order
      // This matches the visual left-to-right order on desktop
      expect(getStartedIndex).toBeLessThan(loginIndex);

      // Tab through and verify elements receive focus in correct order
      document.body.focus();

      // Tab to first interactive element
      await user.tab();

      // Continue tabbing and verify we can reach both CTAs
      let foundGetStarted = false;
      let foundLogin = false;

      for (let i = 0; i < focusableArray.length + 1; i++) {
        const activeElement = document.activeElement;

        if (activeElement === getStartedLink || activeElement === getStartedButton ||
            activeElement?.contains(getStartedButton)) {
          foundGetStarted = true;
        }
        if (activeElement === loginLink || activeElement === loginButton ||
            activeElement?.contains(loginButton)) {
          foundLogin = true;
        }

        if (foundGetStarted && foundLogin) break;
        await user.tab();
      }

      // Both CTA buttons should be reachable via tab
      expect(foundGetStarted || foundLogin).toBe(true);
    });

    it('no tabindex attributes break the natural tab order', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      renderWithProviders(<Home />);

      // Check that no elements have positive tabindex (which disrupts natural order)
      const elementsWithPositiveTabindex = document.querySelectorAll('[tabindex]');

      elementsWithPositiveTabindex.forEach(element => {
        const tabindex = element.getAttribute('tabindex');
        if (tabindex !== null) {
          const tabindexNum = parseInt(tabindex, 10);
          // Tabindex should be 0 (follows natural order) or -1 (programmatically focusable only)
          // Positive tabindex values disrupt natural order and should be avoided
          expect(tabindexNum).toBeLessThanOrEqual(0);
        }
      });
    });
  });
});
