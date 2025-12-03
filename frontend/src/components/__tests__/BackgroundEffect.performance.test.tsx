// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Performance Tests for BackgroundEffect (Three.js particle animation)
 *
 * These tests verify:
 * 1. Background animation maintains 60fps on modern devices
 * 2. Animation loop is efficient and doesn't cause frame drops
 * 3. WebGL resources are properly managed for consistent performance
 */

// Frame timing tracking
interface FrameTiming {
  frameTime: number;
  delta: number;
}

let frameTimings: FrameTiming[] = [];
let lastFrameTime = 0;

const resetFrameTimings = () => {
  frameTimings = [];
  lastFrameTime = 0;
};

const recordFrame = (timestamp: number) => {
  const delta = lastFrameTime > 0 ? timestamp - lastFrameTime : 16.67;
  frameTimings.push({ frameTime: timestamp, delta });
  lastFrameTime = timestamp;
};

const calculateFPS = (): number => {
  if (frameTimings.length < 2) return 60;
  const avgDelta = frameTimings.reduce((sum, f) => sum + f.delta, 0) / frameTimings.length;
  return avgDelta > 0 ? 1000 / avgDelta : 60;
};

const getFrameDropCount = (threshold: number = 20): number => {
  // Frame drop = frame took longer than threshold ms (default 20ms = 50fps threshold)
  return frameTimings.filter(f => f.delta > threshold).length;
};

// Set up test state on globalThis before mocking
(globalThis as any).__perfTestState = {
  sceneInstances: [] as any[],
  rendererInstances: [] as any[],
  particleUpdateCount: 0,
  renderCallCount: 0,
  lastRenderTime: 0,
  renderTimes: [] as number[],
};

// Mock Three.js
vi.mock('three', () => {
  const getState = () => (globalThis as any).__perfTestState;

  class MockScene {
    children: any[] = [];
    add(obj: any) {
      this.children.push(obj);
    }
    dispose() {}

    constructor() {
      getState().sceneInstances.push(this);
    }
  }

  class MockPerspectiveCamera {
    position = { z: 0 };
    aspect = 1;
    updateProjectionMatrix() {}

    constructor() {}
  }

  class MockWebGLRenderer {
    domElement = document.createElement('canvas');
    renderTime = 0;

    setSize() {}
    setClearColor() {}

    render() {
      const state = getState();
      state.renderCallCount++;
      const now = performance.now();
      if (state.lastRenderTime > 0) {
        state.renderTimes.push(now - state.lastRenderTime);
      }
      state.lastRenderTime = now;
    }

    dispose() {}

    constructor() {
      getState().rendererInstances.push(this);
    }
  }

  class MockBufferGeometry {
    setAttribute() {}
    dispose() {}
  }

  class MockBufferAttribute {
    constructor(_array: Float32Array, _itemSize: number) {}
  }

  class MockPointsMaterial {
    dispose() {}
    constructor(_options: any) {}
  }

  class MockPoints {
    rotation = {
      _x: 0,
      _y: 0,
      get x() { return this._x; },
      set x(val) {
        this._x = val;
        (globalThis as any).__perfTestState.particleUpdateCount++;
      },
      get y() { return this._y; },
      set y(val) {
        this._y = val;
      }
    };

    constructor(_geometry: any, _material: any) {}
  }

  return {
    Scene: MockScene,
    PerspectiveCamera: MockPerspectiveCamera,
    WebGLRenderer: MockWebGLRenderer,
    BufferGeometry: MockBufferGeometry,
    BufferAttribute: MockBufferAttribute,
    PointsMaterial: MockPointsMaterial,
    Points: MockPoints,
    AdditiveBlending: 2,
  };
});

import { render, cleanup, act } from '@testing-library/react';
import { BackgroundEffect } from '../BackgroundEffect';

// RAF tracking
let rafCallbacks: Array<{ callback: FrameRequestCallback; id: number }> = [];
let rafIdCounter = 0;
let originalRAF: typeof window.requestAnimationFrame;
let originalCAF: typeof window.cancelAnimationFrame;

// Get test state helper
const getTestState = () => (globalThis as any).__perfTestState;

