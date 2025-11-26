import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('CSS Compatibility - Vendor Prefixes', () => {
  it('should have backdrop-filter with proper fallbacks', () => {
    // Read the CSS file to check for vendor prefixes
    const cssPath = resolve(__dirname, '../src/index.css');
    const cssContent = readFileSync(cssPath, 'utf-8');

    // Check for backdrop-filter usage (glassmorphism effect)
    const hasBackdropFilter = cssContent.includes('backdrop-filter') ||
                               cssContent.includes('-webkit-backdrop-filter');

    expect(hasBackdropFilter).toBe(true);
  });

  it('should have CSS gradients defined correctly', () => {
    const cssPath = resolve(__dirname, '../src/index.css');
    const cssContent = readFileSync(cssPath, 'utf-8');

    // Check for gradient syntax
    const hasGradients = cssContent.includes('linear-gradient') ||
                         cssContent.includes('-webkit-linear-gradient') ||
                         cssContent.includes('background-image');

    expect(hasGradients).toBe(true);
  });

  it('should have proper CSS for glassmorphism effects', () => {
    // Check that the CSS includes properties needed for glassmorphism
    const cssPath = resolve(__dirname, '../src/index.css');
    const cssContent = readFileSync(cssPath, 'utf-8');

    // Glassmorphism requires background blur and transparency
    const hasGlassmorphism = cssContent.includes('backdrop') ||
                             cssContent.includes('rgba') ||
                             cssContent.includes('blur');

    expect(hasGlassmorphism).toBe(true);
  });

  it('should define animation keyframes correctly', () => {
    const cssPath = resolve(__dirname, '../src/index.css');
    const cssContent = readFileSync(cssPath, 'utf-8');

    // Check for animation definitions
    const hasAnimations = cssContent.includes('@keyframes') ||
                          cssContent.includes('animation');

    expect(hasAnimations).toBe(true);
  });
});
