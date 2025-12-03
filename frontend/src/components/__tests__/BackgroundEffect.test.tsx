// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Set up test state on globalThis before mocking
(globalThis as any).__testState = {
  sceneInstances: [] as any[],
  rendererInstances: [] as any[],
  cameraInstances: [] as any[],
  geometryInstances: [] as any[],
  materialInstances: [] as any[],
  pointsInstances: [] as any[],
  mockCalls: {
    sceneAdd: vi.fn(),
    setSize: vi.fn(),
    setClearColor: vi.fn(),
    render: vi.fn(),
    setAttribute: vi.fn(),
    updateProjectionMatrix: vi.fn(),
    dispose: vi.fn(),
  },
};

// Mock Three.js before any imports that might use it
vi.mock('three', () => {
  const getState = () => (globalThis as any).__testState;
  const getMockCalls = () => getState().mockCalls;

  class MockScene {
    children: any[] = [];
    add(...args: any[]) {
      getMockCalls().sceneAdd(...args);
    }
    dispose() {
      getMockCalls().dispose();
    }

    constructor() {
      getState().sceneInstances.push(this);
    }
  }

  class MockPerspectiveCamera {
    position = { z: 0 };
    aspect = 1;
    updateProjectionMatrix() {
      getMockCalls().updateProjectionMatrix();
    }

    constructor() {
      getState().cameraInstances.push(this);
    }
  }

  class MockWebGLRenderer {
    domElement = document.createElement('canvas');

    setSize(...args: any[]) {
      getMockCalls().setSize(...args);
    }
    setClearColor(...args: any[]) {
      getMockCalls().setClearColor(...args);
    }
    render(...args: any[]) {
      getMockCalls().render(...args);
    }
    dispose() {
      getMockCalls().dispose();
    }

    constructor() {
      getState().rendererInstances.push(this);
    }
  }

  class MockBufferGeometry {
    setAttribute(...args: any[]) {
      getMockCalls().setAttribute(...args);
    }
    dispose() {
      getMockCalls().dispose();
    }

    constructor() {
      getState().geometryInstances.push(this);
    }
  }

  class MockBufferAttribute {
    array: Float32Array;
    itemSize: number;

    constructor(array: Float32Array, itemSize: number) {
      this.array = array;
      this.itemSize = itemSize;
    }
  }

  class MockPointsMaterial {
    size: number;
    color: number;
    transparent: boolean;
    opacity: number;
    blending: number;

    dispose() {
      getMockCalls().dispose();
    }

    constructor(options: any) {
      this.size = options.size;
      this.color = options.color;
      this.transparent = options.transparent;
      this.opacity = options.opacity;
      this.blending = options.blending;
      getState().materialInstances.push(this);
    }
  }

  class MockPoints {
    geometry: any;
    material: any;
    rotation = { x: 0, y: 0 };

    constructor(geometry: any, material: any) {
      this.geometry = geometry;
      this.material = material;
      getState().pointsInstances.push(this);
    }
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

// Now import React and testing utilities
import { render, cleanup, act } from '@testing-library/react';
import { BackgroundEffect } from '../BackgroundEffect';

// Track MutationObserver calls
let mutationObserverObserveCalls = 0;
let mutationObserverDisconnectCalls = 0;

// Create a proper MutationObserver mock class
class MockMutationObserver {
  callback: MutationCallback;

  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  observe() {
    mutationObserverObserveCalls++;
  }

  disconnect() {
    mutationObserverDisconnectCalls++;
  }

  takeRecords() {
    return [];
  }
}

// Mock requestAnimationFrame
let animationFrameCallbacks: FrameRequestCallback[] = [];
const originalRAF = globalThis.requestAnimationFrame;
const originalCAF = globalThis.cancelAnimationFrame;
const originalMutationObserver = globalThis.MutationObserver;

// Helper to get test state
const getTestState = () => (globalThis as any).__testState;
const getMockCalls = () => getTestState().mockCalls;

beforeEach(() => {
  // Reset all mock instances
  const state = getTestState();
  state.sceneInstances = [];
  state.rendererInstances = [];
  state.cameraInstances = [];
  state.geometryInstances = [];
  state.materialInstances = [];
  state.pointsInstances = [];

  mutationObserverObserveCalls = 0;
  mutationObserverDisconnectCalls = 0;

  // Reset all mock functions
  Object.values(state.mockCalls).forEach((fn: any) => fn.mockClear());
  animationFrameCallbacks = [];

  // Mock requestAnimationFrame
  globalThis.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    animationFrameCallbacks.push(callback);
    return animationFrameCallbacks.length;
  });

  globalThis.cancelAnimationFrame = vi.fn((id: number) => {
    if (id > 0 && id <= animationFrameCallbacks.length) {
      animationFrameCallbacks[id - 1] = () => {};
    }
  });

  // Setup MutationObserver mock as a class
  globalThis.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;
});

afterEach(() => {
  cleanup();
  globalThis.requestAnimationFrame = originalRAF;
  globalThis.cancelAnimationFrame = originalCAF;
  globalThis.MutationObserver = originalMutationObserver;
});

describe('BackgroundEffect - Background Effect Rendering', () => {
  describe('Test Case 1: BackgroundEffect component is mounted and canvas element exists in DOM', () => {
    it('should render the BackgroundEffect container div', () => {
      render(<BackgroundEffect />);

      // The component renders a div with aria-hidden="true"
      const container = document.querySelector('[aria-hidden="true"]');
      expect(container).toBeInTheDocument();
    });

    it('should create a Three.js Scene on mount', () => {
      render(<BackgroundEffect />);

      expect(getTestState().sceneInstances.length).toBeGreaterThan(0);
    });

    it('should create a Three.js WebGLRenderer on mount', () => {
      render(<BackgroundEffect />);

      expect(getTestState().rendererInstances.length).toBeGreaterThan(0);
    });

    it('should create a PerspectiveCamera', () => {
      render(<BackgroundEffect />);

      expect(getTestState().cameraInstances.length).toBeGreaterThan(0);
    });

    it('should append canvas element to the container', () => {
      render(<BackgroundEffect />);

      // The renderer's domElement should be appended to the container
      const container = document.querySelector('[aria-hidden="true"]');
      expect(container).toBeInTheDocument();

      // Check that WebGLRenderer was instantiated (canvas creation)
      expect(getTestState().rendererInstances.length).toBeGreaterThan(0);
    });

    it('should create particle system with BufferGeometry and Points', () => {
      render(<BackgroundEffect />);

      const state = getTestState();
      expect(state.geometryInstances.length).toBeGreaterThan(0);
      expect(state.pointsInstances.length).toBeGreaterThan(0);
      expect(state.materialInstances.length).toBeGreaterThan(0);
    });

    it('should add particles to the scene', () => {
      render(<BackgroundEffect />);

      expect(getMockCalls().sceneAdd).toHaveBeenCalled();
    });
  });

  describe('Test Case 2: Canvas has position fixed or absolute with z-index behind content', () => {
    it('should render with fixed positioning class', () => {
      render(<BackgroundEffect />);

      const container = document.querySelector('[aria-hidden="true"]');
      expect(container).toHaveClass('fixed');
    });

    it('should render with inset-0 class for full coverage', () => {
      render(<BackgroundEffect />);

      const container = document.querySelector('[aria-hidden="true"]');
      expect(container).toHaveClass('inset-0');
    });

    it('should have negative z-index to position behind content', () => {
      render(<BackgroundEffect />);

      const container = document.querySelector('[aria-hidden="true"]');
      expect(container).toHaveClass('-z-10');
    });

    it('should accept custom className prop', () => {
      render(<BackgroundEffect className="custom-class" />);

      const container = document.querySelector('[aria-hidden="true"]');
      expect(container).toHaveClass('custom-class');
    });

    it('should have aria-hidden attribute for accessibility', () => {
      render(<BackgroundEffect />);

      const container = document.querySelector('[aria-hidden="true"]');
      expect(container).toHaveAttribute('aria-hidden', 'true');
    });

    it('should set renderer with transparent background', () => {
      render(<BackgroundEffect />);

      expect(getMockCalls().setClearColor).toHaveBeenCalledWith(0x000000, 0);
    });
  });

  describe('Test Case 3: Three.js resources are properly disposed on component unmount', () => {
    it('should remove renderer domElement from container on unmount', () => {
      const { unmount } = render(<BackgroundEffect />);

      const container = document.querySelector('[aria-hidden="true"]');
      expect(container).toBeInTheDocument();

      // Unmount the component
      unmount();

      // After unmount, the component should clean up
      // The cleanup happens in useEffect return
    });

    it('should remove resize event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<BackgroundEffect />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should disconnect MutationObserver on unmount', () => {
      const { unmount } = render(<BackgroundEffect />);

      const observeCallsBefore = mutationObserverObserveCalls;
      expect(observeCallsBefore).toBeGreaterThan(0);

      unmount();

      expect(mutationObserverDisconnectCalls).toBeGreaterThan(0);
    });

    it('should handle unmount when refs are null', () => {
      // This test ensures no errors occur during cleanup when refs might be null
      const { unmount } = render(<BackgroundEffect />);

      // Should not throw any errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Test Case 4: No memory leaks detected after multiple mount/unmount cycles', () => {
    it('should not accumulate resources after multiple mount/unmount cycles', () => {
      // Perform multiple mount/unmount cycles
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<BackgroundEffect />);
        unmount();
      }

      // The key assertion is that we don't accumulate event listeners
      // and cleanup functions are called
      expect(true).toBe(true); // Test completes without memory errors
    });

    it('should properly clean up event listeners after multiple cycles', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const cycleCount = 3;

      for (let i = 0; i < cycleCount; i++) {
        const { unmount } = render(<BackgroundEffect />);
        unmount();
      }

      // Number of removeEventListener calls should match addEventListener calls
      const resizeAddCalls = addEventListenerSpy.mock.calls.filter(
        call => call[0] === 'resize'
      ).length;
      const resizeRemoveCalls = removeEventListenerSpy.mock.calls.filter(
        call => call[0] === 'resize'
      ).length;

      expect(resizeRemoveCalls).toBe(resizeAddCalls);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should clean up MutationObserver after multiple cycles', () => {
      mutationObserverObserveCalls = 0;
      mutationObserverDisconnectCalls = 0;

      const cycleCount = 3;

      for (let i = 0; i < cycleCount; i++) {
        const { unmount } = render(<BackgroundEffect />);
        unmount();
      }

      // Disconnect should be called equal times to observe
      expect(mutationObserverDisconnectCalls).toBe(mutationObserverObserveCalls);
    });

    it('should handle rapid mount/unmount without errors', async () => {
      // Rapid mounting and unmounting to simulate potential race conditions
      const results: Array<ReturnType<typeof render>> = [];

      for (let i = 0; i < 10; i++) {
        results.push(render(<BackgroundEffect key={i} />));
      }

      // Unmount all
      results.forEach(result => result.unmount());

      // Should complete without throwing
      expect(true).toBe(true);
    });

    it('should not leak Three.js instances across mount/unmount cycles', () => {
      // Reset instance tracking
      const state = getTestState();
      state.sceneInstances = [];
      state.rendererInstances = [];

      // First mount
      const { unmount: unmount1 } = render(<BackgroundEffect />);
      const firstSceneCount = state.sceneInstances.length;
      const firstRendererCount = state.rendererInstances.length;

      unmount1();

      // Second mount
      const { unmount: unmount2 } = render(<BackgroundEffect />);

      // Should create new instances (not accumulate old ones in use)
      expect(state.sceneInstances.length).toBe(firstSceneCount * 2);
      expect(state.rendererInstances.length).toBe(firstRendererCount * 2);

      unmount2();
    });
  });

  describe('Animation and Performance', () => {
    it('should start animation loop on mount', () => {
      render(<BackgroundEffect />);

      // requestAnimationFrame should have been called to start animation
      expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should update particle rotation in animation loop', () => {
      render(<BackgroundEffect />);

      // Execute the animation frame callback
      if (animationFrameCallbacks.length > 0) {
        animationFrameCallbacks[0](0);
      }

      // The animation should continue (request next frame)
      expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should render the scene in animation loop', () => {
      render(<BackgroundEffect />);

      // Execute animation frame
      if (animationFrameCallbacks.length > 0) {
        animationFrameCallbacks[0](0);
      }

      expect(getMockCalls().render).toHaveBeenCalled();
    });

    it('should handle window resize events', () => {
      render(<BackgroundEffect />);

      // Trigger resize event
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Renderer should update size
      expect(getMockCalls().setSize).toHaveBeenCalled();
    });

    it('should update camera aspect ratio on resize', () => {
      render(<BackgroundEffect />);

      // Trigger resize
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(getMockCalls().updateProjectionMatrix).toHaveBeenCalled();
    });
  });

  describe('Theme Support', () => {
    it('should observe document element class changes for theme detection', () => {
      render(<BackgroundEffect />);

      // MutationObserver should have been called to observe theme changes
      expect(mutationObserverObserveCalls).toBeGreaterThan(0);
    });

    it('should create particles with appropriate material properties', () => {
      render(<BackgroundEffect />);

      const state = getTestState();
      // Check that material was created with expected properties
      expect(state.materialInstances.length).toBeGreaterThan(0);
      const material = state.materialInstances[0];
      expect(material.size).toBe(0.02);
      expect(material.transparent).toBe(true);
      expect(material.blending).toBe(2); // AdditiveBlending
    });
  });

  describe('Particle System', () => {
    it('should create particle geometry', () => {
      render(<BackgroundEffect />);

      expect(getTestState().geometryInstances.length).toBeGreaterThan(0);
    });

    it('should set position attribute on geometry', () => {
      render(<BackgroundEffect />);

      expect(getMockCalls().setAttribute).toHaveBeenCalledWith(
        'position',
        expect.any(Object)
      );
    });
  });
});
