import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { InteractiveDemo, isValidUrl, generateDemoShortCode } from './InteractiveDemo';

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

const renderWithProviders = (component: React.ReactNode) => {
  return render(<TestWrapper>{component}</TestWrapper>);
};

describe('InteractiveDemo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test Case 5: Demo component renders', () => {
    it('should render input field, shorten button, and result area are present and accessible', () => {
      renderWithProviders(<InteractiveDemo />);

      // Check for input field
      const inputField = screen.getByLabelText(/enter your long url/i);
      expect(inputField).toBeInTheDocument();
      expect(inputField).toHaveAttribute('type', 'text');
      expect(inputField).toHaveAttribute('id', 'demo-url-input');

      // Check for shorten button
      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      expect(shortenButton).toBeInTheDocument();
      expect(shortenButton).toHaveAttribute('type', 'submit');

      // Check for section label for accessibility
      const section = screen.getByRole('region', { name: /interactive url shortening demo/i });
      expect(section).toBeInTheDocument();
    });

    it('should have accessible elements with proper ARIA attributes', () => {
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      expect(inputField).toHaveAttribute('aria-invalid', 'false');
    });

    it('should display instructional text', () => {
      renderWithProviders(<InteractiveDemo />);

      expect(screen.getByText(/try it now/i)).toBeInTheDocument();
      expect(screen.getByText(/see how easy it is to shorten urls/i)).toBeInTheDocument();
    });
  });

  describe('Test Case 3: Submit empty input field', () => {
    it('should show validation error when submitting empty input', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(/please enter a url to shorten/i);
      });
    });

    it('should set aria-invalid to true when error is displayed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        expect(inputField).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should show error for whitespace-only input', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, '   ');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toHaveTextContent(/please enter a url to shorten/i);
      });
    });
  });

  describe('Test Case 2: Enter invalid URL format', () => {
    it('should display user-friendly error message for invalid URL "not-a-url"', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'not-a-url');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(/please enter a valid url/i);
      });
    });

    it('should display error for URL without protocol', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'example.com');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toHaveTextContent(/please enter a valid url/i);
      });
    });

    it('should display error for invalid protocol', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'ftp://example.com');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toHaveTextContent(/please enter a valid url/i);
      });
    });

    it('should clear error when user starts typing', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'not-a-url');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Start typing new input - error should clear
      await user.clear(inputField);
      await user.type(inputField, 'https://example.com');

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Test Case 4: Click shorten button with valid URL - Loading state', () => {
    it('should display loading state on button during processing', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'https://example.com/valid-url');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/shortening.../i)).toBeInTheDocument();
      });

      // Button should be disabled during loading
      const loadingButton = screen.getByRole('button');
      expect(loadingButton).toBeDisabled();
    });

    it('should disable input during loading', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'https://example.com/valid-url');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        expect(inputField).toBeDisabled();
      });
    });
  });

  describe('Test Case 1: Integration test - Full shortening flow', () => {
    it('should display shortened URL preview with registration encouragement message', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      const testUrl = 'https://example.com/very-long-url-path/with/multiple/segments';
      await user.type(inputField, testUrl);

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      // Wait for result to appear
      await waitFor(() => {
        const resultArea = screen.getByTestId('demo-result');
        expect(resultArea).toBeInTheDocument();
      }, { timeout: 2000 });

      // Should display original URL
      expect(screen.getByText(testUrl)).toBeInTheDocument();

      // Should display shortened URL preview
      expect(screen.getByText(/shortened url preview/i)).toBeInTheDocument();

      // Should display registration encouragement message
      expect(screen.getByText(/this is a demo preview/i)).toBeInTheDocument();
      expect(screen.getByText(/register for free/i)).toBeInTheDocument();

      // Should have link to registration page
      const registerLink = screen.getByRole('link', { name: /register for free/i });
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('should display shortened URL with proper format', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'https://example.com/very-long-url-path/with/multiple/segments');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        const resultArea = screen.getByTestId('demo-result');
        expect(resultArea).toBeInTheDocument();
      }, { timeout: 2000 });

      // Check that shortened URL contains /r/ path
      const shortenedUrlElement = screen.getByText(/\/r\//);
      expect(shortenedUrlElement).toBeInTheDocument();
    });

    it('should allow copying the shortened URL', async () => {
      const user = userEvent.setup();
      const writeTextMock = vi.fn().mockResolvedValue(undefined);

      // Mock clipboard using Object.defineProperty
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });

      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'https://example.com/test');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        expect(screen.getByTestId('demo-result')).toBeInTheDocument();
      }, { timeout: 2000 });

      const copyButton = screen.getByRole('button', { name: /copy shortened url/i });
      await user.click(copyButton);

      expect(writeTextMock).toHaveBeenCalled();
    });

    it('should allow trying another URL after completion', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InteractiveDemo />);

      const inputField = screen.getByLabelText(/enter your long url/i);
      await user.type(inputField, 'https://example.com/test');

      const shortenButton = screen.getByRole('button', { name: /shorten url/i });
      await user.click(shortenButton);

      await waitFor(() => {
        expect(screen.getByTestId('demo-result')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Click "Try another URL"
      const tryAnotherButton = screen.getByRole('button', { name: /try another url/i });
      await user.click(tryAnotherButton);

      // Result should be cleared
      expect(screen.queryByTestId('demo-result')).not.toBeInTheDocument();

      // Input should be empty
      const clearedInput = screen.getByLabelText(/enter your long url/i);
      expect(clearedInput).toHaveValue('');
    });
  });
});

describe('URL Validation Utility', () => {
  describe('isValidUrl function', () => {
    it('should return true for valid http URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
      expect(isValidUrl('http://example.com/path?query=value')).toBe(true);
    });

    it('should return true for valid https URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com/very-long-url-path/with/multiple/segments')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('   ')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidUrl(null as unknown as string)).toBe(false);
      expect(isValidUrl(undefined as unknown as string)).toBe(false);
    });
  });
});

describe('Short Code Generation Utility', () => {
  describe('generateDemoShortCode function', () => {
    it('should generate a 6-character code', () => {
      const code = generateDemoShortCode();
      expect(code).toHaveLength(6);
    });

    it('should only contain alphanumeric characters', () => {
      const code = generateDemoShortCode();
      expect(code).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should generate different codes on multiple calls', () => {
      const codes = new Set();
      for (let i = 0; i < 10; i++) {
        codes.add(generateDemoShortCode());
      }
      // With 6 alphanumeric chars, collisions should be very rare
      expect(codes.size).toBeGreaterThan(1);
    });
  });
});