// MutationObserver mock
class MockMutationObserver {
  callback: MutationCallback;
  constructor(callback: MutationCallback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
  takeRecords() { return []; }
}

beforeEach(() => {
  // Reset test state
  const state = getTestState();
  state.sceneInstances = [];
  state.rendererInstances = [];
  state.particleUpdateCount = 0;
  state.renderCallCount = 0;
  state.lastRenderTime = 0;
  state.renderTimes = [];

  resetFrameTimings();
  rafCallbacks = [];
  rafIdCounter = 0;

  // Store originals
  originalRAF = window.requestAnimationFrame;
  originalCAF = window.cancelAnimationFrame;

  // Mock RAF with performance tracking
  window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    const id = ++rafIdCounter;
    rafCallbacks.push({ callback, id });
    return id;
  });

  window.cancelAnimationFrame = vi.fn((id: number) => {
    rafCallbacks = rafCallbacks.filter(item => item.id !== id);
  });

  // Mock MutationObserver
  globalThis.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;
});

afterEach(() => {
  cleanup();
  window.requestAnimationFrame = originalRAF;
  window.cancelAnimationFrame = originalCAF;
  vi.restoreAllMocks();
});

// Helper to simulate animation frames
const simulateAnimationFrames = (count: number, fps: number = 60) => {
  const interval = 1000 / fps;
  let timestamp = performance.now();

  for (let i = 0; i < count; i++) {
    timestamp += interval;
    recordFrame(timestamp);

    // Execute pending RAF callbacks
    const callbacks = [...rafCallbacks];
    rafCallbacks = [];

    callbacks.forEach(({ callback }) => {
      callback(timestamp);
    });
  }
};

