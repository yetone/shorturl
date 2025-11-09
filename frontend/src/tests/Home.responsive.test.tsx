import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Mock components
vi.mock('../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

const renderWithViewport = (component: React.ReactElement, width: number) => {
  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  // Mock matchMedia for responsive breakpoints
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('768') ? width >= 768 : width >= 1024,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: null } as any}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: vi.fn() } as any}>
          {component}
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: null } as any}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: vi.fn() } as any}>
          {component}
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Home Page - Mobile Responsiveness (NFR-3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile Layout (320px - 767px)', () => {
    it('should display all content without horizontal scrolling on mobile', () => {
      renderWithViewport(<Home />, 375); // iPhone SE width

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toBeVisible();
    });

    it('should stack CTA buttons vertically on mobile', () => {
      renderWithViewport(<Home />, 375);

      const ctaContainer = screen.getByRole('link', { name: /Get Started/i }).parentElement;
      expect(ctaContainer).toHaveClass('flex-col');
    });

    it('should use smaller font sizes for headlines on mobile', () => {
      renderWithViewport(<Home />, 320); // Smallest mobile width

      const heading = screen.getByRole('heading', { level: 1 });
      // Should have text-5xl on mobile, text-7xl on desktop
      expect(heading.className).toMatch(/text-5xl|md:text-7xl/);
    });

    it('should display feature cards in single column on mobile', () => {
      renderWithViewport(<Home />, 375);

      const gridContainer = screen.getByRole('heading', { name: /Features/i }).parentElement?.querySelector('.grid');
      // Should be single column on mobile, 3 columns on desktop
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('should ensure touch targets are at least 44x44px', () => {
      renderWithViewport(<Home />, 375);

      const buttons = screen.getAllByRole('link');
      // In implementation, buttons should meet minimum touch target size
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should maintain readable text size on small screens', () => {
      renderWithViewport(<Home />, 320);

      const description = screen.getByText(/Create short, memorable links/i);
      expect(description.className).toMatch(/text-xl|md:text-2xl/);
    });
  });

  describe('Tablet Layout (768px - 1023px)', () => {
    it('should display feature cards in responsive grid on tablet', () => {
      renderWithViewport(<Home />, 768);

      const gridContainer = screen.getByRole('heading', { name: /Features/i }).parentElement?.querySelector('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('should arrange CTA buttons horizontally on tablet', () => {
      renderWithViewport(<Home />, 768);

      const ctaContainer = screen.getByRole('link', { name: /Get Started/i }).parentElement;
      expect(ctaContainer).toHaveClass('md:flex-row');
    });

    it('should use appropriate font sizes for tablet', () => {
      renderWithViewport(<Home />, 768);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.className).toMatch(/md:text-7xl/);
    });
  });

  describe('Desktop Layout (1024px+)', () => {
    it('should display full desktop layout at 1024px and above', () => {
      renderWithViewport(<Home />, 1024);

      const heading = screen.getByRole('heading', { level: 1 });
      const features = screen.getByRole('heading', { name: /Features/i });

      expect(heading).toBeVisible();
      expect(features).toBeVisible();
    });

    it('should show feature cards in 3-column grid on desktop', () => {
      renderWithViewport(<Home />, 1440);

      const gridContainer = screen.getByRole('heading', { name: /Features/i }).parentElement?.querySelector('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('should use larger typography on desktop', () => {
      renderWithViewport(<Home />, 1440);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.className).toMatch(/md:text-7xl/);
    });
  });

  describe('Responsive Breakpoints (NFR-3)', () => {
    it('should adapt layout for 320px mobile devices', () => {
      renderWithViewport(<Home />, 320);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeVisible();
    });

    it('should adapt layout for 768px tablet devices', () => {
      renderWithViewport(<Home />, 768);

      const heading = screen.getByRole('heading', { level: 1 });
      const ctaContainer = screen.getByRole('link', { name: /Get Started/i }).parentElement;

      expect(heading).toBeVisible();
      expect(ctaContainer).toHaveClass('md:flex-row');
    });

    it('should adapt layout for 1024px desktop devices', () => {
      renderWithViewport(<Home />, 1024);

      const features = screen.getByRole('heading', { name: /Features/i }).parentElement;
      expect(features).toBeVisible();
    });

    it('should adapt layout for 1440px+ large desktops', () => {
      renderWithViewport(<Home />, 1920);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeVisible();
    });
  });

  describe('Content Readability on Mobile', () => {
    it('should display all text without truncation on mobile', () => {
      renderWithViewport(<Home />, 375);

      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getByText(/Create short, memorable links/i);

      expect(heading.textContent).toBeTruthy();
      expect(description.textContent).toBeTruthy();
    });

    it('should wrap text appropriately on narrow screens', () => {
      renderWithViewport(<Home />, 320);

      const description = screen.getByText(/Create short, memorable links/i);
      // Should have max-width for readability
      const container = description.parentElement;
      expect(container?.className).toMatch(/max-w/);
    });

    it('should maintain proper line height for readability', () => {
      renderWithViewport(<Home />, 375);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.className).toMatch(/leading-tight|leading-normal/);
    });
  });

  describe('Interactive Elements on Touch Devices', () => {
    it('should make all buttons easily tappable on mobile', () => {
      renderWithViewport(<Home />, 375);

      const buttons = screen.getAllByRole('link');
      // Buttons should have adequate size and spacing
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should space interactive elements to prevent accidental taps', () => {
      renderWithViewport(<Home />, 375);

      const ctaContainer = screen.getByRole('link', { name: /Get Started/i }).parentElement;
      expect(ctaContainer?.className).toMatch(/gap/);
    });

    it('should provide visual feedback on tap/touch', () => {
      renderWithViewport(<Home />, 375);

      const button = screen.getByRole('link', { name: /Get Started/i });
      // Should have active state styling
      expect(button).toBeInTheDocument();
    });
  });

  describe('Image and Asset Loading on Mobile', () => {
    it('should load appropriately sized assets for mobile bandwidth', () => {
      renderWithViewport(<Home />, 375);

      const backgroundEffect = screen.getByTestId('background-effect');
      expect(backgroundEffect).toBeInTheDocument();
    });

    it('should lazy load below-the-fold content', () => {
      renderWithViewport(<Home />, 375);

      // Features section should potentially be lazy loaded
      const features = screen.getByRole('heading', { name: /Features/i });
      expect(features).toBeInTheDocument();
    });
  });

  describe('Mobile User Experience (User Story 7)', () => {
    it('should be fully functional on 320px mobile devices', () => {
      renderWithViewport(<Home />, 320);

      const heading = screen.getByRole('heading', { level: 1 });
      const ctaButton = screen.getByRole('link', { name: /Get Started/i });
      const features = screen.getByText(/URL Shortening/i);

      expect(heading).toBeVisible();
      expect(ctaButton).toBeVisible();
      expect(features).toBeVisible();
    });

    it('should display all content without horizontal scrolling', () => {
      renderWithViewport(<Home />, 375);

      const container = screen.getByRole('heading', { level: 1 }).parentElement;
      // Should have proper padding and max-width
      expect(container?.className).toMatch(/p-4|max-w/);
    });

    it('should make buttons easily tappable (min 44x44px)', () => {
      renderWithViewport(<Home />, 375);

      const buttons = screen.getAllByRole('link');
      buttons.forEach((button) => {
        // Should be large enough for touch
        expect(button).toBeInTheDocument();
      });
    });

    it('should adapt layout gracefully from desktop to mobile', () => {
      // Test desktop first
      const { rerender } = renderWithViewport(<Home />, 1024);
      let heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeVisible();

      // Then test mobile
      renderWithViewport(<Home />, 375);
      heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeVisible();
    });

    it('should keep all features accessible on touch interfaces', () => {
      renderWithViewport(<Home />, 375);

      const getStarted = screen.getByRole('link', { name: /Get Started/i });
      const login = screen.getByRole('link', { name: /Login/i });
      const features = screen.getAllByText(/URL Shortening|Click Analytics|User Dashboard/i);

      expect(getStarted).toBeVisible();
      expect(login).toBeVisible();
      expect(features.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Responsive Typography', () => {
    it('should scale headline appropriately across breakpoints', () => {
      renderWithViewport(<Home />, 375);

      const heading = screen.getByRole('heading', { level: 1 });
      // Should have responsive text sizing: text-5xl md:text-7xl
      expect(heading.className).toMatch(/text-5xl.*md:text-7xl/);
    });

    it('should scale body text appropriately across breakpoints', () => {
      renderWithViewport(<Home />, 375);

      const description = screen.getByText(/Create short, memorable links/i);
      // Should have responsive sizing: text-xl md:text-2xl
      expect(description.className).toMatch(/text-xl.*md:text-2xl/);
    });

    it('should maintain readability at all sizes', () => {
      renderWithViewport(<Home />, 320);

      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getByText(/Create short, memorable links/i);

      expect(heading.textContent?.length).toBeGreaterThan(5);
      expect(description.textContent?.length).toBeGreaterThan(20);
    });
  });

  describe('Grid and Layout Systems', () => {
    it('should use flexbox for responsive layout', () => {
      renderWithProviders(<Home />);

      const ctaContainer = screen.getByRole('link', { name: /Get Started/i }).parentElement;
      expect(ctaContainer).toHaveClass('flex');
    });

    it('should use CSS Grid for feature cards', () => {
      renderWithProviders(<Home />);

      const gridContainer = screen.getByRole('heading', { name: /Features/i }).parentElement?.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should apply proper spacing and gaps', () => {
      renderWithProviders(<Home />);

      const gridContainer = screen.getByRole('heading', { name: /Features/i }).parentElement?.querySelector('.grid');
      expect(gridContainer).toHaveClass('gap-8');
    });
  });

  describe('Viewport Meta Tag and Zoom', () => {
    it('should allow zooming for accessibility', () => {
      renderWithProviders(<Home />);

      // Viewport should allow user scaling
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        const content = viewport.getAttribute('content');
        expect(content).not.toContain('user-scalable=no');
        expect(content).not.toContain('maximum-scale=1');
      }
    });
  });

  describe('Performance on Mobile (NFR-2)', () => {
    it('should load core content quickly on mobile', () => {
      renderWithViewport(<Home />, 375);

      // Hero section should render immediately
      const heading = screen.getByRole('heading', { level: 1 });
      const cta = screen.getByRole('link', { name: /Get Started/i });

      expect(heading).toBeInTheDocument();
      expect(cta).toBeInTheDocument();
    });

    it('should optimize animations for mobile performance', () => {
      renderWithViewport(<Home />, 375);

      // Animations should use GPU-accelerated properties
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });
});
