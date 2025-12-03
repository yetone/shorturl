import '@testing-library/jest-dom'
import { vi } from 'vitest'

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
})

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

// Mock MutationObserver
const mockMutationObserver = vi.fn()
mockMutationObserver.mockReturnValue({
  observe: () => null,
  disconnect: () => null,
  takeRecords: () => [],
})
window.MutationObserver = mockMutationObserver

// Mock ResizeObserver
const mockResizeObserver = vi.fn()
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.ResizeObserver = mockResizeObserver

// Mock requestAnimationFrame
window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback): number => {
  return setTimeout(cb, 0) as unknown as number
})
window.cancelAnimationFrame = vi.fn((id: number): void => {
  clearTimeout(id)
})
