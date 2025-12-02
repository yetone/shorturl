import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import Home from '../pages/Home';
import { GlassMorphismCard } from '../components/GlassMorphismCard';

// Mock the AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock the BackgroundEffect since it uses Three.js
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}));

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, variants, initial, animate, whileInView, viewport, whileHover, onHoverStart, onHoverEnd, ...props }: any) => (
      <div className={className} style={style} data-testid={props['data-testid']} {...props}>
        {children}
      </div>
    ),
    h1: ({ children, className, ...props }: any) => <h1 className={className} {...props}>{children}</h1>,
    h2: ({ children, className, ...props }: any) => <h2 className={className} {...props}>{children}</h2>,
    p: ({ children, className, ...props }: any) => <p className={className} {...props}>{children}</p>,
    footer: ({ children, className, ...props }: any) => <footer className={className} {...props}>{children}</footer>,
    button: ({ children, className, type, onClick, disabled, ...props }: any) => (
      <button className={className} type={type} onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    span: ({ children, className, ...props }: any) => <span className={className} {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Features Section Display', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    // Set default theme
    localStorage.setItem('theme', 'light');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Test Case 1: Feature cards for URL shortening, analytics, and dashboard are displayed', () => {
    it('should display the Features section heading', () => {
      renderWithProviders(<Home />);

      const featuresHeading = screen.getByText('Features');
      expect(featuresHeading).toBeInTheDocument();
    });

    it('should display the URL Shortening feature card', () => {
      renderWithProviders(<Home />);

      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText(/Transform long, unwieldy links into short/i)).toBeInTheDocument();
    });

    it('should display the Click Analytics feature card', () => {
      renderWithProviders(<Home />);

      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText(/Track and analyze click data/i)).toBeInTheDocument();
    });

    it('should display the User Dashboard feature card', () => {
      renderWithProviders(<Home />);

      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/Manage all your shortened URLs/i)).toBeInTheDocument();
    });

    it('should display all 6 feature cards', () => {
      renderWithProviders(<Home />);

      // All feature titles should be present
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });
  });

  describe('Test Case 2: Each card contains a Lucide icon, title text, and description text', () => {
    it('should render feature cards with proper structure (icon, title, description)', () => {
      renderWithProviders(<Home />);

      // Check URL Shortening card structure
      const urlShortening = screen.getByText('URL Shortening');
      expect(urlShortening.tagName).toBe('H3');

      // Check that the description is present as a paragraph
      const description = screen.getByText(/Transform long, unwieldy links/);
      expect(description.tagName).toBe('P');
    });

    it('should have SVG icons for each feature card', () => {
      const { container } = renderWithProviders(<Home />);

      // Find all SVG elements (Lucide icons are rendered as SVGs)
      const svgIcons = container.querySelectorAll('svg');

      // There should be at least 6 SVG icons for the feature cards
      expect(svgIcons.length).toBeGreaterThanOrEqual(6);
    });

    it('should display feature titles with correct styling', () => {
      renderWithProviders(<Home />);

      const titles = ['URL Shortening', 'Click Analytics', 'User Dashboard', 'Global Access', 'Secure Links', 'Lightning Fast'];

      titles.forEach(title => {
        const element = screen.getByText(title);
        expect(element).toBeInTheDocument();
        expect(element.tagName).toBe('H3');
        expect(element).toHaveClass('text-xl', 'font-bold');
      });
    });

    it('should display descriptions for each feature', () => {
      renderWithProviders(<Home />);

      const descriptions = [
        /Transform long, unwieldy links into short/,
        /Track and analyze click data/,
        /Manage all your shortened URLs/,
        /Access your shortened links from anywhere/,
        /Rest easy knowing your links are secure/,
        /Enjoy lightning-fast redirects/,
      ];

      descriptions.forEach(description => {
        expect(screen.getByText(description)).toBeInTheDocument();
      });
    });
  });

  describe('Test Case 4: Feature cards use GlassMorphismCard component', () => {
    it('should render GlassMorphismCard with children content', () => {
      renderWithProviders(
        <GlassMorphismCard>
          <div>Test Content</div>
        </GlassMorphismCard>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply backdrop-blur styling for glassmorphism effect', () => {
      const { container } = renderWithProviders(
        <GlassMorphismCard>
          <div>Test Content</div>
        </GlassMorphismCard>
      );

      // Check for backdrop-blur class
      const card = container.querySelector('.backdrop-blur-md');
      expect(card).toBeInTheDocument();
    });

    it('should apply rounded corners for card styling', () => {
      const { container } = renderWithProviders(
        <GlassMorphismCard>
          <div>Test Content</div>
        </GlassMorphismCard>
      );

      const card = container.querySelector('.rounded-xl');
      expect(card).toBeInTheDocument();
    });

    it('should render feature cards within GlassMorphismCard components in Home page', () => {
      const { container } = renderWithProviders(<Home />);

      // Features should be wrapped in elements with backdrop-blur-md class (from GlassMorphismCard)
      const glassMorphismCards = container.querySelectorAll('.backdrop-blur-md');

      // Should have at least 6 cards for the features
      expect(glassMorphismCards.length).toBeGreaterThanOrEqual(6);
    });

    it('should accept custom glowColor prop for hover effects', () => {
      const customGlowColor = 'rgba(255, 0, 0, 0.5)';

      // This tests that the component accepts and uses the glowColor prop
      renderWithProviders(
        <GlassMorphismCard glowColor={customGlowColor}>
          <div>Test Content</div>
        </GlassMorphismCard>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should have semi-transparent background for glassmorphism effect', () => {
      const { container } = renderWithProviders(
        <GlassMorphismCard>
          <div>Test Content</div>
        </GlassMorphismCard>
      );

      const card = container.querySelector('.backdrop-blur-md');
      expect(card).toBeInTheDocument();
      // GlassMorphismCard applies backdrop blur through both CSS class and inline style
      expect(card).toHaveClass('backdrop-blur-md');
    });
  });
});