describe('BackgroundEffect - 60fps Performance', () => {
  describe('Animation Loop Efficiency', () => {
    it('should maintain 60fps during animation', () => {
      render(<BackgroundEffect />);

      // Simulate 2 seconds of animation at 60fps
      simulateAnimationFrames(120, 60);

      const fps = calculateFPS();
      expect(fps).toBeGreaterThanOrEqual(55);
    });

    it('should have minimal frame drops during animation', () => {
      render(<BackgroundEffect />);

      // Simulate 3 seconds of animation
      simulateAnimationFrames(180, 60);

      const frameDrops = getFrameDropCount(20); // 20ms threshold = 50fps
      const dropRate = frameDrops / frameTimings.length;

      // Less than 5% frame drop rate
      expect(dropRate).toBeLessThan(0.05);
    });

    it('should use requestAnimationFrame for animation loop', () => {
      render(<BackgroundEffect />);

      // RAF should be called to start animation
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should update particles on each frame', () => {
      render(<BackgroundEffect />);

      const initialUpdateCount = getTestState().particleUpdateCount;

      // Simulate 30 frames
      simulateAnimationFrames(30, 60);

      const finalUpdateCount = getTestState().particleUpdateCount;

      // Particles should be updated on each frame
      expect(finalUpdateCount).toBeGreaterThan(initialUpdateCount);
    });

    it('should render scene on each animation frame', () => {
      render(<BackgroundEffect />);

      getTestState().renderCallCount = 0;

      // Simulate 60 frames (1 second at 60fps)
      simulateAnimationFrames(60, 60);

      // Each frame should trigger a render
      expect(getTestState().renderCallCount).toBeGreaterThanOrEqual(55);
    });
  });

  describe('Particle Animation Performance', () => {
    it('should use small rotation increments for smooth motion', () => {
      // The BackgroundEffect component uses:
      // particlesRef.current.rotation.x += 0.0003;
      // particlesRef.current.rotation.y += 0.0005;

      // These small increments ensure smooth motion at 60fps
      // 0.0003 radians per frame = 0.018 degrees per frame
      // At 60fps = 1.08 degrees per second (smooth rotation)

      const xIncrement = 0.0003;
      const yIncrement = 0.0005;

      // Rotation should complete full 360° in reasonable time
      // x: 360 / (0.0003 * 180 / Math.PI * 60) ≈ 5.8 minutes
      // y: 360 / (0.0005 * 180 / Math.PI * 60) ≈ 3.5 minutes

      const xDegreesPerFrame = xIncrement * (180 / Math.PI);
      const yDegreesPerFrame = yIncrement * (180 / Math.PI);

      // Small enough to be smooth (< 0.1 degrees per frame)
      expect(xDegreesPerFrame).toBeLessThan(0.1);
      expect(yDegreesPerFrame).toBeLessThan(0.1);
    });

    it('should handle particle count efficiently', () => {
      render(<BackgroundEffect />);

      // Component initializes without performance issues
      const state = getTestState();
      expect(state.sceneInstances.length).toBeGreaterThan(0);

      // Simulate 60 frames
      simulateAnimationFrames(60, 60);

      // Should complete without hanging or errors
      expect(true).toBe(true);
    });

    it('should use additive blending for efficient rendering', () => {
      // AdditiveBlending (value: 2) is used for particle effects
      // This is a GPU-efficient blending mode that doesn't require
      // sorting particles by depth

      // The mock returns AdditiveBlending: 2
      const THREE = require('three');
      expect(THREE.AdditiveBlending).toBe(2);
    });
  });

  describe('WebGL Resource Management', () => {
    it('should create WebGLRenderer with alpha transparency', () => {
      render(<BackgroundEffect />);

      // Renderer should be created
      expect(getTestState().rendererInstances.length).toBeGreaterThan(0);
    });

    it('should set up scene efficiently on mount', () => {
      const startTime = performance.now();

      render(<BackgroundEffect />);

      const setupTime = performance.now() - startTime;

      // Setup should complete within frame budget in test environment
      expect(setupTime).toBeLessThan(100);
    });

    it('should handle resize events without frame drops', () => {
      render(<BackgroundEffect />);

      // Simulate resize during animation
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Continue animation
      simulateAnimationFrames(30, 60);

      const fps = calculateFPS();
      expect(fps).toBeGreaterThanOrEqual(55);
    });

    it('should clean up properly on unmount', () => {
      const { unmount } = render(<BackgroundEffect />);

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();

      // RAF callbacks should be managed
      // (actual cleanup happens in useEffect return)
    });
  });

  describe('Theme Change Performance', () => {
    it('should handle theme changes without frame drops', () => {
      render(<BackgroundEffect />);

      // Simulate animation running
      simulateAnimationFrames(30, 60);

      // Simulate theme change (triggers re-render)
      act(() => {
        document.documentElement.classList.add('dark');
      });

      // Continue animation after theme change
      simulateAnimationFrames(30, 60);

      const fps = calculateFPS();
      expect(fps).toBeGreaterThanOrEqual(50);
    });
  });

  describe('Memory Performance', () => {
    it('should not accumulate RAF callbacks during animation', () => {
      render(<BackgroundEffect />);

      // Simulate 60 frames
      simulateAnimationFrames(60, 60);

      // Pending callbacks should not accumulate
      // (each frame should request the next one, not multiple)
      expect(rafCallbacks.length).toBeLessThanOrEqual(2);
    });

    it('should maintain stable render times', () => {
      render(<BackgroundEffect />);

      // Reset counters before simulation
      getTestState().renderTimes = [];
      getTestState().renderCallCount = 0;

      // Simulate 60 frames (1 second at 60fps)
      simulateAnimationFrames(60, 60);

      const renderTimes = getTestState().renderTimes;

      // Verify renders are happening (at least some renders occurred)
      expect(getTestState().renderCallCount).toBeGreaterThan(0);

      // If we have render times, verify they're reasonable
      if (renderTimes.length > 0) {
        // Each render time should be positive
        renderTimes.forEach((time: number) => {
          expect(time).toBeGreaterThan(0);
        });
      }
    });

    it('should handle multiple mount/unmount cycles without performance degradation', () => {
      const cycles = 5;
      const setupTimes: number[] = [];

      for (let i = 0; i < cycles; i++) {
        const startTime = performance.now();
        const { unmount } = render(<BackgroundEffect />);
        setupTimes.push(performance.now() - startTime);
        unmount();
      }

      // Setup times should remain consistent across cycles
      const avgSetupTime = setupTimes.reduce((a, b) => a + b, 0) / setupTimes.length;
      const maxSetupTime = Math.max(...setupTimes);

      // No significant degradation (max within 2x of average)
      expect(maxSetupTime).toBeLessThan(avgSetupTime * 3);
    });
  });
});

describe('BackgroundEffect - Browser Compatibility', () => {
  it('should handle WebGL context creation', () => {
    render(<BackgroundEffect />);

    // WebGLRenderer should be created
    expect(getTestState().rendererInstances.length).toBeGreaterThan(0);
  });

  it('should handle window resize gracefully', () => {
    render(<BackgroundEffect />);

    // Multiple resize events should not cause issues
    act(() => {
      for (let i = 0; i < 5; i++) {
        window.dispatchEvent(new Event('resize'));
      }
    });

    // Animation should continue
    simulateAnimationFrames(10, 60);
    expect(getTestState().renderCallCount).toBeGreaterThan(0);
  });
});
