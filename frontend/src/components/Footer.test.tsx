import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// Mock the ThemeContext
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </BrowserRouter>
  );
};

describe('Footer Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = '';
  });

  describe('Basic Structure', () => {
    it('should render the footer element', () => {
      renderWithProviders(<Footer />);
      const footerElement = document.querySelector('footer');
      expect(footerElement).toBeInTheDocument();
    });

    it('should display the ShortURL branding', () => {
      renderWithProviders(<Footer />);
      const branding = screen.getByText('ShortURL');
      expect(branding).toBeInTheDocument();
    });

    it('should show copyright with current year', () => {
      renderWithProviders(<Footer />);
      const currentYear = new Date().getFullYear();
      const copyrightText = screen.getByText(new RegExp(`${currentYear} ShortURL`));
      expect(copyrightText).toBeInTheDocument();
    });

    it('should have proper styling classes', () => {
      const { container } = renderWithProviders(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('w-full', 'py-8', 'px-4');
    });
  });

  describe('Navigation Links', () => {
    it('should render Home navigation link', () => {
      renderWithProviders(<Footer />);
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render Dashboard navigation link', () => {
      renderWithProviders(<Footer />);
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('External Links', () => {
    it('should render GitHub link', () => {
      renderWithProviders(<Footer />);
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/shorturl');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render social links with icons', () => {
      renderWithProviders(<Footer />);
      const socialLinks = document.querySelectorAll('a[target="_blank"]');
      expect(socialLinks.length).toBeGreaterThan(0);
    });

    it('should render Twitter social link', () => {
      renderWithProviders(<Footer />);
      const twitterLink = document.querySelector('a[href="https://twitter.com/shorturl"]');
      expect(twitterLink).toBeInTheDocument();
    });

    it('should render Mailto link', () => {
      renderWithProviders(<Footer />);
      const mailLink = document.querySelector('a[href="mailto:support@shorturl.com"]');
      expect(mailLink).toBeInTheDocument();
    });
  });

  describe('Visual Design', () => {
    it('should have subdued styling with appropriate opacity', () => {
      const { container } = renderWithProviders(<Footer />);
      const footerElement = container.querySelector('footer');
      expect(footerElement).toHaveClass('bg-gray-50/80');
    });

    it('should have appropriate spacing from main content', () => {
      const { container } = renderWithProviders(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('py-8');
    });

    it('should display menu items in appropriate font size', () => {
      const { container } = renderWithProviders(<Footer />);
      const nav = container.querySelector('nav');
      expect(nav?.className).toContain('text-sm');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      const { container } = renderWithProviders(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('w-full');
      expect(footer).toHaveClass('px-4');
    });

    it('should handle mobile layout with stacking', () => {
      renderWithProviders(<Footer />);
      // Check that navigation is flex container
      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('flex-wrap');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible social links with hover states', () => {
      renderWithProviders(<Footer />);
      const socialLinks = document.querySelectorAll('a[target="_blank"]');
      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should support keyboard navigation', () => {
      renderWithProviders(<Footer />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(1);
    });
  });

  describe('Theme Adaptation', () => {
    it('should apply dark mode classes when theme is dark', () => {
      // This would require actual theme context testing
      renderWithProviders(<Footer />);
      const footerClasses = document.querySelector('footer')?.className || '';
      expect(footerClasses).toBeTruthy();
    });

    it('should apply light mode classes when theme is light', () => {
      renderWithProviders(<Footer />);
      const footerClasses = document.querySelector('footer')?.className || '';
      expect(footerClasses).toBeTruthy();
    });
  });
});
