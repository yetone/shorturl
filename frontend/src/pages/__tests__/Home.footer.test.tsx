import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock the BackgroundEffect component since it uses Three.js
vi.mock('../../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect">Background Effect Mock</div>,
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

describe('Home - Footer Display Scenario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: unauthenticated user with light theme
    mockUseAuth.mockReturnValue({ user: null });
    mockUseTheme.mockReturnValue({ theme: 'light' });
  });

  describe('Test Case 1: Footer element exists in the rendered output', () => {
    it('should render a footer element in the Home component', () => {
      renderHome();

      // Query for the footer element directly
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should render footer as a semantic footer element', () => {
      renderHome();

      // The footer should be a semantic <footer> element (role="contentinfo")
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName.toLowerCase()).toBe('footer');
    });

    it('should have the footer visible in the document', () => {
      renderHome();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeVisible();
    });

    it('should render footer with appropriate z-index for visibility', () => {
      renderHome();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('z-10');
    });
  });

  describe('Test Case 2: Footer contains copyright text with current year', () => {
    it('should display copyright symbol in the footer', () => {
      renderHome();

      const copyrightText = screen.getByText(/©/);
      expect(copyrightText).toBeInTheDocument();
    });

    it('should display the current year in the copyright text', () => {
      renderHome();

      const currentYear = new Date().getFullYear().toString();
      const yearText = screen.getByText(new RegExp(currentYear));
      expect(yearText).toBeInTheDocument();
    });

    it('should display the company name "ShortURL" in the footer', () => {
      renderHome();

      const companyName = screen.getByText(/ShortURL/i);
      expect(companyName).toBeInTheDocument();
    });

    it('should display "All rights reserved" in the footer', () => {
      renderHome();

      const rightsReserved = screen.getByText(/All rights reserved/i);
      expect(rightsReserved).toBeInTheDocument();
    });

    it('should display complete copyright text with current year, company name, and rights reserved', () => {
      renderHome();

      const currentYear = new Date().getFullYear();
      const expectedPattern = new RegExp(`©\\s*${currentYear}\\s*ShortURL\\.\\s*All rights reserved`, 'i');

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveTextContent(expectedPattern);
    });
  });

  describe('Footer styling based on theme', () => {
    it('should have reduced opacity in light mode', () => {
      mockUseTheme.mockReturnValue({ theme: 'light' });
      renderHome();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('opacity-75');
    });

    it('should have reduced opacity in dark mode', () => {
      mockUseTheme.mockReturnValue({ theme: 'dark' });
      renderHome();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('opacity-50');
    });

    it('should have centered text alignment', () => {
      renderHome();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('text-center');
    });

    it('should have small text size', () => {
      renderHome();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('text-sm');
    });
  });
});
