import { describe, it, expect } from 'vitest';
import { generatePoem, getPoemLines } from '../../utils/poemGenerator';

describe('Poem Generation Function', () => {
  describe('generatePoem', () => {
    it('should return a string containing poem text', () => {
      const poem = generatePoem();
      expect(typeof poem).toBe('string');
      expect(poem.length).toBeGreaterThan(0);
    });

    it('should generate a poem that describes URL shortening product purpose', () => {
      const poem = generatePoem();
      const poemLower = poem.toLowerCase();

      // The poem should contain keywords related to URL shortening
      const relevantKeywords = ['link', 'url', 'short', 'click', 'path', 'journey', 'connect', 'share', 'digital', 'analytics', 'track'];
      const hasRelevantContent = relevantKeywords.some(keyword => poemLower.includes(keyword));

      expect(hasRelevantContent).toBe(true);
    });

    it('should generate a poem with multiple lines', () => {
      const poem = generatePoem();
      const lines = poem.split('\n').filter(line => line.trim() !== '');
      expect(lines.length).toBeGreaterThan(3);
    });

    it('should generate a coherent structured poem', () => {
      const poem = generatePoem();
      // Poem should have some structure - not empty and contains actual words
      expect(poem.trim()).not.toBe('');
      const words = poem.split(/\s+/).filter(word => word.length > 0);
      expect(words.length).toBeGreaterThan(20);
    });
  });

  describe('getPoemLines', () => {
    it('should return an array of poem lines', () => {
      const lines = getPoemLines();
      expect(Array.isArray(lines)).toBe(true);
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should return lines that form a coherent poem about URL shortening', () => {
      const lines = getPoemLines();
      const fullPoem = lines.join(' ').toLowerCase();

      // Check for URL shortening related themes
      const urlThemes = ['link', 'url', 'short', 'click', 'path', 'share', 'connect', 'digital', 'journey'];
      const hasUrlTheme = urlThemes.some(theme => fullPoem.includes(theme));

      expect(hasUrlTheme).toBe(true);
    });
  });
});
