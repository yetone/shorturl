import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FuturisticButton } from './FuturisticButton';

describe('FuturisticButton', () => {
  it('renders children correctly', () => {
    render(<FuturisticButton>Get Started</FuturisticButton>);
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('renders with default variant and size', () => {
    render(<FuturisticButton>Click Me</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('renders with neon variant for CTA buttons', () => {
    render(<FuturisticButton variant="neon" size="lg">Get Started</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Get Started' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gradient-to-r', 'from-indigo-500', 'to-purple-600');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('renders with outline variant for secondary buttons', () => {
    render(<FuturisticButton variant="outline" size="lg">Login</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Login' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('border-2', 'border-indigo-500', 'bg-transparent');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<FuturisticButton onClick={handleClick}>Click Me</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    render(<FuturisticButton disabled>Disabled</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<FuturisticButton disabled onClick={handleClick}>Disabled</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<FuturisticButton className="custom-class">Custom</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('custom-class');
  });

  it('renders as submit button when type is submit', () => {
    render(<FuturisticButton type="submit">Submit</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders small size variant', () => {
    render(<FuturisticButton size="sm">Small</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('renders ghost variant', () => {
    render(<FuturisticButton variant="ghost">Ghost</FuturisticButton>);
    const button = screen.getByRole('button', { name: 'Ghost' });
    expect(button).toHaveClass('bg-transparent', 'text-indigo-500');
  });
});
