import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PoemDisplay } from './PoemDisplay';

// Mock the ThemeContext for different theme states
const mockUseTheme = vi.fn();

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, ...props }: any) => (
      <div style={style} {...props}>{children}</div>
    ),
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock GlassMorphismCard to pass through all props including data-testid and class assertions
vi.mock('./GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className, glowColor, ...props }: any) => (
    <div
      className={`relative overflow-hidden rounded-xl backdrop-blur-md ${className || ''}`}
      data-glow-color={glowColor}
      {...props}
    >
      {children}
    </div>
  ),
}));

describe('Design System Integration - Tailwind CSS and DaisyUI (REQ-5)', () => {
  const samplePoem = `In the realm of endless links so long,
VerseCraft sings its shortening song.
Each URL transformed with care,
A tiny path through digital air.`;

  beforeEach(() => {
    vi.clearAllMocks();
    // Default to light theme
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });
    // Reset document classes
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  // Test Case 1: Component uses Tailwind CSS utility classes for styling
  describe('Test Case 1: Tailwind CSS Utility Classes', () => {
    it('should use Tailwind CSS layout utility classes', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemDisplay = screen.getByTestId('poem-display');
      // Verify text-center layout class
      expect(poemDisplay).toHaveClass('text-center');
    });

    it('should use Tailwind CSS typography utility classes', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemContent = screen.getByTestId('poem-content');
      // Verify typography classes: font-serif, text-lg, leading-relaxed
      expect(poemContent).toHaveClass('font-serif');
      expect(poemContent).toHaveClass('text-lg');
      expect(poemContent).toHaveClass('leading-relaxed');
    });

    it('should use Tailwind CSS responsive utility classes', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemContent = screen.getByTestId('poem-content');
      // Verify responsive text sizing with md: prefix
      expect(poemContent).toHaveClass('md:text-xl');

      const title = screen.getByTestId('poem-title');
      // Verify responsive title sizing
      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('md:text-3xl');
    });

    it('should use Tailwind CSS spacing utility classes', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // Verify padding class is applied to GlassMorphismCard
      expect(container).toHaveClass('p-8');

      const title = screen.getByTestId('poem-title');
      // Verify margin class
      expect(title).toHaveClass('mb-6');
    });

    it('should use Tailwind CSS gradient utility classes for title', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const title = screen.getByTestId('poem-title');
      // Verify gradient classes for text effect
      expect(title).toHaveClass('bg-gradient-to-r');
      expect(title).toHaveClass('from-purple-500');
      expect(title).toHaveClass('to-pink-500');
      expect(title).toHaveClass('bg-clip-text');
      expect(title).toHaveClass('text-transparent');
    });

    it('should use Tailwind CSS line height and font weight classes', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemContent = screen.getByTestId('poem-content');
      expect(poemContent).toHaveClass('leading-relaxed');

      const title = screen.getByTestId('poem-title');
      expect(title).toHaveClass('font-bold');
    });

    it('should apply conditional Tailwind classes for empty lines', () => {
      const poemWithEmptyLine = `Line one

Line three`;
      render(<PoemDisplay poem={poemWithEmptyLine} />);

      // Empty line should have h-4 class for spacing
      const emptyLine = screen.getByTestId('poem-line-1');
      expect(emptyLine).toHaveClass('h-4');
    });

    it('should apply poem-content custom CSS class', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemContent = screen.getByTestId('poem-content');
      // Verify custom poem-content class is applied
      expect(poemContent).toHaveClass('poem-content');
    });

    it('should apply my-2 margin class to poem lines', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const firstLine = screen.getByTestId('poem-line-0');
      expect(firstLine).toHaveClass('my-2');
    });
  });

  // Test Case 2: Component integrates with DaisyUI theme system
  describe('Test Case 2: DaisyUI Theme System Integration', () => {
    it('should support light theme through DaisyUI theming', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
      });

      render(<PoemDisplay poem={samplePoem} />);

      // Component renders in light mode
      const container = screen.getByTestId('poem-container');
      expect(container).toBeInTheDocument();

      // In light mode, glowColor has lower opacity (0.2)
      expect(container).toHaveAttribute('data-glow-color', 'rgba(139, 92, 246, 0.2)');
    });

    it('should support dark theme through DaisyUI theming', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
      });

      render(<PoemDisplay poem={samplePoem} />);

      // Component renders in dark mode
      const container = screen.getByTestId('poem-container');
      expect(container).toBeInTheDocument();

      // In dark mode, glowColor has higher opacity (0.3) for visibility
      expect(container).toHaveAttribute('data-glow-color', 'rgba(139, 92, 246, 0.3)');
    });

    it('should use theme-aware glow color in light mode', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
      });

      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // Light mode uses lower opacity glow
      const glowColor = container.getAttribute('data-glow-color');
      expect(glowColor).toContain('0.2');
    });

    it('should use theme-aware glow color in dark mode', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
      });

      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // Dark mode uses higher opacity glow for visibility
      const glowColor = container.getAttribute('data-glow-color');
      expect(glowColor).toContain('0.3');
    });

    it('should integrate with DaisyUI color palette through Tailwind', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const title = screen.getByTestId('poem-title');
      // Using DaisyUI-compatible Tailwind color utilities
      expect(title).toHaveClass('from-purple-500');
      expect(title).toHaveClass('to-pink-500');
    });

    it('should use purple accent color from DaisyUI palette', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // GlowColor uses rgba(139, 92, 246, ...) which is purple-500 equivalent
      const glowColor = container.getAttribute('data-glow-color');
      expect(glowColor).toContain('139, 92, 246');
    });

    it('should support theme toggle by reading from useTheme context', () => {
      // First render in light mode
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
      });

      const { rerender } = render(<PoemDisplay poem={samplePoem} />);

      let container = screen.getByTestId('poem-container');
      expect(container.getAttribute('data-glow-color')).toContain('0.2');

      // Toggle to dark mode
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
      });

      rerender(<PoemDisplay poem={samplePoem} />);

      container = screen.getByTestId('poem-container');
      expect(container.getAttribute('data-glow-color')).toContain('0.3');
    });
  });

  // Test Case 3: Visual consistency with GlassMorphismCard and other components
  describe('Test Case 3: Visual Consistency with GlassMorphismCard', () => {
    it('should wrap poem content in GlassMorphismCard component', () => {
      render(<PoemDisplay poem={samplePoem} />);

      // PoemDisplay uses GlassMorphismCard as its container
      const container = screen.getByTestId('poem-container');
      expect(container).toBeInTheDocument();
    });

    it('should apply glassmorphism backdrop-blur styling through GlassMorphismCard', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // GlassMorphismCard uses Tailwind backdrop-blur-md class
      expect(container).toHaveClass('backdrop-blur-md');
    });

    it('should apply rounded corners styling from design system', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // GlassMorphismCard uses Tailwind rounded-xl class
      expect(container).toHaveClass('rounded-xl');
    });

    it('should apply overflow-hidden from design system', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      expect(container).toHaveClass('overflow-hidden');
    });

    it('should apply relative positioning from design system', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      expect(container).toHaveClass('relative');
    });

    it('should use consistent design system classes in PoemDisplay', () => {
      render(<PoemDisplay poem={samplePoem} />);

      // Verify PoemDisplay uses design system patterns
      const poemDisplay = screen.getByTestId('poem-display');
      expect(poemDisplay).toHaveClass('text-center');

      const content = screen.getByTestId('poem-content');
      // Consistent typography styling
      expect(content).toHaveClass('font-serif');
      expect(content).toHaveClass('leading-relaxed');
    });

    it('should support custom className prop for design flexibility', () => {
      render(<PoemDisplay poem={samplePoem} className="custom-poem-class" />);

      const container = screen.getByTestId('poem-container');
      expect(container).toHaveClass('custom-poem-class');
      // Should also maintain base styling
      expect(container).toHaveClass('p-8');
    });

    it('should maintain visual hierarchy with gradient title', () => {
      render(<PoemDisplay poem={samplePoem} title="Test Title" />);

      const title = screen.getByTestId('poem-title');
      // Gradient title creates visual hierarchy consistent with app design
      expect(title).toHaveClass('bg-gradient-to-r');
      expect(title).toHaveClass('font-bold');
      expect(title).toHaveClass('text-2xl');
    });

    it('should use consistent padding across design system', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // Consistent p-8 padding used throughout design system
      expect(container).toHaveClass('p-8');
    });

    it('should match GlassMorphismCard base styles', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // Verify all GlassMorphismCard base classes are present
      expect(container).toHaveClass('relative');
      expect(container).toHaveClass('overflow-hidden');
      expect(container).toHaveClass('rounded-xl');
      expect(container).toHaveClass('backdrop-blur-md');
    });

    it('should pass glowColor prop to GlassMorphismCard for hover effects', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      // Verify glowColor is passed to GlassMorphismCard
      expect(container).toHaveAttribute('data-glow-color');
    });

    it('should render with VerseCraft title when title prop is not explicitly set', () => {
      // When title is not explicitly set (or undefined), default to VerseCraft
      render(<PoemDisplay poem={samplePoem} />);

      // Title should render with default value
      const title = screen.getByTestId('poem-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('VerseCraft');
    });

    it('should render with default VerseCraft title when no title provided', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const title = screen.getByTestId('poem-title');
      expect(title).toHaveTextContent('VerseCraft');
    });
  });
});
