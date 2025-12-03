import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver for animations that use viewport detection
class MockIntersectionObserver {
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
  takeRecords = vi.fn(() => []);
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock MutationObserver
class MockMutationObserver {
  constructor(_callback: MutationCallback) {}
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
window.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock requestAnimationFrame
window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => {
  return setTimeout(cb, 0) as unknown as number;
});
window.cancelAnimationFrame = vi.fn((id: number): void => {
  clearTimeout(id);
});
