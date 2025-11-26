import '@testing-library/jest-dom';
// Setup for React Testing Library
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock IntersectionObserver for Framer Motion
class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Mock canvas for Three.js (more comprehensive)
const mockCanvasContext = {
  fillStyle: '',
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  createPattern: vi.fn(),
  createRadialGradient: vi.fn(),
  arc: vi.fn(),
  clearRect: vi.fn(),
};

const mockWebGLContext = {
  canvas: {},
  createBuffer: vi.fn(() => ({})),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  createShader: vi.fn(() => ({})),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  createProgram: vi.fn(() => ({})),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  useProgram: vi.fn(),
  getUniformLocation: vi.fn(() => ({})),
  uniform1f: vi.fn(),
  getShaderParameter: vi.fn(() => true),
  viewport: vi.fn(),
  clear: vi.fn(),
  drawArrays: vi.fn(),
  enable: vi.fn(),
  blending: 0,
  ONE: 1,
  SRC_ALPHA: 770,
  ONE_MINUS_SRC_ALPHA: 771,
  getExtension: vi.fn(() => null),
  getParameter: vi.fn(),
  getAttribLocation: vi.fn(() => 0),
};

HTMLCanvasElement.prototype.getContext = vi.fn((contextType) => {
  if (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl') {
    return mockWebGLContext;
  }
  return mockCanvasContext;
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => window.setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn((id) => window.clearTimeout(id));

// Mock THREE.js module
vi.mock('three', () => ({
  Scene: class Scene {
    add = vi.fn();
    remove = vi.fn();
  },
  PerspectiveCamera: class PerspectiveCamera {
    position = { z: 0 };
    aspect = 1;
    updateProjectionMatrix = vi.fn();
  },
  WebGLRenderer: class WebGLRenderer {
    setSize = vi.fn();
    setClearColor = vi.fn();
    setPixelRatio = vi.fn();
    domElement = document.createElement('canvas');
    render = vi.fn();
    dispose = vi.fn();
  },
  BufferGeometry: class BufferGeometry {
    setAttribute = vi.fn();
  },
  BufferAttribute: class BufferAttribute {
    needsUpdate = false;
  },
  Points: class Points {
    rotation = { x: 0, y: 0 };
  },
  PointsMaterial: class PointsMaterial {
    size = 1;
    color = {};
    transparent = false;
    opacity = 1;
    blending = 1;
  },
  AdditiveBlending: 2,
}));

// Global test configuration
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
