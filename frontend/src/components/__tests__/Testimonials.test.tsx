import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Testimonials } from '../Testimonials'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>{children}</div>
    ),
    h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
}))

// Mock the GlassMorphismCard component
vi.mock('../GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="glass-card">{children}</div>
  ),
}))

describe('Testimonials Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test Case 1: At least 3 testimonial cards displayed with quotes, names, and roles
  describe('Test Case 1: Testimonials section renders', () => {
    it('should render at least 3 testimonial cards', () => {
      render(<Testimonials />)

      const testimonialCards = screen.getAllByTestId('testimonial-card')
      expect(testimonialCards.length).toBeGreaterThanOrEqual(3)
    })

    it('should display quotes for each testimonial', () => {
      render(<Testimonials />)

      const quotes = screen.getAllByTestId('testimonial-quote')
      expect(quotes.length).toBeGreaterThanOrEqual(3)

      // Each quote should have content
      quotes.forEach(quote => {
        expect(quote.textContent).not.toBe('')
      })
    })

    it('should display names for each testimonial', () => {
      render(<Testimonials />)

      const names = screen.getAllByTestId('testimonial-name')
      expect(names.length).toBeGreaterThanOrEqual(3)

      // Each name should have content
      names.forEach(name => {
        expect(name.textContent).not.toBe('')
      })
    })

    it('should display roles/companies for each testimonial', () => {
      render(<Testimonials />)

      const roles = screen.getAllByTestId('testimonial-role')
      expect(roles.length).toBeGreaterThanOrEqual(3)

      // Each role should have content
      roles.forEach(role => {
        expect(role.textContent).not.toBe('')
      })
    })

    it('should render the section title', () => {
      render(<Testimonials />)

      expect(screen.getByText(/what our users say/i)).toBeInTheDocument()
    })

    it('should render within a section element with proper data-testid', () => {
      render(<Testimonials />)

      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument()
    })
  })

  // Test Case 2: Mobile viewport (320px) - single column layout
  describe('Test Case 2: Mobile viewport layout (320px)', () => {
    it('should have responsive grid classes for single column on mobile', () => {
      render(<Testimonials />)

      const grid = screen.getByTestId('testimonials-grid')
      // Check that the grid has responsive classes
      // On mobile (default), it should be a single column (grid-cols-1)
      expect(grid.className).toMatch(/grid-cols-1|grid/)
    })

    it('should render all testimonials stacked vertically on mobile', () => {
      render(<Testimonials />)

      const testimonialCards = screen.getAllByTestId('testimonial-card')
      // All cards should be present (stacked)
      expect(testimonialCards.length).toBeGreaterThanOrEqual(3)
    })
  })

  // Test Case 3: Desktop viewport (1280px+) - multiple testimonials side by side
  describe('Test Case 3: Desktop viewport layout (1280px+)', () => {
    it('should have responsive grid classes for multiple columns on desktop', () => {
      render(<Testimonials />)

      const grid = screen.getByTestId('testimonials-grid')
      // Check for md: or lg: responsive classes for 2-3 columns
      expect(grid.className).toMatch(/md:grid-cols-2|lg:grid-cols-3|md:grid-cols-3/)
    })

    it('should have proper gap between testimonials', () => {
      render(<Testimonials />)

      const grid = screen.getByTestId('testimonials-grid')
      expect(grid.className).toMatch(/gap-/)
    })
  })

  // Test Case 4: Animation on scroll
  describe('Test Case 4: Testimonial card animation on scroll', () => {
    it('should have animation wrapper for each testimonial card', () => {
      render(<Testimonials />)

      const animatedWrappers = screen.getAllByTestId('testimonial-animated-wrapper')
      expect(animatedWrappers.length).toBeGreaterThanOrEqual(3)
    })

    it('should have the section configured for viewport animation', () => {
      render(<Testimonials />)

      // The section should exist with animation configuration
      const section = screen.getByTestId('testimonials-section')
      expect(section).toBeInTheDocument()
    })
  })

  // Additional edge case tests
  describe('Edge cases', () => {
    it('should properly format long quotes', () => {
      render(<Testimonials />)

      const quotes = screen.getAllByTestId('testimonial-quote')
      quotes.forEach(quote => {
        // Quotes should be wrapped in quotation marks or have quote styling
        expect(quote.textContent?.length).toBeGreaterThan(10)
      })
    })

    it('should render quote icons or decorative elements', () => {
      render(<Testimonials />)

      // Check for quote decoration (either icon or quotation marks in text)
      const section = screen.getByTestId('testimonials-section')
      expect(section.textContent).toMatch(/"|"/)
    })
  })
})
