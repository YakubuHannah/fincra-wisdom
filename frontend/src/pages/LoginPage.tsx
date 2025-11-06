import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Circle {
  _id: string;
  name: string;
  icon: string;
}

interface Department {
  _id: string;
  name: string;
  circle: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [circles, setCircles] = useState<Circle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchCircles();
  }, []);

  useEffect(() => {
    if (selectedCircle) {
      fetchDepartments(selectedCircle);
    } else {
      setDepartments([]);
      setSelectedDepartment('');
    }
  }, [selectedCircle]);

  const fetchCircles = async () => {
    try {
      const response = await axios.get(`${API_URL}/circles`);
      setCircles(response.data);
    } catch (err) {
      console.error('Error fetching circles:', err);
    }
  };

  const fetchDepartments = async (circleId: string) => {
    try {
      const response = await axios.get(`${API_URL}/departments`);
      const filtered = response.data.filter((dept: Department) => dept.circle === circleId);
      setDepartments(filtered);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email domain
    const emailDomain = email.split('@')[1];
    if (!emailDomain || (emailDomain !== 'fincra.com' && emailDomain !== 'boldbank.ng')) {
      setError('Please use your @fincra.com or @boldbank.ng email address');
      return;
    }

    if (!selectedCircle || !selectedDepartment) {
      setError('Please select both circle and department');
      return;
    }

    try {
  setLoading(true);
  setError('');

  const response = await axios.post(`${API_URL}/auth/email-login`, {
    email: email.toLowerCase(),
    circle: selectedCircle,
    department: selectedDepartment
  });

  if (response.data.success) {
    localStorage.setItem('token', response.data.token);
    window.location.href = '/';
  }
} catch (err: any) {
  console.error('Login error:', err);
  setError(err.response?.data?.message || 'Login failed. Please try again.');
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <img 
            src="/images/Fincra_coloured_full_logo.png" 
            alt="Fincra" 
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fincra Wisdom</h1>
          <p className="text-gray-600">Your Single Source of Truth</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600">Sign in to access the knowledge hub</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Work Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fincra.com or you@boldbank.ng"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Select Circle */}
            <div className="mb-4">
              <label htmlFor="circle" className="block text-sm font-medium text-gray-700 mb-2">
                Your Circle
              </label>
              <select
                id="circle"
                value={selectedCircle}
                onChange={(e) => {
                  setSelectedCircle(e.target.value);
                  setSelectedDepartment('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select your circle...</option>
                {circles.map((circle) => (
                  <option key={circle._id} value={circle._id}>
                    {circle.icon} {circle.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Department */}
            <div className="mb-6">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Your Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedCircle}
                required
              >
                <option value="">Select your department...</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {!selectedCircle && (
                <p className="text-sm text-gray-500 mt-2">Select a circle first</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !selectedCircle || !selectedDepartment}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Access Knowledge Hub'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Only @fincra.com and @boldbank.ng email addresses are allowed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          © 2025 Fincra Wisdom. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;