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
        <div className="min-h-screen bg-theme-primary text-theme-primary selection:bg-indigo-500 selection:text-white transition-colors duration-300">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/results" element={<Results />} />
              <Route path="/plan/:id" element={<BusinessPlan />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/feature/:featureId" element={<FeatureDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
