import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock AuthContext that allows controlling authentication state
interface MockAuthProviderProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  user?: { id: number; username: string; email: string; is_admin: number } | null;
}

export const MockAuthProvider = ({
  children,
  isAuthenticated = false,
  user = null
}: MockAuthProviderProps) => {
  // We need to mock the AuthContext value directly
  return <>{children}</>;
};

interface AllProvidersProps {
  children: ReactNode;
}

const AllProviders = ({ children }: AllProvidersProps) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
