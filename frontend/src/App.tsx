import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import AskWisdomPage from './pages/AskWisdomPage';
import CategoryPage from './pages/CategoryPage';
import CirclePage from './pages/CirclePage';
import DepartmentPage from './pages/DepartmentPage';
import LoginPage from './pages/LoginPage';
import SetupProfilePage from './pages/SetupProfilePage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import DocumentUpload from './pages/admin/DocumentUpload';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes - Require Login */}
              <Route path="/" element={<ProtectedRoute><AskWisdomPage /></ProtectedRoute>} />
              <Route path="/category" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
              <Route path="/circles/:slug" element={<ProtectedRoute><CirclePage /></ProtectedRoute>} />
              <Route path="/departments/:slug" element={<ProtectedRoute><DepartmentPage /></ProtectedRoute>} />
              <Route path="/setup-profile" element={<ProtectedRoute><SetupProfilePage /></ProtectedRoute>} />
              
              {/* Admin Routes - Require Login */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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
    </GoogleOAuthProvider>
  );
}

export default App;