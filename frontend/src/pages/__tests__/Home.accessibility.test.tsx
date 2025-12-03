import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props}>{children}</h3>
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
    header: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <header {...props}>{children}</header>
    ),
    main: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <main {...props}>{children}</main>
    ),
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <section {...props}>{children}</section>
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

describe('Home - Screen Reader Compatibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: unauthenticated user with light theme
    mockUseAuth.mockReturnValue({ user: null });
    mockUseTheme.mockReturnValue({ theme: 'light' });
  });

  describe('Test Case 1: Check for main landmark element', () => {
    it('should have a main landmark element', () => {
      renderHome();

      // Check for main landmark role
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('should have the main content within the main landmark', () => {
      renderHome();

      const mainElement = screen.getByRole('main');
      // Main content including the headline should be within main
      expect(within(mainElement).getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should use semantic main element tag', () => {
      renderHome();

      const mainElement = screen.getByRole('main');
      expect(mainElement.tagName.toLowerCase()).toBe('main');
    });
  });

  describe('Test Case 2: Verify heading hierarchy', () => {
    it('should have exactly one h1 element', () => {
      renderHome();

      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
    });

    it('should have h1 as the primary headline', () => {
      renderHome();

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Simplify Your Links');
    });

    it('should have h2 for section headings following h1', () => {
      renderHome();

      // Features section should have h2
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(1);
      expect(h2Elements[0]).toHaveTextContent('Features');
    });

    it('should have h3 for feature card titles following h2', () => {
      renderHome();

      // Feature cards should have h3 headings
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThanOrEqual(1);

      // Check that feature card titles are h3
      const featureTitles = ['URL Shortening', 'Click Analytics', 'User Dashboard'];
      featureTitles.forEach(title => {
        const heading = screen.getByRole('heading', { name: title });
        expect(heading.tagName.toLowerCase()).toBe('h3');
      });
    });

    it('should follow logical h1 > h2 > h3 hierarchy', () => {
      renderHome();

      // Get all headings in document order
      const allHeadings = screen.getAllByRole('heading');

      // First heading should be h1
      expect(allHeadings[0].tagName.toLowerCase()).toBe('h1');

      // Second heading should be h2 (Features)
      expect(allHeadings[1].tagName.toLowerCase()).toBe('h2');

      // Remaining headings (feature cards) should be h3
      for (let i = 2; i < allHeadings.length; i++) {
        expect(allHeadings[i].tagName.toLowerCase()).toBe('h3');
      }
    });
  });

  describe('Test Case 3: Check Get Started button accessible name', () => {
    it('should have Get Started button with accessible name', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      expect(getStartedButton).toBeInTheDocument();
    });

    it('should have Get Started button accessible by its text content', () => {
      renderHome();

      // Button should be findable by screen readers via its name
      const button = screen.getByRole('button', { name: 'Get Started' });
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
    });

    it('should have Login button with accessible name', () => {
      renderHome();

      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('should have all buttons accessible via their labels', () => {
      renderHome();

      const buttons = screen.getAllByRole('button');

      // All buttons should have accessible names (non-empty)
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });

  describe('Test Case 4: Check feature card accessibility', () => {
    it('should have accessible feature card titles', () => {
      renderHome();

      const featureTitles = [
        'URL Shortening',
        'Click Analytics',
        'User Dashboard',
        'Global Access',
        'Secure Links',
        'Lightning Fast'
      ];

      featureTitles.forEach(title => {
        const heading = screen.getByRole('heading', { name: title });
        expect(heading).toBeInTheDocument();
      });
    });

    it('should have feature cards with aria-labelledby for their sections', () => {
      renderHome();

      // Feature cards should have articles with aria-labelledby
      const articles = screen.getAllByRole('article');
      expect(articles.length).toBe(6); // 6 feature cards

      // Each article should have an aria-labelledby referencing its title
      articles.forEach(article => {
        expect(article).toHaveAttribute('aria-labelledby');
        const labelId = article.getAttribute('aria-labelledby');
        expect(labelId).toBeTruthy();
        // The referenced element should exist
        const labelElement = document.getElementById(labelId!);
        expect(labelElement).toBeInTheDocument();
      });
    });

    it('should have decorative icon containers hidden from screen readers', () => {
      renderHome();

      // Icon containers should be aria-hidden since text provides context
      const articles = screen.getAllByRole('article');
      articles.forEach(article => {
        // The icon wrapper div should have aria-hidden
        const iconContainer = article.querySelector('[aria-hidden="true"]');
        expect(iconContainer).toBeInTheDocument();
      });
    });

    it('should have feature descriptions accessible within the cards', () => {
      renderHome();

      const descriptions = [
        'Transform long, unwieldy links into short, memorable URLs that are easy to share.',
        'Track and analyze click data including referrers, user agents, and clicks over time.',
        'Manage all your shortened URLs from a single, intuitive dashboard interface.'
      ];

      descriptions.forEach(desc => {
        expect(screen.getByText(desc)).toBeInTheDocument();
      });
    });
  });

  describe('Additional accessibility tests', () => {
    it('should have footer landmark', () => {
      renderHome();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have header landmark for hero section', () => {
      renderHome();

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have links accessible for navigation', () => {
      renderHome();

      // CTA buttons should be wrapped in accessible links
      const links = screen.getAllByRole('link');

      // Should have at least the Get Started and Login links
      const getStartedLink = links.find(link =>
        link.textContent?.toLowerCase().includes('get started')
      );
      const loginLink = links.find(link =>
        link.textContent?.toLowerCase().includes('login')
      );

      expect(getStartedLink).toBeInTheDocument();
      expect(loginLink).toBeInTheDocument();
    });

    it('should have focus visible indicators on interactive elements', () => {
      renderHome();

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Check that buttons have focus ring classes for keyboard navigation
        expect(button.className).toMatch(/focus:/);
      });
    });
  });
});
