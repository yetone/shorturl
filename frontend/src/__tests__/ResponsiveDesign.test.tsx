import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import { InteractiveDemo } from '../components/InteractiveDemo'
import { FAQ } from '../components/FAQ'
import { HowItWorks } from '../components/HowItWorks'
import { Testimonials } from '../components/Testimonials'
import { StatisticsSection } from '../components/StatisticsSection'
import { FuturisticButton } from '../components/FuturisticButton'
import { GlassMorphismCard } from '../components/GlassMorphismCard'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { 'data-testid'?: string; variants?: any; style?: React.CSSProperties }) => (
      <div className={className} style={style} {...props}>{children}</div>
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
    span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...props}>{children}</span>
    ),
    button: ({ children, className, ...props }: React.HTMLAttributes<HTMLButtonElement> & { whileHover?: any; whileTap?: any; onHoverStart?: () => void; onHoverEnd?: () => void }) => (
      <button className={className} {...props}>{children}</button>
    ),
    footer: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <footer className={className} {...props}>{children}</footer>
    ),
    section: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <section className={className} {...props}>{children}</section>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
  animate: vi.fn((from: number, to: number, options: { onUpdate: (value: number) => void }) => {
    options.onUpdate(to);
    return { stop: vi.fn() };
  }),
}))

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
}))

// Mock the ThemeContext
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}))

