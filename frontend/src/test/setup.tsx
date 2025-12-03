import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
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

// Mock framer-motion to prevent animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, whileHover, whileTap, variants, onHoverStart, onHoverEnd, ...restProps } = props;
        return <div {...restProps}>{children}</div>;
      },
      button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, whileHover, whileTap, variants, onHoverStart, onHoverEnd, ...restProps } = props;
        return <button {...restProps}>{children}</button>;
      },
      h1: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, whileHover, whileTap, variants, ...restProps } = props;
        return <h1 {...restProps}>{children}</h1>;
      },
      h2: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, whileHover, whileTap, variants, ...restProps } = props;
        return <h2 {...restProps}>{children}</h2>;
      },
      p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, whileHover, whileTap, variants, ...restProps } = props;
        return <p {...restProps}>{children}</p>;
      },
      span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, whileHover, whileTap, variants, ...restProps } = props;
        return <span {...restProps}>{children}</span>;
      },
      footer: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, whileHover, whileTap, variants, ...restProps } = props;
        return <footer {...restProps}>{children}</footer>;
      },
    },
    AnimatePresence: ({ children }: React.PropsWithChildren<object>) => children,
  };
});
