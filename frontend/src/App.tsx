import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AskWisdomPage from './pages/AskWisdomPage';
import CategoryPage from './pages/CategoryPage';
import CirclePage from './pages/CirclePage';
import DepartmentPage from './pages/DepartmentPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ask Wisdom is now the landing page */}
          <Route path="/" element={<AskWisdomPage />} />
          
          {/* Category page (old homepage) */}
          <Route path="/category" element={<CategoryPage />} />
          
          {/* Other routes */}
          <Route path="/circles/:slug" element={<CirclePage />} />
          <Route path="/departments/:slug" element={<DepartmentPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Redirect unknown routes to Ask Wisdom */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;