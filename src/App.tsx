/**
 * Main App Component
 * ==================
 * 
 * WHAT THIS FILE DOES:
 * - Sets up all routes for the application
 * - Initializes authentication on app startup
 * - Applies theme (dark/light mode)
 * - Provides language context
 * 
 * AUTH ROUTES ADDED:
 * - /login - Login page for existing users
 * - /signup - Registration page for new users
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Generator from './pages/Generator';
import Results from './pages/Results';
import BusinessPlan from './pages/BusinessPlan';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Settings from './pages/Settings';
import FeatureDetail from './pages/FeatureDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

const App: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const { initializeAuth, isInitialized } = useAuthStore();

  // Initialize authentication on app startup
  // This checks if there's a stored token and validates it
  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  // Initialize theme on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-theme-primary text-theme-primary selection:bg-indigo-500 selection:text-white transition-colors duration-300">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/results" element={<Results />} />
              <Route path="/plan/:id" element={<BusinessPlan />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/feature/:featureId" element={<FeatureDetail />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