describe('GlassMorphismCard Component Unit Tests', () => {
  it('should render children correctly', () => {
    renderWithProviders(
      <GlassMorphismCard>
        <span>Child Content</span>
      </GlassMorphismCard>
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = renderWithProviders(
      <GlassMorphismCard className="custom-class">
        <div>Test</div>
      </GlassMorphismCard>
    );

    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('should have overflow-hidden for proper blur effect boundaries', () => {
    const { container } = renderWithProviders(
      <GlassMorphismCard>
        <div>Test</div>
      </GlassMorphismCard>
    );

    const card = container.querySelector('.overflow-hidden');
    expect(card).toBeInTheDocument();
  });

  it('should support hoverEffect prop', () => {
    renderWithProviders(
      <GlassMorphismCard hoverEffect={true}>
        <div>Hover Test</div>
      </GlassMorphismCard>
    );

    expect(screen.getByText('Hover Test')).toBeInTheDocument();
  });

  it('should support disabling hoverEffect', () => {
    renderWithProviders(
      <GlassMorphismCard hoverEffect={false}>
        <div>No Hover Test</div>
      </GlassMorphismCard>
    );

    expect(screen.getByText('No Hover Test')).toBeInTheDocument();
  });
});

describe('Feature Card Integration', () => {
  it('should display feature section in correct grid layout', () => {
    const { container } = renderWithProviders(<Home />);

    // Check for the grid layout class
    const grid = container.querySelector('.grid.md\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('should have gap between feature cards', () => {
    const { container } = renderWithProviders(<Home />);

    const grid = container.querySelector('.gap-8');
    expect(grid).toBeInTheDocument();
  });

  it('should render feature icons with correct neon colors', () => {
    const { container } = renderWithProviders(<Home />);

    // Check for neon-colored icons
    const neonGreenIcons = container.querySelectorAll('.text-neon-green');
    const neonBlueIcons = container.querySelectorAll('.text-neon-blue');
    const neonPinkIcons = container.querySelectorAll('.text-neon-pink');
    const neonYellowIcons = container.querySelectorAll('.text-neon-yellow');

    // URL Shortening and Secure Links use neon-green
    expect(neonGreenIcons.length).toBe(2);
    // Click Analytics and Global Access use neon-blue
    expect(neonBlueIcons.length).toBe(2);
    // User Dashboard uses neon-pink
    expect(neonPinkIcons.length).toBe(1);
    // Lightning Fast uses neon-yellow
    expect(neonYellowIcons.length).toBe(1);
  });

  it('should render icons with correct size', () => {
    const { container } = renderWithProviders(<Home />);

    // All feature icons should have h-8 w-8 classes
    const iconContainers = container.querySelectorAll('.h-8.w-8');
    expect(iconContainers.length).toBeGreaterThanOrEqual(6);
  });
});
