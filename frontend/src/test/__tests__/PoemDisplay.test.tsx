import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PoemDisplay } from '../../components/PoemDisplay';

describe('PoemDisplay Component', () => {
  it('should render without errors', () => {
    render(<PoemDisplay />);
    // The component should render successfully
    expect(document.body).toBeTruthy();
  });

  it('should display poem content', () => {
    render(<PoemDisplay />);
    // Look for poem-related content in the rendered output
    const poemElement = screen.getByTestId('poem-content');
    expect(poemElement).toBeInTheDocument();
    expect(poemElement.textContent).not.toBe('');
  });

  it('should display the poem title', () => {
    render(<PoemDisplay />);
    // Look for the poem title
    const titleElement = screen.getByTestId('poem-title');
    expect(titleElement).toBeInTheDocument();
  });

  it('should render poem lines with proper formatting', () => {
    render(<PoemDisplay />);
    const poemContent = screen.getByTestId('poem-content');
    // The poem content should contain multiple text elements (lines)
    expect(poemContent.innerHTML).toContain('<');
  });

  it('should accept custom poem prop and display it', () => {
    const customPoem = 'Custom poem line one\nCustom poem line two';
    render(<PoemDisplay poem={customPoem} />);
    const poemContent = screen.getByTestId('poem-content');
    expect(poemContent.textContent).toContain('Custom poem line one');
    expect(poemContent.textContent).toContain('Custom poem line two');
  });

  it('should accept custom title prop', () => {
    const customTitle = 'My Custom Poem Title';
    render(<PoemDisplay title={customTitle} />);
    const titleElement = screen.getByTestId('poem-title');
    expect(titleElement.textContent).toBe(customTitle);
  });
});
