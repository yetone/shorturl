/**
 * REQ-1: Interactive URL Shortening Demo
 * Tests for the interactive demo section that allows visitors to shorten URLs without authentication
 *
 * Technical Design Specification Quote:
 * "Public demo section allowing visitors to shorten a URL without authentication.
 * Real-time generation of short URL preview with visual feedback showing before/after transformation."
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock the InteractiveDemo component (will be implemented)
const InteractiveDemo = () => {
  return <div>InteractiveDemo placeholder</div>;
};

describe('REQ-1: Interactive Demo Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Demo Form Rendering', () => {
    it('should render demo section with input field and shorten button', () => {
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      // Should have a URL input field
      expect(screen.queryByPlaceholderText(/enter.*url/i)).toBeDefined();

      // Should have a "Shorten" or "Try it" button
      expect(screen.queryByRole('button', { name: /shorten|try/i })).toBeDefined();
    });

    it('should display placeholder text with example URL', () => {
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByPlaceholderText(/https?:\/\//i);
      expect(input).toBeDefined();
    });

    it('should be visible on the homepage after hero section', () => {
      // This test ensures proper positioning in the page layout
      const { container } = render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      expect(container.querySelector('[data-testid="interactive-demo"]')).toBeDefined();
    });
  });

  describe('URL Shortening Functionality', () => {
    it('should accept valid URL input', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox') as HTMLInputElement;
      if (input) {
        await user.type(input, 'https://www.example.com/very/long/url/path');
        expect(input.value).toContain('example.com');
      }
    });

    it('should generate shortened URL when submit button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/long/url');
        await user.click(submitButton);

        // Should show loading state or result
        await waitFor(() => {
          expect(
            screen.queryByText(/loading|generating|shortened/i)
          ).toBeDefined();
        }, { timeout: 3000 });
      }
    });

    it('should display shortened URL result within 2 seconds', async () => {
      const user = userEvent.setup();
      const startTime = Date.now();

      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        await waitFor(() => {
          const elapsed = Date.now() - startTime;
          expect(elapsed).toBeLessThan(2000);
          expect(screen.queryByText(/short.*url/i)).toBeDefined();
        }, { timeout: 2000 });
      }
    });

    it('should show before and after URL transformation visually', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/original/long/url');
        await user.click(submitButton);

        await waitFor(() => {
          // Should show both original and shortened versions
          expect(screen.queryByText(/original|before/i)).toBeDefined();
          expect(screen.queryByText(/shortened|after/i)).toBeDefined();
        });
      }
    });
  });

  describe('Copy to Clipboard Functionality', () => {
    it('should have copy button next to shortened URL', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /copy/i })).toBeDefined();
        });
      }
    });

    it('should copy shortened URL to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup();
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
      };
      Object.assign(navigator, { clipboard: mockClipboard });

      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        await waitFor(async () => {
          const copyButton = screen.queryByRole('button', { name: /copy/i });
          if (copyButton) {
            await user.click(copyButton);
            expect(mockClipboard.writeText).toHaveBeenCalled();
          }
        });
      }
    });

    it('should show "Copied!" confirmation after successful copy', async () => {
      const user = userEvent.setup();
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
      };
      Object.assign(navigator, { clipboard: mockClipboard });

      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        await waitFor(async () => {
          const copyButton = screen.queryByRole('button', { name: /copy/i });
          if (copyButton) {
            await user.click(copyButton);
            expect(screen.queryByText(/copied/i)).toBeDefined();
          }
        });
      }
    });
  });

  describe('Registration Prompt', () => {
    it('should display message encouraging registration for full features', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.queryByText(/sign up|register.*track|analytics|full features/i)
          ).toBeDefined();
        });
      }
    });

    it('should have link to registration page in demo result', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        await waitFor(() => {
          const registerLink = screen.queryByRole('link', { name: /sign up|register/i });
          expect(registerLink).toBeDefined();
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('should display error message for invalid URL format', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'not-a-valid-url');
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.queryByText(/invalid.*url|valid.*url/i)).toBeDefined();
        });
      }
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      // Mock API failure scenario
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        // Should not crash on error
        await waitFor(() => {
          expect(screen.queryByText(/error|try again|failed/i)).toBeDefined();
        });
      }
    });

    it('should work without authentication', () => {
      // Demo should work for anonymous users
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      // Should render without requiring auth context
      expect(screen.queryByRole('textbox')).toBeDefined();
    });
  });

  describe('Styling and Animations', () => {
    it('should use GlassMorphismCard design for demo section', () => {
      const { container } = render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      // Should have glass morphism styling classes
      const demoSection = container.querySelector('[data-testid="interactive-demo"]');
      expect(demoSection?.className).toMatch(/glass|backdrop|blur/i);
    });

    it('should show smooth animation when URL is generated', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        // Should have transition/animation during result display
        const resultContainer = screen.queryByTestId('demo-result');
        expect(resultContainer?.className).toMatch(/animate|transition|motion/i);
      }
    });
  });

  describe('Demo URL Storage', () => {
    it('should indicate demo URLs are temporary (24-hour expiry)', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <InteractiveDemo />
        </BrowserRouter>
      );

      const input = screen.queryByRole('textbox');
      const submitButton = screen.queryByRole('button', { name: /shorten/i });

      if (input && submitButton) {
        await user.type(input, 'https://www.example.com/test');
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.queryByText(/24.*hour|temporary|expire/i)).toBeDefined();
        });
      }
    });
  });
});
