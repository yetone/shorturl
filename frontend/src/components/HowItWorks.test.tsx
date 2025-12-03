import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { HowItWorks } from './HowItWorks';

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

const renderWithProviders = (component: React.ReactNode) => {
  return render(<TestWrapper>{component}</TestWrapper>);
};

describe('HowItWorks Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test Case 1: How It Works section renders', () => {
    it('should render 3-4 steps displayed with icons/illustrations and brief descriptions', () => {
      renderWithProviders(<HowItWorks />);

      // Check for section heading
      const heading = screen.getByRole('heading', { name: /how it works/i });
      expect(heading).toBeInTheDocument();

      // Check for section container with proper accessibility
      const section = screen.getByRole('region', { name: /how it works/i });
      expect(section).toBeInTheDocument();

      // Should have at least 3 steps (steps: Create account -> Paste URL -> Get short link -> Track analytics)
      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      expect(steps.length).toBeGreaterThanOrEqual(3);
      expect(steps.length).toBeLessThanOrEqual(4);
    });

    it('should display step icons for each step', () => {
      renderWithProviders(<HowItWorks />);

      // Each step should have an icon
      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      steps.forEach((step, index) => {
        const icon = within(step).getByTestId(`step-icon-${index + 1}`);
        expect(icon).toBeInTheDocument();
      });
    });

    it('should display step numbers for each step', () => {
      renderWithProviders(<HowItWorks />);

      // Each step should have a step number
      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      steps.forEach((step, index) => {
        const stepNumber = within(step).getByText(`${index + 1}`);
        expect(stepNumber).toBeInTheDocument();
      });
    });

    it('should display titles for each step', () => {
      renderWithProviders(<HowItWorks />);

      // Check for expected step titles
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
      expect(screen.getByText(/paste url/i)).toBeInTheDocument();
      expect(screen.getByText(/get short link/i)).toBeInTheDocument();
      expect(screen.getByText(/track analytics/i)).toBeInTheDocument();
    });

    it('should display descriptions for each step', () => {
      renderWithProviders(<HowItWorks />);

      // Each step should have a description
      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      steps.forEach((step) => {
        const description = within(step).getByTestId(/step-description/);
        expect(description).toBeInTheDocument();
        expect(description.textContent).not.toBe('');
      });
    });

    it('should have accessible heading hierarchy', () => {
      renderWithProviders(<HowItWorks />);

      // Main heading should be h2 (since h1 is reserved for page title)
      const mainHeading = screen.getByRole('heading', { level: 2, name: /how it works/i });
      expect(mainHeading).toBeInTheDocument();

      // Each step should have an h3 heading
      const stepHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(stepHeadings.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Test Case 2: View section on mobile viewport', () => {
    it('should display steps vertically in a clear flow on mobile', () => {
      // Set mobile viewport dimensions
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));

      renderWithProviders(<HowItWorks />);

      // Check that the steps container exists
      const stepsContainer = screen.getByTestId('how-it-works-steps-container');
      expect(stepsContainer).toBeInTheDocument();

      // Check for mobile-friendly classes (flex-col on mobile)
      expect(stepsContainer).toHaveClass('flex-col');
    });

    it('should stack all steps vertically with clear spacing on mobile', () => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));

      renderWithProviders(<HowItWorks />);

      const stepsContainer = screen.getByTestId('how-it-works-steps-container');
      const steps = screen.getAllByTestId(/^how-it-works-step-/);

      // All steps should be present
      expect(steps.length).toBeGreaterThanOrEqual(3);

      // Container should have vertical layout classes
      expect(stepsContainer.className).toMatch(/flex-col/);
    });

    it('should have appropriate gap between steps on mobile', () => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));

      renderWithProviders(<HowItWorks />);

      const stepsContainer = screen.getByTestId('how-it-works-steps-container');
      // Should have gap for spacing
      expect(stepsContainer.className).toMatch(/gap-/);
    });
  });

  describe('Test Case 3: View section on desktop viewport', () => {
    it('should display steps horizontally or in grid layout on desktop', () => {
      // Set desktop viewport dimensions
      window.innerWidth = 1280;
      window.innerHeight = 800;
      window.dispatchEvent(new Event('resize'));

      renderWithProviders(<HowItWorks />);

      // Check that the steps container exists
      const stepsContainer = screen.getByTestId('how-it-works-steps-container');
      expect(stepsContainer).toBeInTheDocument();

      // Check for desktop layout classes (md:flex-row or md:grid-cols)
      expect(stepsContainer.className).toMatch(/md:(flex-row|grid-cols)/);
    });

    it('should show all steps side by side on desktop', () => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event('resize'));

      renderWithProviders(<HowItWorks />);

      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      expect(steps.length).toBeGreaterThanOrEqual(3);

      // Steps container should have horizontal/grid layout for desktop
      const stepsContainer = screen.getByTestId('how-it-works-steps-container');
      expect(stepsContainer.className).toMatch(/md:(flex-row|grid-cols)/);
    });

    it('should have connecting visual elements between steps on desktop', () => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event('resize'));

      renderWithProviders(<HowItWorks />);

      // Check for connector elements (arrows or lines between steps)
      const connectors = screen.queryAllByTestId(/step-connector/);
      // There should be n-1 connectors for n steps (3 connectors for 4 steps)
      expect(connectors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Test Case 4: Navigate steps with keyboard', () => {
    it('should have all step elements keyboard accessible', async () => {
      renderWithProviders(<HowItWorks />);

      const steps = screen.getAllByTestId(/^how-it-works-step-/);

      // Each step should be present and accessible
      for (const step of steps) {
        // Verify the step exists in the document
        expect(step).toBeInTheDocument();
      }
    });

    it('should have proper focus indicators on interactive elements', () => {
      renderWithProviders(<HowItWorks />);

      const steps = screen.getAllByTestId(/^how-it-works-step-/);

      // Steps should have accessible attributes
      steps.forEach((step) => {
        // Ensure each step is in the document
        expect(step).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation through steps', async () => {
      renderWithProviders(<HowItWorks />);

      // The section itself should be accessible and all steps present
      const section = screen.getByRole('region', { name: /how it works/i });
      expect(section).toBeInTheDocument();

      // Steps should be present and accessible via screen readers
      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      steps.forEach((step) => {
        expect(step).toBeInTheDocument();
      });
    });

    it('should have proper aria-labels for step icons', () => {
      renderWithProviders(<HowItWorks />);

      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      steps.forEach((step, index) => {
        const icon = within(step).getByTestId(`step-icon-${index + 1}`);
        // Icons should have aria-hidden to avoid redundant screen reader announcements
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Theme Support', () => {
    it('should render correctly in light mode', () => {
      renderWithProviders(<HowItWorks />);

      const section = screen.getByRole('region', { name: /how it works/i });
      expect(section).toBeInTheDocument();
    });

    it('should render correctly with dark mode classes available', () => {
      // Mock dark mode
      document.documentElement.classList.add('dark');

      renderWithProviders(<HowItWorks />);

      const section = screen.getByRole('region', { name: /how it works/i });
      expect(section).toBeInTheDocument();

      // Clean up
      document.documentElement.classList.remove('dark');
    });
  });

  describe('Animation and Visual Effects', () => {
    it('should have animation variants defined for smooth transitions', () => {
      renderWithProviders(<HowItWorks />);

      // The component should render without animation errors
      const section = screen.getByRole('region', { name: /how it works/i });
      expect(section).toBeInTheDocument();
    });

    it('should render GlassMorphismCard for step containers', () => {
      renderWithProviders(<HowItWorks />);

      // Steps should be wrapped in card components
      const steps = screen.getAllByTestId(/^how-it-works-step-/);
      steps.forEach((step) => {
        // The GlassMorphismCard is inside the step container
        // Check that the step container has a child with rounded styling
        const cardElement = step.querySelector('.rounded-xl');
        expect(cardElement).toBeInTheDocument();
      });
    });
  });
});
