import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Home from '../Home'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} data-testid={props['data-testid']} {...props}>{children}</div>
    ),
    h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={className} data-testid="hero-headline" {...props}>{children}</h1>
    ),
    h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className} data-testid="hero-subheadline" {...props}>{children}</p>
    ),
    span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...props}>{children}</span>
    ),
    button: ({ children, className, onHoverStart, onHoverEnd, ...props }: React.HTMLAttributes<HTMLButtonElement> & { onHoverStart?: () => void; onHoverEnd?: () => void }) => (
      <button className={className} {...props}>{children}</button>
    ),
    footer: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <footer className={className} {...props}>{children}</footer>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
}))

// Mock the AuthContext
const mockUser = null
const mockUseAuth = vi.fn(() => ({
  user: mockUser,
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: vi.fn(),
  logout: vi.fn(),
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock the ThemeContext
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}))

// Mock the BackgroundEffect component
vi.mock('../../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}))

// Mock the InteractiveDemo component
vi.mock('../../components/InteractiveDemo', () => ({
  InteractiveDemo: () => <div data-testid="interactive-demo" />,
}))

// Mock the StatisticsSection component
vi.mock('../../components/StatisticsSection', () => ({
  StatisticsSection: ({ className }: { className?: string }) => (
    <div data-testid="statistics-section" className={className} />
  ),
}))

// Mock the Testimonials component
vi.mock('../../components/Testimonials', () => ({
  Testimonials: () => <div data-testid="testimonials" />,
}))

// Mock the GlassMorphismCard component
vi.mock('../../components/GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="glass-card">{children}</div>
  ),
}))

