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
import Login from './pages/Login';
import FeatureDetail from './pages/FeatureDetail';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useThemeStore } from './store/useThemeStore';

const App: React.FC = () => {
  const { isDarkMode } = useThemeStore();

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
        <div className="min-h-screen bg-black text-white selection:bg-blue selection:text-white">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes - Require Authentication */}
              <Route path="/generator" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/plan/:id" element={<ProtectedRoute><BusinessPlan /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/feature/:featureId" element={<ProtectedRoute><FeatureDetail /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
