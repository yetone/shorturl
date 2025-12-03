import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PoemDisplay } from './PoemDisplay';

// Mock the ThemeContext
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock GlassMorphismCard to pass through all props including data-testid
vi.mock('./GlassMorphismCard', () => ({
  GlassMorphismCard: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe('PoemDisplay Component', () => {
  const samplePoem = `In the realm of endless links so long,
VerseCraft sings its shortening song.
Each URL transformed with care,
A tiny path through digital air.`;

  const multiLinePoem = `Line one of the poem
Line two of the poem

Line four after empty line
Line five of the poem`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: Render poem component in the DOM - Poem text is visible and readable
  describe('Test Case 1: Render poem in DOM', () => {
    it('should render the poem text visible and readable in the UI', () => {
      render(<PoemDisplay poem={samplePoem} />);

      // Check that the poem container is rendered
      const poemContainer = screen.getByTestId('poem-container');
      expect(poemContainer).toBeInTheDocument();

      // Check that poem display wrapper is present
      const poemDisplay = screen.getByTestId('poem-display');
      expect(poemDisplay).toBeInTheDocument();

      // Check that poem content is visible
      const poemContent = screen.getByTestId('poem-content');
      expect(poemContent).toBeInTheDocument();

      // Check that the poem text is readable
      expect(screen.getByText(/In the realm of endless links so long,/)).toBeInTheDocument();
      expect(screen.getByText(/VerseCraft sings its shortening song./)).toBeInTheDocument();
    });

    it('should render with a title when provided', () => {
      render(<PoemDisplay poem={samplePoem} title="URL Shortening Poem" />);

      const title = screen.getByTestId('poem-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('URL Shortening Poem');
    });

    it('should render with default title when no title is provided', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const title = screen.getByTestId('poem-title');
      expect(title).toHaveTextContent('VerseCraft');
    });
  });

  // Test Case 2: Multi-line content - Line breaks preserved
  describe('Test Case 2: Multi-line content with preserved line breaks', () => {
    it('should preserve and display line breaks correctly', () => {
      render(<PoemDisplay poem={multiLinePoem} />);

      const poemContent = screen.getByTestId('poem-content');
      expect(poemContent).toBeInTheDocument();

      // Check each line is rendered as a separate paragraph
      expect(screen.getByTestId('poem-line-0')).toHaveTextContent('Line one of the poem');
      expect(screen.getByTestId('poem-line-1')).toHaveTextContent('Line two of the poem');
      expect(screen.getByTestId('poem-line-2')).toBeInTheDocument(); // Empty line
      expect(screen.getByTestId('poem-line-3')).toHaveTextContent('Line four after empty line');
      expect(screen.getByTestId('poem-line-4')).toHaveTextContent('Line five of the poem');
    });

    it('should render empty lines with non-breaking space for spacing', () => {
      render(<PoemDisplay poem={multiLinePoem} />);

      // Empty line should have h-4 class for spacing
      const emptyLine = screen.getByTestId('poem-line-2');
      expect(emptyLine).toHaveClass('h-4');
    });

    it('should render each line of the poem as a separate element', () => {
      const lines = samplePoem.split('\n');
      render(<PoemDisplay poem={samplePoem} />);

      lines.forEach((_, index) => {
        expect(screen.getByTestId(`poem-line-${index}`)).toBeInTheDocument();
      });
    });
  });

  // Test Case 3: Centered text and typography styling
  describe('Test Case 3: Centered text and typography styling', () => {
    it('should have centered text alignment', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemDisplay = screen.getByTestId('poem-display');
      expect(poemDisplay).toHaveClass('text-center');
    });

    it('should use appropriate typography styling with serif font', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemContent = screen.getByTestId('poem-content');
      expect(poemContent).toHaveClass('font-serif');
    });

    it('should have responsive text sizing', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemContent = screen.getByTestId('poem-content');
      expect(poemContent).toHaveClass('text-lg');
      expect(poemContent).toHaveClass('md:text-xl');
    });

    it('should have appropriate line height for readability', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const poemContent = screen.getByTestId('poem-content');
      expect(poemContent).toHaveClass('leading-relaxed');
    });

    it('should have title with gradient styling', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const title = screen.getByTestId('poem-title');
      expect(title).toHaveClass('bg-gradient-to-r');
      expect(title).toHaveClass('from-purple-500');
      expect(title).toHaveClass('to-pink-500');
      expect(title).toHaveClass('bg-clip-text');
      expect(title).toHaveClass('text-transparent');
    });

    it('should apply custom className when provided', () => {
      render(<PoemDisplay poem={samplePoem} className="custom-class" />);

      const container = screen.getByTestId('poem-container');
      expect(container).toHaveClass('custom-class');
    });

    it('should have padding applied to container', () => {
      render(<PoemDisplay poem={samplePoem} />);

      const container = screen.getByTestId('poem-container');
      expect(container).toHaveClass('p-8');
    });
  });
});
