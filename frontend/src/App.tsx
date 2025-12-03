import { FC, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UrlStats from './pages/UrlStats';
import Settings from './pages/Settings';
import Poem from './pages/Poem';

// Components
import ProtectedLayout from './components/ProtectedLayout';
import AdminRoute from './components/AdminRoute';

// Create a client for React Query
const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/poem" element={<Poem />} />

                {/* Protected routes */}
                <Route element={<ProtectedLayout />}>
                  <Route path="/stats/:shortCode" element={<UrlStats />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Admin routes */}
                  <Route path="/settings" element={
                    <AdminRoute>
                      <Settings />
                    </AdminRoute>
                  } />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