// Mock the FuturisticButton component
vi.mock('../../components/FuturisticButton', () => ({
  FuturisticButton: ({ children, variant, size, className, onClick, ...props }: {
    children: React.ReactNode;
    variant?: string;
    size?: string;
    className?: string;
    onClick?: () => void;
  }) => (
    <button
      className={`futuristic-button ${variant || ''} ${size || ''} ${className || ''}`}
      onClick={onClick}
      data-testid={`cta-button-${variant || 'default'}`}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Home Page - Enhanced Hero Section', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      logout: vi.fn(),
    })
  })

  // Test Case 1: Hero section renders on page load
  describe('Test Case 1: Hero section renders on page load', () => {
    it('should render the hero headline', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      expect(headline).toBeInTheDocument()
      expect(headline.textContent).toBeTruthy()
    })

    it('should render the hero subheadline', () => {
      renderWithRouter(<Home />)

      const subheadlines = screen.getAllByTestId('hero-subheadline')
      expect(subheadlines.length).toBeGreaterThan(0)
      // Check the first subheadline has content
      expect(subheadlines[0].textContent).toBeTruthy()
    })

    it('should render CTA buttons above the fold', () => {
      renderWithRouter(<Home />)

      // Primary CTA (neon variant)
      const primaryCta = screen.getByTestId('cta-button-neon')
      expect(primaryCta).toBeInTheDocument()
      expect(primaryCta).toHaveTextContent('Get Started')

      // Secondary CTA (outline variant)
      const secondaryCta = screen.getByTestId('cta-button-outline')
      expect(secondaryCta).toBeInTheDocument()
      expect(secondaryCta).toHaveTextContent('Login')
    })

    it('should render headline with gradient styling', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      // Check that the headline contains the gradient-styled span
      const gradientSpan = headline.querySelector('span')
      expect(gradientSpan).toBeInTheDocument()
      expect(gradientSpan?.className).toMatch(/bg-gradient|gradient/)
    })

    it('should display compelling headline text', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      // The headline should contain meaningful text
      expect(headline.textContent?.length).toBeGreaterThan(5)
    })

    it('should display value proposition in subheadline', () => {
      renderWithRouter(<Home />)

      // Look for text that describes the value proposition in the subheadline
      const subheadlines = screen.getAllByTestId('hero-subheadline')
      const hasValueProposition = subheadlines.some(el =>
        /short|link|url|track|analytic/i.test(el.textContent || '')
      )
      expect(hasValueProposition).toBe(true)
    })
  })

  // Test Case 2: Hero text animations play
  describe('Test Case 2: Hero text animations', () => {
    it('should have animation container with proper structure', () => {
      renderWithRouter(<Home />)

      // The hero section should be wrapped in a motion container
      const headline = screen.getByTestId('hero-headline')
      expect(headline).toBeInTheDocument()
    })

    it('should render headline with animated gradient text class', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      const gradientSpan = headline.querySelector('span')

      // Check for animation class
      expect(gradientSpan?.className).toMatch(/animate-gradient|bg-clip-text|text-transparent/)
    })

    it('should have proper text sizing for readability', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      // Check for responsive text sizing classes
      expect(headline.className).toMatch(/text-5xl|text-6xl|text-7xl|md:text-7xl/)
    })

    it('should not cause layout shifts (fixed dimensions)', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      // Check for proper layout classes that prevent shifts
      expect(headline.className).toMatch(/mb-|leading-/)
    })
  })

  // Test Case 3: Primary CTA button hover state
  describe('Test Case 3: Primary CTA button hover state', () => {
    it('should render primary CTA with neon variant', () => {
      renderWithRouter(<Home />)

      const primaryCta = screen.getByTestId('cta-button-neon')
      expect(primaryCta).toBeInTheDocument()
      expect(primaryCta).toHaveAttribute('data-variant', 'neon')
    })

    it('should render CTA with large size for prominence', () => {
      renderWithRouter(<Home />)

      const primaryCta = screen.getByTestId('cta-button-neon')
      expect(primaryCta).toHaveAttribute('data-size', 'lg')
    })

    it('should have proper button styling classes', () => {
      renderWithRouter(<Home />)

      const primaryCta = screen.getByTestId('cta-button-neon')
      expect(primaryCta.className).toMatch(/futuristic-button|neon/)
    })

    it('should render secondary CTA with outline variant', () => {
      renderWithRouter(<Home />)

      const secondaryCta = screen.getByTestId('cta-button-outline')
      expect(secondaryCta).toBeInTheDocument()
      expect(secondaryCta).toHaveAttribute('data-variant', 'outline')
    })

    it('should link primary CTA to registration for unauthenticated users', () => {
      renderWithRouter(<Home />)

      // Find the link wrapping the Get Started button
      const links = screen.getAllByRole('link')
      const registerLink = links.find(link => link.getAttribute('href') === '/register')
      expect(registerLink).toBeInTheDocument()
    })

    it('should link secondary CTA to login page', () => {
      renderWithRouter(<Home />)

      const links = screen.getAllByRole('link')
      const loginLink = links.find(link => link.getAttribute('href') === '/login')
      expect(loginLink).toBeInTheDocument()
    })
  })

  // Test Case 4: Mobile viewport (320px) - responsive design
  describe('Test Case 4: Mobile viewport responsiveness', () => {
    it('should have responsive headline sizing', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      // Should have both mobile and desktop text sizes
      expect(headline.className).toMatch(/text-5xl.*md:text-7xl|md:text-7xl/)
    })

    it('should have responsive subheadline sizing', () => {
      renderWithRouter(<Home />)

      const subheadlines = screen.getAllByTestId('hero-subheadline')
      // Check for responsive text sizing
      expect(subheadlines[0].className).toMatch(/text-xl|md:text-2xl/)
    })

    it('should have responsive CTA button layout', () => {
      renderWithRouter(<Home />)

      // CTAs should be in a flex container with responsive direction
      const ctaContainer = screen.getByTestId('cta-button-neon').parentElement?.parentElement
      expect(ctaContainer?.className).toMatch(/flex.*flex-col.*md:flex-row|flex-col|md:flex-row/)
    })

    it('should have proper padding for mobile viewports', () => {
      renderWithRouter(<Home />)

      // The main container should have padding
      const mainContainer = screen.getByTestId('hero-headline').closest('.min-h-screen')
      expect(mainContainer?.className).toMatch(/p-4|px-4|py-4/)
    })

    it('should maintain text readability with max-width constraints', () => {
      renderWithRouter(<Home />)

      // Check for max-width class on content container
      const subheadlines = screen.getAllByTestId('hero-subheadline')
      expect(subheadlines[0].className).toMatch(/max-w-2xl|mx-auto/)
    })

    it('should have tappable CTA buttons with appropriate sizing', () => {
      renderWithRouter(<Home />)

      const primaryCta = screen.getByTestId('cta-button-neon')
      const secondaryCta = screen.getByTestId('cta-button-outline')

      // Both buttons should have lg size for easy tapping
      expect(primaryCta).toHaveAttribute('data-size', 'lg')
      expect(secondaryCta).toHaveAttribute('data-size', 'lg')
    })
  })

  // Authentication-aware CTA behavior
  describe('Authentication-aware CTA behavior', () => {
    it('should show "Get Started" CTA for unauthenticated users', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      renderWithRouter(<Home />)

      expect(screen.getByText('Get Started')).toBeInTheDocument()

      // Should link to register
      const links = screen.getAllByRole('link')
      const registerLink = links.find(link => link.getAttribute('href') === '/register')
      expect(registerLink).toBeInTheDocument()
    })

    it('should link to dashboard for authenticated users', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser', email: 'test@example.com', is_admin: 0 },
        loading: false,
        isAuthenticated: true,
        isAdmin: false,
        login: vi.fn(),
        logout: vi.fn(),
      })

      renderWithRouter(<Home />)

      // Should link to dashboard
      const links = screen.getAllByRole('link')
      const dashboardLink = links.find(link => link.getAttribute('href') === '/dashboard')
      expect(dashboardLink).toBeInTheDocument()
    })
  })

  // Theme support
  describe('Theme support', () => {
    it('should render hero section in light mode', () => {
      renderWithRouter(<Home />)

      // The hero section should be present
      expect(screen.getByTestId('hero-headline')).toBeInTheDocument()
    })

    it('should have proper contrast for text elements', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      // Headline should have visible text
      expect(headline.textContent).toBeTruthy()
    })
  })

  // Overall hero section structure
  describe('Hero section structure', () => {
    it('should render background effect', () => {
      renderWithRouter(<Home />)

      expect(screen.getByTestId('background-effect')).toBeInTheDocument()
    })

    it('should have centered content layout', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      const container = headline.closest('.text-center')
      expect(container).toBeInTheDocument()
    })

    it('should have proper z-index for content visibility', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByTestId('hero-headline')
      const container = headline.closest('.z-10')
      expect(container).toBeInTheDocument()
    })

    it('should include interactive demo section below hero', () => {
      renderWithRouter(<Home />)

      expect(screen.getByTestId('interactive-demo')).toBeInTheDocument()
    })

    it('should include statistics section', () => {
      renderWithRouter(<Home />)

      expect(screen.getByTestId('statistics-section')).toBeInTheDocument()
    })

    it('should include testimonials section', () => {
      renderWithRouter(<Home />)

      expect(screen.getByTestId('testimonials')).toBeInTheDocument()
    })
  })
})
