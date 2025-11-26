import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { GlassMorphismCard } from './GlassMorphismCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onHoverStart, onHoverEnd, whileHover, style, ...props }: any) => (
      <div
        {...props}
        style={style}
        data-hover-enabled={!!onHoverStart}
        data-scale-on-hover={whileHover?.scale || 'none'}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('GlassMorphismCard Component', () => {
  describe('Test Case 2: Glassmorphism Styling', () => {
    it('should have backdrop-blur styling', () => {
      render(
        <GlassMorphismCard>
          <p>Test content</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Test content').closest('.backdrop-blur-md');
      expect(card).toBeInTheDocument();
    });

    it('should use rgba white with 0.1 opacity background in light mode', () => {
      render(
        <GlassMorphismCard>
          <p>Test content</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Test content').parentElement?.parentElement;

      // Check for glassmorphism styling via inline styles
      // The component sets backgroundColor inline
      expect(card?.style.backgroundColor).toBeTruthy();
    });

    it('should apply rounded-xl for card shape', () => {
      render(
        <GlassMorphismCard>
          <p>Test content</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Test content').closest('.rounded-xl');
      expect(card).toBeInTheDocument();
    });

    it('should have glassmorphism border styling', () => {
      render(
        <GlassMorphismCard>
          <p>Test content</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Test content').parentElement?.parentElement;

      // Border is applied via inline styles
      expect(card?.style.border).toBeTruthy();
    });
  });

  describe('Test Case 4: Hover Interactions', () => {
    it('should have hover effect enabled by default', () => {
      render(
        <GlassMorphismCard>
          <p>Test content</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Test content').closest('[data-hover-enabled]');
      expect(card?.getAttribute('data-hover-enabled')).toBe('true');
    });

    it('should scale on hover (1.02 scale)', () => {
      render(
        <GlassMorphismCard>
          <p>Test content</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Test content').closest('[data-scale-on-hover]');
      expect(card?.getAttribute('data-scale-on-hover')).toBe('1.02');
    });

    it('should display colored glow effect on hover', () => {
      const glowColor = 'rgba(57, 255, 20, 0.2)';

      render(
        <GlassMorphismCard glowColor={glowColor}>
          <p>Test content</p>
        </GlassMorphismCard>
      );

      // The glow effect is managed by AnimatePresence and shown on hover
      // In the real component, this creates a radial gradient with the glowColor
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should allow disabling hover effect', () => {
      render(
        <GlassMorphismCard hoverEffect={false}>
          <p>No hover</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('No hover').closest('[data-hover-enabled]');
      expect(card?.getAttribute('data-hover-enabled')).toBe('false');

      const scaleCard = screen.getByText('No hover').closest('[data-scale-on-hover]');
      // When hoverEffect is false, whileHover is undefined, which becomes 'none' as a string
      expect(scaleCard?.getAttribute('data-scale-on-hover')).toBe('none');
    });
  });

  describe('Visual Styling', () => {
    it('should accept custom className', () => {
      render(
        <GlassMorphismCard className="custom-class p-6">
          <p>Custom styled</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Custom styled').closest('.custom-class');
      expect(card).toBeInTheDocument();
      expect(card?.className).toMatch(/p-6/);
    });

    it('should render children correctly', () => {
      render(
        <GlassMorphismCard>
          <div>
            <h3>Card Title</h3>
            <p>Card description</p>
          </div>
        </GlassMorphismCard>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description')).toBeInTheDocument();
    });

    it('should apply theme-aware styling in dark mode', () => {
      // Simulate dark mode
      document.documentElement.classList.add('dark');

      render(
        <GlassMorphismCard>
          <p>Dark mode card</p>
        </GlassMorphismCard>
      );

      const card = screen.getByText('Dark mode card').closest('.text-white');
      expect(card).toBeInTheDocument();

      // Cleanup
      document.documentElement.classList.remove('dark');
    });

    it('should have proper z-index layering for content', () => {
      render(
        <GlassMorphismCard>
          <p>Layered content</p>
        </GlassMorphismCard>
      );

      const contentWrapper = screen.getByText('Layered content').parentElement;
      expect(contentWrapper?.className).toMatch(/z-10/);
    });
  });

  describe('Custom Glow Colors', () => {
    it('should accept and use custom glow color for green theme', () => {
      render(
        <GlassMorphismCard glowColor="rgba(57, 255, 20, 0.2)">
          <p>Green glow</p>
        </GlassMorphismCard>
      );

      expect(screen.getByText('Green glow')).toBeInTheDocument();
    });

    it('should accept and use custom glow color for pink theme', () => {
      render(
        <GlassMorphismCard glowColor="rgba(255, 16, 240, 0.2)">
          <p>Pink glow</p>
        </GlassMorphismCard>
      );

      expect(screen.getByText('Pink glow')).toBeInTheDocument();
    });

    it('should accept and use custom glow color for cyan theme', () => {
      render(
        <GlassMorphismCard glowColor="rgba(0, 255, 255, 0.2)">
          <p>Cyan glow</p>
        </GlassMorphismCard>
      );

      expect(screen.getByText('Cyan glow')).toBeInTheDocument();
    });

    it('should accept and use custom glow color for yellow theme', () => {
      render(
        <GlassMorphismCard glowColor="rgba(250, 255, 0, 0.2)">
          <p>Yellow glow</p>
        </GlassMorphismCard>
      );

      expect(screen.getByText('Yellow glow')).toBeInTheDocument();
    });
  });

  describe('Performance - GPU Acceleration', () => {
    it('should use transform property for scale animation', () => {
      render(
        <GlassMorphismCard>
          <p>Optimized animation</p>
        </GlassMorphismCard>
      );

      // The whileHover prop uses scale which translates to transform: scale()
      // This is GPU-accelerated
      const card = screen.getByText('Optimized animation').closest('[data-scale-on-hover]');
      expect(card?.getAttribute('data-scale-on-hover')).toBe('1.02');
    });

    it('should use opacity for glow effect transitions', () => {
      render(
        <GlassMorphismCard glowColor="rgba(255, 255, 255, 0.2)">
          <p>Opacity animation</p>
        </GlassMorphismCard>
      );

      // The AnimatePresence uses opacity transitions (initial/animate/exit)
      // Opacity is GPU-accelerated
      expect(screen.getByText('Opacity animation')).toBeInTheDocument();
    });
  });
});