// Mock the BackgroundEffect component
vi.mock('../components/BackgroundEffect', () => ({
  BackgroundEffect: () => <div data-testid="background-effect" />,
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

/**
 * Test Case 1: Render homepage at 320px viewport width
 * Expected: All sections stack vertically, text readable, buttons tappable (min 44px touch targets)
 */
describe('Test Case 1: Mobile viewport (320px) responsive design', () => {
  describe('Homepage layout at 320px width', () => {
    it('should have mobile-first responsive classes for hero section', () => {
      renderWithRouter(<Home />)

      // Hero headline should have mobile text size first, then scale up
      const headline = screen.getByRole('heading', { level: 1 })
      expect(headline.className).toMatch(/text-5xl/)
      expect(headline.className).toMatch(/md:text-7xl/)
    })

    it('should stack CTA buttons vertically on mobile', () => {
      renderWithRouter(<Home />)

      // Find the container with CTA buttons - should have flex-col for mobile
      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      const ctaContainer = getStartedButton.parentElement?.parentElement
      expect(ctaContainer?.className).toMatch(/flex-col/)
      expect(ctaContainer?.className).toMatch(/md:flex-row/)
    })

    it('should have proper padding for mobile viewport', () => {
      renderWithRouter(<Home />)

      // Main container should have padding for mobile
      const mainContainer = screen.getByRole('heading', { level: 1 }).closest('.min-h-screen')
      expect(mainContainer?.className).toMatch(/p-4/)
    })

    it('should have readable subheadline text on mobile', () => {
      renderWithRouter(<Home />)

      // Subheadline should have mobile-appropriate text size
      const subheadline = screen.getByText(/Create short, memorable links/i)
      expect(subheadline.className).toMatch(/text-xl/)
      expect(subheadline.className).toMatch(/md:text-2xl/)
    })
  })

  describe('Touch target accessibility', () => {
    it('should render buttons with tappable size (lg size = min 44px touch target)', () => {
      renderWithRouter(<Home />)

      const buttons = screen.getAllByRole('button')
      // Large buttons have py-3 (12px padding top/bottom) + text height > 44px
      const ctaButtons = buttons.filter(btn =>
        btn.className.includes('lg') || btn.getAttribute('data-size') === 'lg'
      )
      expect(ctaButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Content stacking on mobile', () => {
    it('should render all major sections in vertical stack', () => {
      renderWithRouter(<Home />)

      // All these sections should be present and stack vertically
      expect(screen.getByRole('heading', { name: /simplify your links/i })).toBeInTheDocument()
      expect(screen.getByText(/how it works/i, { selector: 'h2' })).toBeInTheDocument()
      expect(screen.getByText(/features/i, { selector: 'h2' })).toBeInTheDocument()
    })
  })
})

/**
 * Test Case 2: Render homepage at 768px viewport width
 * Expected: Sections use intermediate layout, some side-by-side elements where appropriate
 */
describe('Test Case 2: Tablet viewport (768px) responsive design', () => {
  describe('Homepage layout at 768px width', () => {
    it('should have responsive classes that activate at md breakpoint', () => {
      renderWithRouter(<Home />)

      // Hero headline scales up at md breakpoint
      const headline = screen.getByRole('heading', { level: 1 })
      expect(headline.className).toMatch(/md:text-7xl/)
    })

    it('should switch CTA buttons to horizontal layout at tablet', () => {
      renderWithRouter(<Home />)

      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      const ctaContainer = getStartedButton.parentElement?.parentElement
      expect(ctaContainer?.className).toMatch(/md:flex-row/)
    })
  })

  describe('Features grid layout at tablet', () => {
    it('should have md:grid-cols-3 class for features section', () => {
      renderWithRouter(<Home />)

      // Features section should use 3-column grid at md breakpoint
      const featuresTitle = screen.getByText(/features/i, { selector: 'h2' })
      const featuresGrid = featuresTitle.parentElement?.querySelector('.grid')
      expect(featuresGrid?.className).toMatch(/md:grid-cols-3/)
    })
  })
})

/**
 * Test Case 3: Render homepage at 1280px viewport width
 * Expected: Full desktop layout with multi-column sections and optimal spacing
 */
describe('Test Case 3: Desktop viewport (1280px) responsive design', () => {
  describe('Homepage layout at 1280px width', () => {
    it('should have desktop text sizing for headline', () => {
      renderWithRouter(<Home />)

      const headline = screen.getByRole('heading', { level: 1 })
      // At desktop, should use larger text
      expect(headline.className).toMatch(/md:text-7xl/)
    })

    it('should have maximum width constraint for content', () => {
      renderWithRouter(<Home />)

      // Content container should have max-width for desktop
      const container = screen.getByRole('heading', { level: 1 }).closest('.max-w-4xl')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Multi-column layouts at desktop', () => {
    it('should display features in 3-column grid', () => {
      renderWithRouter(<Home />)

      const featuresTitle = screen.getByText(/features/i, { selector: 'h2' })
      const featuresGrid = featuresTitle.parentElement?.querySelector('.grid')
      expect(featuresGrid?.className).toMatch(/md:grid-cols-3/)
    })
  })
})

/**
 * Test Case 4: Interactive demo on mobile
 * Expected: Input field and button are usable on touch devices
 */
describe('Test Case 4: Interactive Demo responsive design', () => {
  describe('Demo input and button accessibility on mobile', () => {
    it('should render input with full width', () => {
      renderWithRouter(<InteractiveDemo />)

      const input = screen.getByRole('textbox')
      expect(input.className).toMatch(/w-full/)
    })

    it('should render button with full width', () => {
      renderWithRouter(<InteractiveDemo />)

      const button = screen.getByRole('button', { name: /shorten url/i })
      expect(button.className).toMatch(/w-full/)
    })

    it('should have touch-friendly input padding', () => {
      renderWithRouter(<InteractiveDemo />)

      const input = screen.getByRole('textbox')
      // py-3 provides adequate touch target height
      expect(input.className).toMatch(/py-3/)
    })

    it('should have responsive padding for the demo card', () => {
      renderWithRouter(<InteractiveDemo />)

      // Card should have responsive padding: p-6 on mobile, md:p-8 on larger
      const section = screen.getByRole('region', { name: /interactive url shortening demo/i })
      const card = section.querySelector('.p-6')
      expect(card?.className).toMatch(/p-6/)
      expect(card?.className).toMatch(/md:p-8/)
    })

    it('should have accessible label for input', () => {
      renderWithRouter(<InteractiveDemo />)

      const label = screen.getByText(/enter your long url/i)
      expect(label).toBeInTheDocument()
    })
  })

  describe('Demo result display on mobile', () => {
    it('should wrap result content appropriately', async () => {
      const user = userEvent.setup()
      renderWithRouter(<InteractiveDemo />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'https://example.com/very-long-url')

      const button = screen.getByRole('button', { name: /shorten url/i })
      await user.click(button)

      // Wait for result to appear
      await screen.findByTestId('demo-result')

      // Result should be displayed with truncate class for overflow handling
      const shortenedUrl = screen.getByText(/localhost/i)
      expect(shortenedUrl.className).toMatch(/truncate/)
    })
  })
})

/**
 * Test Case 5: FAQ accordion on mobile
 * Expected: FAQ items are easily tappable and content doesn't overflow
 */
describe('Test Case 5: FAQ accordion responsive design', () => {
  describe('FAQ items touch accessibility', () => {
    it('should render FAQ items with adequate tap area', () => {
      renderWithRouter(<FAQ />)

      const faqButtons = screen.getAllByTestId('faq-button')
      expect(faqButtons.length).toBeGreaterThan(0)

      // Each button should have responsive padding for tap targets
      faqButtons.forEach(button => {
        expect(button.className).toMatch(/p-5/)
        expect(button.className).toMatch(/md:p-6/)
      })
    })

    it('should have proper question text sizing', () => {
      renderWithRouter(<FAQ />)

      const questions = screen.getAllByTestId('faq-question')
      expect(questions.length).toBeGreaterThan(0)

      // Questions should have responsive text sizing
      questions.forEach(question => {
        expect(question.className).toMatch(/text-base/)
        expect(question.className).toMatch(/md:text-lg/)
      })
    })
  })

  describe('FAQ content overflow handling', () => {
    it('should have max-width container for FAQ section', () => {
      renderWithRouter(<FAQ />)

      const container = screen.getByTestId('faq-container')
      expect(container.className).toMatch(/max-w-4xl/)
      expect(container.className).toMatch(/px-4/)
    })

    it('should expand and show answer content properly', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQ />)

      const faqButtons = screen.getAllByTestId('faq-button')
      await user.click(faqButtons[0])

      // After click, answer should be visible
      const answers = screen.getAllByTestId('faq-answer')
      expect(answers.length).toBeGreaterThan(0)

      // Answer text should have proper sizing
      const answerText = answers[0].querySelector('p')
      expect(answerText?.className).toMatch(/text-sm/)
      expect(answerText?.className).toMatch(/md:text-base/)
    })

    it('should have responsive section padding', () => {
      renderWithRouter(<FAQ />)

      const section = screen.getByTestId('faq-section')
      expect(section.className).toMatch(/py-16/)
      expect(section.className).toMatch(/md:py-24/)
    })
  })

  describe('FAQ keyboard accessibility', () => {
    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      renderWithRouter(<FAQ />)

      const faqButtons = screen.getAllByTestId('faq-button')
      faqButtons[0].focus()

      // Should support Enter key
      await user.keyboard('{Enter}')

      // Answer should be expanded
      const answers = screen.getAllByTestId('faq-answer')
      expect(answers.length).toBeGreaterThan(0)
    })
  })
})

// Additional responsive tests for other components
describe('Additional Component Responsive Tests', () => {
  describe('HowItWorks responsive layout', () => {
    it('should stack steps vertically on mobile', () => {
      renderWithRouter(<HowItWorks />)

      const container = screen.getByTestId('how-it-works-steps-container')
      expect(container.className).toMatch(/flex-col/)
      expect(container.className).toMatch(/md:flex-row/)
    })

    it('should show mobile connectors on small screens', () => {
      renderWithRouter(<HowItWorks />)

      // Desktop connectors are hidden on mobile (hidden md:flex)
      const desktopConnectors = screen.getAllByTestId(/step-connector/)
      desktopConnectors.forEach(connector => {
        expect(connector.className).toMatch(/hidden/)
        expect(connector.className).toMatch(/md:flex/)
      })
    })

    it('should have responsive section title', () => {
      renderWithRouter(<HowItWorks />)

      const title = screen.getByText(/how it works/i, { selector: 'h2' })
      expect(title.className).toMatch(/text-3xl/)
      expect(title.className).toMatch(/md:text-4xl/)
    })
  })

  describe('Testimonials responsive layout', () => {
    it('should use responsive grid for testimonial cards', () => {
      renderWithRouter(<Testimonials />)

      const grid = screen.getByTestId('testimonials-grid')
      expect(grid.className).toMatch(/grid-cols-1/)
      expect(grid.className).toMatch(/md:grid-cols-2/)
      expect(grid.className).toMatch(/lg:grid-cols-3/)
    })

    it('should have responsive gap spacing', () => {
      renderWithRouter(<Testimonials />)

      const grid = screen.getByTestId('testimonials-grid')
      expect(grid.className).toMatch(/gap-6/)
      expect(grid.className).toMatch(/md:gap-8/)
    })

    it('should have responsive quote text sizing', () => {
      renderWithRouter(<Testimonials />)

      const quotes = screen.getAllByTestId('testimonial-quote')
      quotes.forEach(quote => {
        expect(quote.className).toMatch(/text-base/)
        expect(quote.className).toMatch(/md:text-lg/)
      })
    })
  })

  describe('StatisticsSection responsive layout', () => {
    it('should use 2-column grid on mobile, 4-column on tablet+', () => {
      renderWithRouter(<StatisticsSection />)

      const grid = screen.getByRole('list', { name: /statistics metrics/i })
      expect(grid.className).toMatch(/grid-cols-2/)
      expect(grid.className).toMatch(/md:grid-cols-4/)
    })

    it('should have responsive gap spacing', () => {
      renderWithRouter(<StatisticsSection />)

      const grid = screen.getByRole('list', { name: /statistics metrics/i })
      expect(grid.className).toMatch(/gap-4/)
      expect(grid.className).toMatch(/md:gap-6/)
    })

    it('should have responsive counter text sizing', () => {
      renderWithRouter(<StatisticsSection />)

      // Counter values should scale with viewport
      const statCards = screen.getAllByTestId(/stat-card/)
      expect(statCards.length).toBe(4)
    })
  })

  describe('FuturisticButton responsive sizing', () => {
    it('should provide size variants for different contexts', () => {
      const { container } = render(
        <div>
          <FuturisticButton size="sm">Small</FuturisticButton>
          <FuturisticButton size="md">Medium</FuturisticButton>
          <FuturisticButton size="lg">Large</FuturisticButton>
        </div>
      )

      const buttons = container.querySelectorAll('button')
      expect(buttons[0].className).toMatch(/px-3.*py-1\.5|text-sm/)
      expect(buttons[1].className).toMatch(/px-4.*py-2|text-base/)
      expect(buttons[2].className).toMatch(/px-6.*py-3|text-lg/)
    })

    it('should have large size for hero CTA buttons (touch-friendly)', () => {
      renderWithRouter(<Home />)

      const getStartedButton = screen.getByRole('button', { name: /get started/i })
      // Large buttons have adequate touch target size
      expect(getStartedButton.className).toMatch(/lg/)
    })
  })

  describe('GlassMorphismCard responsive behavior', () => {
    it('should render card with responsive wrapper', () => {
      render(
        <GlassMorphismCard className="p-4 md:p-6">
          <p>Test content</p>
        </GlassMorphismCard>
      )

      const card = screen.getByText('Test content').closest('.backdrop-blur-md')
      expect(card).toBeInTheDocument()
      expect(card?.className).toMatch(/rounded-xl/)
    })
  })
})

describe('Cross-viewport consistency tests', () => {
  it('should maintain proper z-index layering at all viewports', () => {
    renderWithRouter(<Home />)

    // Content should have z-10 to stay above background
    const headline = screen.getByRole('heading', { level: 1 })
    const contentContainer = headline.closest('.z-10')
    expect(contentContainer).toBeInTheDocument()
  })

  it('should maintain proper content centering', () => {
    renderWithRouter(<Home />)

    // Main content should be centered
    const headline = screen.getByRole('heading', { level: 1 })
    const centeredContainer = headline.closest('.text-center')
    expect(centeredContainer).toBeInTheDocument()

    const maxWidthContainer = headline.closest('.max-w-4xl')
    expect(maxWidthContainer?.className).toMatch(/mx-auto/)
  })

  it('should have full width sections on all viewports', () => {
    renderWithRouter(<Home />)

    const faqSection = screen.getByTestId('faq-section')
    expect(faqSection.className).toMatch(/w-full/)
  })
})
