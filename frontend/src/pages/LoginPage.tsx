import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();

  // If already logged in, redirect to home
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-purple-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg animate-bounce-slow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome to Wisdom
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Your single source of truth for Fincra knowledge
            </p>
            <p className="text-sm text-gray-500">
              Sign in with your Fincra or BoldBank Google account
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-100">
            <GoogleLoginButton />

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to access Fincra's internal knowledge base.
              </p>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact IT support at{' '}
              <a href="mailto:support@fincra.com" className="text-purple-600 hover:underline">
                support@fincra.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;