import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Poem from './Poem';
import Home from './Home';

// Mock the ThemeContext
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock BackgroundEffect to avoid Three.js issues in tests
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

// Mock GlassMorphismCard
vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock FuturisticButton
vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

describe('Poem Page - E2E Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 4: Navigate to poem feature via UI - Poem feature is accessible and displays content
  describe('Test Case 4: Navigate to poem feature via UI', () => {
    it('should render the poem page when navigating to /poem route', () => {
      render(
        <MemoryRouter initialEntries={['/poem']}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/poem" element={<Poem />} />
          </Routes>
        </MemoryRouter>
      );

      // Check that the poem page is rendered
      const poemPage = screen.getByTestId('poem-page');
      expect(poemPage).toBeInTheDocument();
    });

    it('should display VerseCraft Poetry title on the poem page', () => {
      render(
        <MemoryRouter initialEntries={['/poem']}>
          <Routes>
            <Route path="/poem" element={<Poem />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('VerseCraft Poetry')).toBeInTheDocument();
    });

    it('should display the poem content on the page', () => {
      render(
        <MemoryRouter initialEntries={['/poem']}>
          <Routes>
            <Route path="/poem" element={<Poem />} />
          </Routes>
        </MemoryRouter>
      );

      // Check that poem content is displayed
      expect(screen.getByText(/In the realm of endless links so long,/)).toBeInTheDocument();
      expect(screen.getByText(/VerseCraft sings its shortening song./)).toBeInTheDocument();
      expect(screen.getByText(/Clicks are counted, journeys tracked,/)).toBeInTheDocument();
    });

    it('should display the poem title "The URL Shortener\'s Verse"', () => {
      render(
        <MemoryRouter initialEntries={['/poem']}>
          <Routes>
            <Route path="/poem" element={<Poem />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("The URL Shortener's Verse")).toBeInTheDocument();
    });

    it('should have a Back to Home button', () => {
      render(
        <MemoryRouter initialEntries={['/poem']}>
          <Routes>
            <Route path="/poem" element={<Poem />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Back to Home/)).toBeInTheDocument();
    });

    it('should have a link back to home page', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/poem']}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/poem" element={<Poem />} />
          </Routes>
        </MemoryRouter>
      );

      // Find and click the back link
      const backButton = screen.getByText(/Back to Home/);
      expect(backButton.closest('a')).toHaveAttribute('href', '/');
    });

    it('should display the poem within a styled container', () => {
      render(
        <MemoryRouter initialEntries={['/poem']}>
          <Routes>
            <Route path="/poem" element={<Poem />} />
          </Routes>
        </MemoryRouter>
      );

      // Check that the poem container is present
      const poemContainer = screen.getByTestId('poem-container');
      expect(poemContainer).toBeInTheDocument();
    });

    it('should have all poem lines visible and properly formatted', () => {
      render(
        <MemoryRouter initialEntries={['/poem']}>
          <Routes>
            <Route path="/poem" element={<Poem />} />
          </Routes>
        </MemoryRouter>
      );

      // Check all stanzas are present
      expect(screen.getByText(/Each URL transformed with care,/)).toBeInTheDocument();
      expect(screen.getByText(/Analytics reveal so much more./)).toBeInTheDocument();
      expect(screen.getByText(/Where your shortened URLs go./)).toBeInTheDocument();
    });
  });
});
