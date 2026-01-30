import React from 'react';
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

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-black text-white selection:bg-blue selection:text-white">
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
              <Route path="/login" element={<Login />} />
              <Route path="/feature/:featureId" element={<FeatureDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;


