import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { PoemDisplay } from '../../components/PoemDisplay';
import { generatePoem } from '../../utils/poemGenerator';

// Integration component that simulates triggering poem generation
function PoemGeneratorPage() {
  const [poem, setPoem] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGeneratePoem = () => {
    const generatedPoem = generatePoem();
    setPoem(generatedPoem);
    setIsGenerated(true);
  };

  return (
    <div data-testid="poem-generator-page">
      <h1>VerseCraft: Poetic Product Narratives</h1>

      <button
        data-testid="generate-poem-button"
        onClick={handleGeneratePoem}
      >
        Generate Poem
      </button>

      {isGenerated && poem && (
        <div data-testid="poem-display-wrapper">
          <PoemDisplay poem={poem} title="Your Generated Poem" />
        </div>
      )}
    </div>
  );
}

describe('Poem Generation Integration', () => {
  it('should generate and display a poem when user triggers poem generation action', () => {
    render(<PoemGeneratorPage />);

    // Step 1: User navigates to poem generation feature (page is rendered)
    const page = screen.getByTestId('poem-generator-page');
    expect(page).toBeInTheDocument();

    // Step 2: User triggers poem generation
    const generateButton = screen.getByTestId('generate-poem-button');
    fireEvent.click(generateButton);

    // Step 3: Verify poem is displayed
    const poemWrapper = screen.getByTestId('poem-display-wrapper');
    expect(poemWrapper).toBeInTheDocument();

    const poemContent = screen.getByTestId('poem-content');
    expect(poemContent).toBeInTheDocument();
    expect(poemContent.textContent).not.toBe('');

    // Verify the poem describes URL shortening product purpose and value
    const poemText = poemContent.textContent?.toLowerCase() || '';
    const urlShortenerKeywords = ['link', 'url', 'short', 'click', 'path', 'journey', 'connect', 'share', 'digital', 'analytics', 'track'];
    const hasRelevantContent = urlShortenerKeywords.some(keyword => poemText.includes(keyword));
    expect(hasRelevantContent).toBe(true);
  });

  it('should display poem title after generation', () => {
    render(<PoemGeneratorPage />);

    const generateButton = screen.getByTestId('generate-poem-button');
    fireEvent.click(generateButton);

    const poemTitle = screen.getByTestId('poem-title');
    expect(poemTitle).toBeInTheDocument();
    expect(poemTitle.textContent).toBe('Your Generated Poem');
  });

  it('should be able to generate multiple poems by clicking the button again', () => {
    render(<PoemGeneratorPage />);

    const generateButton = screen.getByTestId('generate-poem-button');

    // First generation
    fireEvent.click(generateButton);
    const firstPoemContent = screen.getByTestId('poem-content').textContent;
    expect(firstPoemContent).not.toBe('');

    // Second generation - poem should still be displayed (content may be same or different)
    fireEvent.click(generateButton);
    const secondPoemContent = screen.getByTestId('poem-content').textContent;
    expect(secondPoemContent).not.toBe('');
  });
});
