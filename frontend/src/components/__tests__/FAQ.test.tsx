import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FAQ } from '../FAQ'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, onKeyDown, role, tabIndex, 'aria-expanded': ariaExpanded, ...props }: React.HTMLAttributes<HTMLDivElement> & { 'aria-expanded'?: boolean }) => (
      <div className={className} onClick={onClick} onKeyDown={onKeyDown} role={role} tabIndex={tabIndex} aria-expanded={ariaExpanded} {...props}>{children}</div>
    ),
    h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    section: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <section className={className} {...props}>{children}</section>
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

describe('FAQ Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test Case 1: FAQ section renders on page with 5-8 FAQ items displayed in collapsed state
  describe('Test Case 1: FAQ section renders with 5-8 items in collapsed state', () => {
    it('should render the FAQ section', () => {
      render(<FAQ />)

      expect(screen.getByTestId('faq-section')).toBeInTheDocument()
    })

    it('should render a section title', () => {
      render(<FAQ />)

      expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument()
    })

    it('should display between 5-8 FAQ items', () => {
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      expect(faqItems.length).toBeGreaterThanOrEqual(5)
      expect(faqItems.length).toBeLessThanOrEqual(8)
    })

    it('should display all FAQ items in collapsed state initially', () => {
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      faqItems.forEach(item => {
        const button = within(item).getByRole('button')
        expect(button).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('should display question text for each FAQ item', () => {
      render(<FAQ />)

      const faqQuestions = screen.getAllByTestId('faq-question')
      expect(faqQuestions.length).toBeGreaterThanOrEqual(5)

      faqQuestions.forEach(question => {
        expect(question.textContent).not.toBe('')
        expect(question.textContent!.length).toBeGreaterThan(10)
      })
    })

    it('should hide answers in collapsed state', () => {
      render(<FAQ />)

      const faqAnswers = screen.queryAllByTestId('faq-answer')
      // Answers should either not be rendered or have hidden styling
      // Since we use AnimatePresence, collapsed answers may not be in DOM
      const visibleAnswers = faqAnswers.filter(answer => {
        const styles = window.getComputedStyle(answer)
        return styles.display !== 'none' && styles.visibility !== 'hidden'
      })

      // All answers should be hidden initially (AnimatePresence removes them from DOM)
      expect(visibleAnswers.length).toBe(0)
    })
  })

  // Test Case 2: Click on collapsed FAQ item expands with smooth animation to show answer
  describe('Test Case 2: Click on collapsed FAQ item expands to show answer', () => {
    it('should expand a collapsed FAQ item when clicked', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const firstItem = faqItems[0]
      const button = within(firstItem).getByRole('button')

      expect(button).toHaveAttribute('aria-expanded', 'false')

      await user.click(button)

      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('should show answer content when FAQ item is expanded', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const firstItem = faqItems[0]
      const button = within(firstItem).getByRole('button')

      await user.click(button)

      const answer = within(firstItem).getByTestId('faq-answer')
      expect(answer).toBeInTheDocument()
      expect(answer.textContent).not.toBe('')
    })

    it('should have animation wrapper for expand animation', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const firstItem = faqItems[0]
      const button = within(firstItem).getByRole('button')

      await user.click(button)

      const animatedWrapper = within(firstItem).getByTestId('faq-answer-wrapper')
      expect(animatedWrapper).toBeInTheDocument()
    })
  })

  // Test Case 3: Click on expanded FAQ item collapses with smooth animation
  describe('Test Case 3: Click on expanded FAQ item collapses it', () => {
    it('should collapse an expanded FAQ item when clicked again', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const firstItem = faqItems[0]
      const button = within(firstItem).getByRole('button')

      // Expand the item
      await user.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Collapse the item
      await user.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should hide the answer when FAQ item is collapsed', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const firstItem = faqItems[0]
      const button = within(firstItem).getByRole('button')

      // Expand then collapse
      await user.click(button)
      await user.click(button)

      // Answer should no longer be visible
      const answer = within(firstItem).queryByTestId('faq-answer')
      expect(answer).not.toBeInTheDocument()
    })
  })

  // Test Case 4: Expand multiple FAQ items - multiple items can be expanded simultaneously
  describe('Test Case 4: Multiple FAQ items can be expanded simultaneously', () => {
    it('should allow multiple FAQ items to be expanded at the same time', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const firstButton = within(faqItems[0]).getByRole('button')
      const secondButton = within(faqItems[1]).getByRole('button')
      const thirdButton = within(faqItems[2]).getByRole('button')

      // Expand first item
      await user.click(firstButton)
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')

      // Expand second item
      await user.click(secondButton)
      expect(secondButton).toHaveAttribute('aria-expanded', 'true')

      // First item should still be expanded
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')

      // Expand third item
      await user.click(thirdButton)
      expect(thirdButton).toHaveAttribute('aria-expanded', 'true')

      // All three should still be expanded
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
      expect(secondButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should show answers for all expanded items', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')

      // Expand first three items
      await user.click(within(faqItems[0]).getByRole('button'))
      await user.click(within(faqItems[1]).getByRole('button'))

      // Both should have visible answers
      expect(within(faqItems[0]).getByTestId('faq-answer')).toBeInTheDocument()
      expect(within(faqItems[1]).getByTestId('faq-answer')).toBeInTheDocument()
    })
  })

  // Test Case 5: Navigate FAQ with keyboard (Enter/Space) - manual test in scenario, but we can test keyboard interaction
  describe('Test Case 5: FAQ items can be expanded/collapsed using keyboard', () => {
    it('should have proper keyboard accessibility attributes', () => {
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      faqItems.forEach(item => {
        const button = within(item).getByRole('button')
        // Button should be focusable
        expect(button).toHaveAttribute('tabIndex', '0')
      })
    })

    it('should expand FAQ item when Enter key is pressed', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const firstButton = within(faqItems[0]).getByRole('button')

      // Focus and press Enter
      firstButton.focus()
      await user.keyboard('{Enter}')

      expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should expand FAQ item when Space key is pressed', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const secondButton = within(faqItems[1]).getByRole('button')

      // Focus and press Space
      secondButton.focus()
      await user.keyboard(' ')

      expect(secondButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should collapse expanded FAQ item when Enter key is pressed again', async () => {
      const user = userEvent.setup()
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      const firstButton = within(faqItems[0]).getByRole('button')

      // Expand with Enter
      firstButton.focus()
      await user.keyboard('{Enter}')
      expect(firstButton).toHaveAttribute('aria-expanded', 'true')

      // Collapse with Enter
      await user.keyboard('{Enter}')
      expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  // Test Case 6: FAQ content includes required topics (pricing, link expiration, analytics features, security)
  describe('Test Case 6: FAQ content includes required topics', () => {
    it('should have a question about pricing', () => {
      render(<FAQ />)

      const faqSection = screen.getByTestId('faq-section')
      expect(faqSection.textContent?.toLowerCase()).toMatch(/pric|cost|free|pay|plan/)
    })

    it('should have a question about link expiration', () => {
      render(<FAQ />)

      const faqSection = screen.getByTestId('faq-section')
      expect(faqSection.textContent?.toLowerCase()).toMatch(/expir|expire|how long|permanent|lifetime/)
    })

    it('should have a question about analytics features', () => {
      render(<FAQ />)

      const faqSection = screen.getByTestId('faq-section')
      expect(faqSection.textContent?.toLowerCase()).toMatch(/analytic|track|stat|click|insight/)
    })

    it('should have a question about security', () => {
      render(<FAQ />)

      const faqSection = screen.getByTestId('faq-section')
      expect(faqSection.textContent?.toLowerCase()).toMatch(/secur|safe|protect|privacy|data/)
    })

    it('should have all required topics covered in FAQ content', () => {
      render(<FAQ />)

      const faqSection = screen.getByTestId('faq-section')
      const content = faqSection.textContent?.toLowerCase() || ''

      // Check all required topics are present
      const hasPricing = /pric|cost|free|pay|plan/.test(content)
      const hasExpiration = /expir|expire|how long|permanent|lifetime/.test(content)
      const hasAnalytics = /analytic|track|stat|click|insight/.test(content)
      const hasSecurity = /secur|safe|protect|privacy|data/.test(content)

      expect(hasPricing).toBe(true)
      expect(hasExpiration).toBe(true)
      expect(hasAnalytics).toBe(true)
      expect(hasSecurity).toBe(true)
    })
  })

  // Additional edge case tests
  describe('Edge cases and accessibility', () => {
    it('should have proper ARIA attributes for accordion behavior', () => {
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      faqItems.forEach(item => {
        const button = within(item).getByRole('button')
        expect(button).toHaveAttribute('aria-expanded')
      })
    })

    it('should have expand/collapse icon indicator', () => {
      render(<FAQ />)

      const faqItems = screen.getAllByTestId('faq-item')
      faqItems.forEach(item => {
        const icon = within(item).getByTestId('faq-icon')
        expect(icon).toBeInTheDocument()
      })
    })

    it('should render within a section element for semantic HTML', () => {
      render(<FAQ />)

      const faqSection = screen.getByTestId('faq-section')
      expect(faqSection.tagName.toLowerCase()).toBe('section')
    })

    it('should have responsive grid classes', () => {
      render(<FAQ />)

      const container = screen.getByTestId('faq-container')
      expect(container.className).toMatch(/max-w-/)
    })
  })
})
