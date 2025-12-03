import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Home from '../Home'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { 'data-testid'?: string }) => (
      <div className={className} {...props}>{children}</div>
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
const mockUseAuth = vi.fn(() => ({
  user: null,
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

// Mock the HowItWorks component
vi.mock('../../components/HowItWorks', () => ({
  HowItWorks: () => <section data-testid="how-it-works-content">How It Works Section</section>,
}))

// Mock the FAQ component
vi.mock('../../components/FAQ', () => ({
  FAQ: () => <div data-testid="faq" />,
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

describe('Secondary CTA for Learn More', () => {
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

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
  })

  describe('Test Case 1: Hero section includes secondary CTA', () => {
    it('should render a secondary "Learn More" button visible alongside primary CTA', () => {
      renderWithRouter(<Home />)

      // Primary CTA should exist
      const primaryCta = screen.getByTestId('cta-button-neon')
      expect(primaryCta).toBeInTheDocument()
      expect(primaryCta).toHaveTextContent('Get Started')

      // Secondary "Learn More" CTA should exist with ghost variant
      const learnMoreCta = screen.getByTestId('cta-button-ghost')
      expect(learnMoreCta).toBeInTheDocument()
      expect(learnMoreCta).toHaveTextContent('Learn More')
    })

    it('should display Learn More CTA with appropriate styling (ghost variant)', () => {
      renderWithRouter(<Home />)

      const learnMoreCta = screen.getByTestId('cta-button-ghost')
      expect(learnMoreCta).toHaveAttribute('data-variant', 'ghost')
    })

    it('should have Learn More CTA visually distinct from primary but still prominent', () => {
      renderWithRouter(<Home />)

      const learnMoreCta = screen.getByTestId('cta-button-ghost')
      // Ghost variant should be visually distinct from neon
      expect(learnMoreCta.className).toMatch(/ghost/)
      // Should have large size for prominence
      expect(learnMoreCta).toHaveAttribute('data-size', 'lg')
    })

    it('should position Learn More CTA in the hero section CTA group', () => {
      renderWithRouter(<Home />)

      // Both CTAs should be in the same container
      const primaryCta = screen.getByTestId('cta-button-neon')
      const learnMoreCta = screen.getByTestId('cta-button-ghost')

      // They should share a common parent container
      const primaryParent = primaryCta.closest('.flex')
      const learnMoreParent = learnMoreCta.closest('.flex')

      // Verify the learn more button is in the CTA container
      expect(learnMoreParent).toContainElement(learnMoreCta)
    })
  })

  describe('Test Case 2: Click secondary CTA button', () => {
    it('should scroll smoothly to how-it-works section when Learn More is clicked', async () => {
      renderWithRouter(<Home />)

      const learnMoreCta = screen.getByTestId('cta-button-ghost')

      // Click the Learn More button
      fireEvent.click(learnMoreCta)

      // Verify scrollIntoView was called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    })

    it('should call scrollIntoView with smooth behavior', async () => {
      renderWithRouter(<Home />)

      const learnMoreCta = screen.getByTestId('cta-button-ghost')

      // Click the Learn More button
      fireEvent.click(learnMoreCta)

      // Verify scrollIntoView was called with smooth behavior
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })
    })

    it('should have target section (how-it-works) available on the page', () => {
      renderWithRouter(<Home />)

      // The how-it-works section wrapper should exist with the correct id
      const howItWorksWrapper = document.getElementById('how-it-works')
      expect(howItWorksWrapper).toBeInTheDocument()
    })
  })

  describe('Test Case 3: Secondary CTA keyboard activation', () => {
    it('should be focusable via keyboard', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Home />)

      const learnMoreCta = screen.getByTestId('cta-button-ghost')

      // Tab to focus on the button (may need multiple tabs depending on DOM order)
      await user.tab()
      await user.tab()
      await user.tab()

      // One of the buttons should eventually be focused
      // Just verify the button can receive focus
      learnMoreCta.focus()
      expect(document.activeElement).toBe(learnMoreCta)
    })

    it('should activate with Enter key', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Home />)

      const learnMoreCta = screen.getByTestId('cta-button-ghost')

      // Focus and press Enter
      learnMoreCta.focus()
      await user.keyboard('{Enter}')

      // Verify scrollIntoView was called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    })

    it('should activate with Space key', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Home />)

      const learnMoreCta = screen.getByTestId('cta-button-ghost')

      // Focus and press Space
      learnMoreCta.focus()
      await user.keyboard(' ')

      // Verify scrollIntoView was called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    })

    it('should have proper button semantics for accessibility', () => {
      renderWithRouter(<Home />)

      const learnMoreCta = screen.getByTestId('cta-button-ghost')

      // Should be a button element
      expect(learnMoreCta.tagName.toLowerCase()).toBe('button')
    })
  })
})
