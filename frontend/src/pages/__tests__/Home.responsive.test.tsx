import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>{children}</div>
    ),
    h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={className} {...props}>{children}</h1>
    ),
    h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className} {...props}>{children}</p>
    ),
    button: ({ children, onClick, className, disabled, type, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} className={className} disabled={disabled} type={type} {...props}>
        {children}
      </button>
    ),
    footer: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <footer className={className} {...props}>{children}</footer>
    ),
    article: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <article className={className} {...props}>{children}</article>
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

describe('Home - Responsive Layout - Mobile (320px-768px)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: unauthenticated user with light theme
    mockUseAuth.mockReturnValue({ user: null });
    mockUseTheme.mockReturnValue({ theme: 'light' });
  });

  describe('Test Case 1: Render Home at 320px viewport width - All content visible without horizontal scrolling', () => {
    it('should have responsive container classes that prevent horizontal overflow', () => {
      renderHome();

      // Main container should have proper responsive classes
      const mainContainer = screen.getByRole('heading', { level: 1 }).closest('.relative');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('p-4'); // Padding for mobile
      expect(mainContainer).toHaveClass('overflow-hidden'); // Prevents horizontal scroll
    });

    it('should have max-width constraints on content containers', () => {
      renderHome();

      // Hero section should have max-width for proper containment
      const heroContainer = screen.getByRole('heading', { level: 1 }).closest('.max-w-4xl');
      expect(heroContainer).toBeInTheDocument();
      expect(heroContainer).toHaveClass('mx-auto'); // Centered on all viewports
    });

    it('should use responsive text classes for headline', () => {
      renderHome();

      const headline = screen.getByRole('heading', { level: 1 });
      // Mobile-first responsive classes: text-5xl on mobile, md:text-7xl on medium+
      expect(headline).toHaveClass('text-5xl');
      expect(headline).toHaveClass('md:text-7xl');
    });

    it('should have paragraph with responsive text sizing', () => {
      renderHome();

      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).toHaveClass('text-xl');
      expect(tagline).toHaveClass('md:text-2xl');
    });

    it('should have feature grid container with max-width constraint', () => {
      renderHome();

      const featuresHeading = screen.getByRole('heading', { level: 2, name: /features/i });
      const featuresContainer = featuresHeading.closest('.max-w-6xl');
      expect(featuresContainer).toBeInTheDocument();
      expect(featuresContainer).toHaveClass('w-full');
    });
  });

  describe('Test Case 2: Check hero buttons at mobile size - CTA buttons stacked or appropriately sized', () => {
    it('should have button container with flex-col for mobile stacking', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const buttonContainer = getStartedButton.closest('.flex');

      expect(buttonContainer).toBeInTheDocument();
      // Mobile-first: flex-col on mobile, flex-row on md+
      expect(buttonContainer).toHaveClass('flex-col');
      expect(buttonContainer).toHaveClass('md:flex-row');
    });

    it('should have gap between buttons for proper spacing', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const buttonContainer = getStartedButton.closest('.flex');

      expect(buttonContainer).toHaveClass('gap-4');
    });

    it('should have buttons with large size classes for touch targets', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Large size provides adequate touch target (44px minimum recommended)
      expect(getStartedButton).toHaveClass('px-6');
      expect(getStartedButton).toHaveClass('py-3');
      expect(getStartedButton).toHaveClass('text-lg');

      expect(loginButton).toHaveClass('px-6');
      expect(loginButton).toHaveClass('py-3');
      expect(loginButton).toHaveClass('text-lg');
    });

    it('should render both CTA buttons', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const loginButton = screen.getByRole('button', { name: /login/i });

      expect(getStartedButton).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
    });

    it('should have justified center layout for button container', () => {
      renderHome();

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const buttonContainer = getStartedButton.closest('.flex');

      expect(buttonContainer).toHaveClass('justify-center');
    });
  });

  describe('Test Case 3: Check feature grid at mobile size - Feature cards display in 1 or 2 column layout', () => {
    it('should have feature grid with responsive column classes', () => {
      renderHome();

      // Find the grid container that holds feature cards
      const featureCards = screen.getAllByText(/URL Shortening|Click Analytics|User Dashboard|Global Access|Secure Links|Lightning Fast/i);
      expect(featureCards.length).toBe(6);

      // The grid container should have responsive classes
      const gridContainer = featureCards[0].closest('.grid');
      expect(gridContainer).toBeInTheDocument();
      // Default: single column (implicit), md: 3 columns
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('should have feature cards with proper gap spacing', () => {
      renderHome();

      const featureCards = screen.getAllByText(/URL Shortening|Click Analytics|User Dashboard|Global Access|Secure Links|Lightning Fast/i);
      const gridContainer = featureCards[0].closest('.grid');

      expect(gridContainer).toHaveClass('gap-8');
    });

    it('should render all 6 feature cards', () => {
      renderHome();

      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });

    it('should have feature cards with h-full for equal heights', () => {
      renderHome();

      // Each GlassMorphismCard has h-full class
      const urlShortening = screen.getByText('URL Shortening');
      const card = urlShortening.closest('.h-full');
      expect(card).toBeInTheDocument();
    });

    it('should have feature section with responsive margin top', () => {
      renderHome();

      const featuresHeading = screen.getByRole('heading', { level: 2, name: /features/i });
      const featuresContainer = featuresHeading.closest('.mt-32');
      expect(featuresContainer).toBeInTheDocument();
    });
  });

  describe('Test Case 4: Verify font sizes at mobile viewport - Typography is readable with appropriate responsive sizing', () => {
    it('should have main headline with responsive font sizes', () => {
      renderHome();

      const headline = screen.getByRole('heading', { level: 1 });
      // text-5xl = 3rem (48px) on mobile, md:text-7xl = 4.5rem (72px) on medium+
      expect(headline).toHaveClass('text-5xl');
      expect(headline).toHaveClass('md:text-7xl');
      expect(headline).toHaveClass('font-bold');
    });

    it('should have tagline paragraph with responsive font sizes', () => {
      renderHome();

      const tagline = screen.getByText(/Create short, memorable links/i);
      // text-xl = 1.25rem (20px) on mobile, md:text-2xl = 1.5rem (24px) on medium+
      expect(tagline).toHaveClass('text-xl');
      expect(tagline).toHaveClass('md:text-2xl');
    });

    it('should have features heading with proper size', () => {
      renderHome();

      const featuresHeading = screen.getByRole('heading', { level: 2, name: /features/i });
      expect(featuresHeading).toHaveClass('text-3xl');
      expect(featuresHeading).toHaveClass('font-bold');
    });

    it('should have feature card titles with proper heading size', () => {
      renderHome();

      const urlShortening = screen.getByText('URL Shortening');
      const cardTitle = urlShortening.closest('h3');
      expect(cardTitle).toBeInTheDocument();
      expect(cardTitle).toHaveClass('text-xl');
      expect(cardTitle).toHaveClass('font-bold');
    });

    it('should have appropriate line height for readability', () => {
      renderHome();

      const headline = screen.getByRole('heading', { level: 1 });
      // leading-tight provides appropriate line-height for large text
      expect(headline).toHaveClass('leading-tight');
    });

    it('should have tagline with max-width constraint for readability', () => {
      renderHome();

      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).toHaveClass('max-w-2xl');
      expect(tagline).toHaveClass('mx-auto');
    });

    it('should have proper margin between headline and tagline', () => {
      renderHome();

      const headline = screen.getByRole('heading', { level: 1 });
      expect(headline).toHaveClass('mb-8');
    });

    it('should have proper margin between tagline and buttons', () => {
      renderHome();

      const tagline = screen.getByText(/Create short, memorable links/i);
      expect(tagline).toHaveClass('mb-12');
    });
  });

  describe('Additional Mobile Responsive Tests', () => {
    it('should center text content for all viewport sizes', () => {
      renderHome();

      const heroContainer = screen.getByRole('heading', { level: 1 }).closest('.text-center');
      expect(heroContainer).toBeInTheDocument();
    });

    it('should have footer with proper text size', () => {
      renderHome();

      const footer = screen.getByText(/ShortURL. All rights reserved/i).closest('footer');
      expect(footer).toHaveClass('text-sm');
      expect(footer).toHaveClass('text-center');
    });

    it('should have footer with appropriate top margin', () => {
      renderHome();

      const footer = screen.getByText(/ShortURL. All rights reserved/i).closest('footer');
      expect(footer).toHaveClass('mt-24');
    });

    it('should use z-index layering for proper content stacking', () => {
      renderHome();

      const heroContainer = screen.getByRole('heading', { level: 1 }).closest('.z-10');
      expect(heroContainer).toBeInTheDocument();
    });

    it('should have min-height for full viewport coverage', () => {
      renderHome();

      const mainContainer = screen.getByRole('heading', { level: 1 }).closest('.min-h-screen');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should use flexbox for vertical centering', () => {
      renderHome();

      const mainContainer = screen.getByRole('heading', { level: 1 }).closest('.flex');
      expect(mainContainer).toHaveClass('flex-col');
      expect(mainContainer).toHaveClass('justify-center');
      expect(mainContainer).toHaveClass('items-center');
    });
  });
});
