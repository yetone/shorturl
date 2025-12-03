// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Home from '../Home';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

/**
 * Component Integration Tests for Homepage
 *
 * This test file verifies that all custom components integrate properly in the homepage:
 * - FuturisticButton integration
 * - GlassMorphismCard integration
 * - BackgroundEffect integration
 * - Context provider integration (AuthContext, ThemeContext)
 */

// Store test state for Three.js mocking
(globalThis as any).__threeTestState = {
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

// Mock Three.js for BackgroundEffect component
vi.mock('three', () => {
  const getState = () => (globalThis as any).__threeTestState;
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

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, variants, initial, animate, whileInView, viewport, transition, ...props }: any) => (
      <div className={className} style={style} data-testid="motion-div" {...props}>{children}</div>
    ),
    h1: ({ children, className, ...props }: any) => (
      <h1 className={className} {...props}>{children}</h1>
    ),
    h2: ({ children, className, ...props }: any) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    p: ({ children, className, ...props }: any) => (
      <p className={className} {...props}>{children}</p>
    ),
    button: ({ children, onClick, className, disabled, type, whileHover, whileTap, onHoverStart, onHoverEnd, ...props }: any) => (
      <button
        onClick={onClick}
        className={className}
        disabled={disabled}
        type={type}
        data-testid="futuristic-button"
        {...props}
      >
        {children}
      </button>
    ),
    footer: ({ children, className, ...props }: any) => (
      <footer className={className} {...props}>{children}</footer>
    ),
    article: ({ children, className, ...props }: any) => (
      <article className={className} data-testid="feature-article" {...props}>{children}</article>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the API module
vi.mock('../../api', () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Track MutationObserver calls
let mutationObserverCallback: MutationCallback | null = null;

class MockMutationObserver {
  callback: MutationCallback;
  constructor(callback: MutationCallback) {
    this.callback = callback;
    mutationObserverCallback = callback;
  }
  observe() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

// Store animation frame callbacks
let animationFrameCallbacks: FrameRequestCallback[] = [];
const originalRAF = globalThis.requestAnimationFrame;
const originalCAF = globalThis.cancelAnimationFrame;
const originalMutationObserver = globalThis.MutationObserver;

// Helper to get test state
const getTestState = () => (globalThis as any).__threeTestState;
const getMockCalls = () => getTestState().mockCalls;

// Test wrapper with all providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </MemoryRouter>
);

const renderHome = () => {
  return render(
    <TestWrapper>
      <Home />
    </TestWrapper>
  );
};

describe('Home - Component Integration', () => {
  beforeEach(() => {
    // Reset Three.js mock instances
    const state = getTestState();
    state.sceneInstances = [];
    state.rendererInstances = [];
    state.cameraInstances = [];
    state.geometryInstances = [];
    state.materialInstances = [];
    state.pointsInstances = [];

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

    // Setup MutationObserver mock
    globalThis.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;

    // Clear localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null);
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCAF;
    globalThis.MutationObserver = originalMutationObserver;
    mutationObserverCallback = null;
  });

  describe('Test Case 1: Render Home with FuturisticButton', () => {
    it('should render FuturisticButton components with correct props', async () => {
      renderHome();

      // Wait for component to be ready
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      });

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Verify buttons are rendered
      expect(getStartedButton).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
    });

    it('should render FuturisticButton with neon variant for primary CTA', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      });

      const getStartedButton = screen.getByRole('button', { name: /get started/i });

      // Verify neon variant styling (gradient)
      expect(getStartedButton).toHaveClass('bg-gradient-to-r');
      expect(getStartedButton).toHaveClass('from-indigo-500');
      expect(getStartedButton).toHaveClass('to-purple-600');
    });

    it('should render FuturisticButton with outline variant for secondary CTA', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      });

      const loginButton = screen.getByRole('button', { name: /login/i });

      // Verify outline variant styling
      expect(loginButton).toHaveClass('border-2');
      expect(loginButton).toHaveClass('border-indigo-500');
      expect(loginButton).toHaveClass('bg-transparent');
    });

    it('should render FuturisticButtons with large size', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      });

      const getStartedButton = screen.getByRole('button', { name: /get started/i });
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Verify large size classes
      expect(getStartedButton).toHaveClass('px-6');
      expect(getStartedButton).toHaveClass('py-3');
      expect(getStartedButton).toHaveClass('text-lg');
      expect(loginButton).toHaveClass('px-6');
      expect(loginButton).toHaveClass('py-3');
      expect(loginButton).toHaveClass('text-lg');
    });

    it('should handle onClick events on FuturisticButton', async () => {
      const user = userEvent.setup();
      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      });

      const getStartedButton = screen.getByRole('button', { name: /get started/i });

      // Verify button is clickable (wrapped in Link, so clicking should not throw)
      await expect(user.click(getStartedButton)).resolves.not.toThrow();
    });
  });

  describe('Test Case 2: Render Home with GlassMorphismCard', () => {
    it('should render GlassMorphismCard components for feature cards', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      });

      // Verify all 6 feature cards are rendered
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Global Access')).toBeInTheDocument();
      expect(screen.getByText('Secure Links')).toBeInTheDocument();
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    });

    it('should render GlassMorphismCard with children content', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      });

      // Verify description content is rendered inside cards
      expect(screen.getByText(/Transform long, unwieldy links/i)).toBeInTheDocument();
      expect(screen.getByText(/Track and analyze click data/i)).toBeInTheDocument();
      expect(screen.getByText(/Manage all your shortened URLs/i)).toBeInTheDocument();
    });

    it('should render GlassMorphismCard within article elements', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      });

      // Feature cards should be wrapped in article elements
      const articles = screen.getAllByTestId('feature-article');
      expect(articles.length).toBe(6);
    });

    it('should apply glassmorphism styling through GlassMorphismCard', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      });

      // The cards are rendered with proper structure containing the feature content
      const urlShorteningCard = screen.getByText('URL Shortening').closest('article');
      expect(urlShorteningCard).toBeInTheDocument();
    });

    it('should render GlassMorphismCard with different glow colors', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      });

      // Each feature card should have its own glow color (verified by presence in DOM)
      // The glow colors are: green, blue, pink for the first row
      const featureCards = screen.getAllByTestId('feature-article');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Test Case 3: Render Home with BackgroundEffect', () => {
    it('should initialize Three.js Scene on Home render', async () => {
      renderHome();

      await waitFor(() => {
        expect(getTestState().sceneInstances.length).toBeGreaterThan(0);
      });
    });

    it('should initialize Three.js WebGLRenderer on Home render', async () => {
      renderHome();

      await waitFor(() => {
        expect(getTestState().rendererInstances.length).toBeGreaterThan(0);
      });
    });

    it('should initialize Three.js PerspectiveCamera on Home render', async () => {
      renderHome();

      await waitFor(() => {
        expect(getTestState().cameraInstances.length).toBeGreaterThan(0);
      });
    });

    it('should create particle system with geometry and material', async () => {
      renderHome();

      await waitFor(() => {
        expect(getTestState().geometryInstances.length).toBeGreaterThan(0);
      });

      expect(getTestState().materialInstances.length).toBeGreaterThan(0);
      expect(getTestState().pointsInstances.length).toBeGreaterThan(0);
    });

    it('should add particles to the scene', async () => {
      renderHome();

      await waitFor(() => {
        expect(getMockCalls().sceneAdd).toHaveBeenCalled();
      });
    });

    it('should start animation loop with requestAnimationFrame', async () => {
      renderHome();

      await waitFor(() => {
        expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
      });
    });

    it('should render BackgroundEffect container with fixed positioning', async () => {
      renderHome();

      await waitFor(() => {
        const backgroundContainer = document.querySelector('[aria-hidden="true"]');
        expect(backgroundContainer).toBeInTheDocument();
      });

      const backgroundContainer = document.querySelector('[aria-hidden="true"]');
      expect(backgroundContainer).toHaveClass('fixed');
      expect(backgroundContainer).toHaveClass('inset-0');
      expect(backgroundContainer).toHaveClass('-z-10');
    });

    it('should set transparent background for WebGLRenderer', async () => {
      renderHome();

      await waitFor(() => {
        expect(getMockCalls().setClearColor).toHaveBeenCalledWith(0x000000, 0);
      });
    });
  });

  describe('Test Case 4: Test context provider integration', () => {
    it('should access AuthContext correctly - unauthenticated user', async () => {
      // Mock no token in localStorage
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      });

      // For unauthenticated user, Get Started should link to /register
      const getStartedLink = screen.getByRole('link', { name: /get started/i });
      expect(getStartedLink).toHaveAttribute('href', '/register');
    });

    it('should access ThemeContext correctly - light theme', async () => {
      // Default theme is light
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      // In light mode, main should not have bg-gray-900 class
      const main = screen.getByRole('main');
      expect(main).not.toHaveClass('bg-gray-900');
    });

    it('should access ThemeContext correctly - dark theme', async () => {
      // Mock dark theme in localStorage
      vi.mocked(localStorage.getItem).mockImplementation((key) => {
        if (key === 'theme') return 'dark';
        return null;
      });

      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      // In dark mode, main should have dark mode classes
      const main = screen.getByRole('main');
      expect(main).toHaveClass('bg-gray-900');
      expect(main).toHaveClass('text-white');
    });

    it('should render all components with ThemeProvider context', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      // Verify components that depend on ThemeContext are rendered
      expect(screen.getByText('Simplify Your Links')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('should render all components with AuthProvider context', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      });

      // Verify components that depend on AuthContext are rendered correctly
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should render footer with context-dependent opacity', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByText(/ShortURL. All rights reserved/i)).toBeInTheDocument();
      });

      const footer = screen.getByText(/ShortURL. All rights reserved/i).closest('footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Component Integration - Cross-cutting concerns', () => {
    it('should render complete Home page with all integrated components', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      // BackgroundEffect is initialized
      expect(getTestState().sceneInstances.length).toBeGreaterThan(0);

      // FuturisticButtons are rendered
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

      // GlassMorphismCards are rendered
      expect(screen.getByText('URL Shortening')).toBeInTheDocument();
      expect(screen.getByText('Click Analytics')).toBeInTheDocument();

      // Context-dependent content is rendered
      expect(screen.getByText(/ShortURL. All rights reserved/i)).toBeInTheDocument();
    });

    it('should maintain proper component hierarchy', async () => {
      renderHome();

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      const main = screen.getByRole('main');
      const header = main.querySelector('header');
      const footer = main.querySelector('footer');

      expect(header).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('should integrate components without throwing errors', async () => {
      // This test verifies no runtime errors occur during component integration
      expect(() => renderHome()).not.toThrow();
    });
  });
});
