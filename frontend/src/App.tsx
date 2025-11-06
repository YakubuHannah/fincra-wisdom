import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import AskWisdomPage from './pages/AskWisdomPage';
import CategoryPage from './pages/CategoryPage';
import CirclePage from './pages/CirclePage';
import DepartmentPage from './pages/DepartmentPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import DocumentUpload from './pages/admin/DocumentUpload';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AskWisdomPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/circles/:slug" element={<CirclePage />} />
            <Route path="/departments/:slug" element={<DepartmentPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="documents" element={<DocumentUpload />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;