import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Users, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface Department {
  _id: string;
  name: string;
  description?: string;
}

interface Circle {
  _id: string;
  name: string;
  description?: string;
}

const SetupProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    // If user already has department and circle, redirect to home
    if (user?.department && user?.circle) {
      navigate('/');
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [deptResponse, circleResponse] = await Promise.all([
        axios.get(`${API_URL}/departments`),
        axios.get(`${API_URL}/circles`)
      ]);

      setDepartments(deptResponse.data.data || []);
      setCircles(circleResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load departments and circles');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDepartment || !selectedCircle) {
      setError('Please select both department and circle');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        {
          department: selectedDepartment,
          circle: selectedCircle,
        },
        { withCredentials: true }
      );

      // Update user in context with ALL fields
      if (response.data.user) {
        updateUser({
          department: response.data.user.department,
          circle: response.data.user.circle,
        });
      }
      
      // Small delay to ensure state updates
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Complete Your Profile
          </h1>
          <p className="text-lg text-gray-600">
            Welcome {user?.name}! Please select your department and circle to get started.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Selection */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span>Select Your Department</span>
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all text-gray-900"
                required
              >
                <option value="">Choose a department...</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {departments.find(d => d._id === selectedDepartment)?.description && (
                <p className="text-xs text-gray-600 mt-2">
                  {departments.find(d => d._id === selectedDepartment)?.description}
                </p>
              )}
            </div>

            {/* Circle Selection */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Select Your Circle</span>
              </label>
              <select
                value={selectedCircle}
                onChange={(e) => setSelectedCircle(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all text-gray-900"
                required
              >
                <option value="">Choose a circle...</option>
                {circles.map((circle) => (
                  <option key={circle._id} value={circle._id}>
                    {circle.name}
                  </option>
                ))}
              </select>
              {circles.find(c => c._id === selectedCircle)?.description && (
                <p className="text-xs text-gray-600 mt-2">
                  {circles.find(c => c._id === selectedCircle)?.description}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedDepartment || !selectedCircle}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg group"
            >
              <span>{loading ? 'Saving...' : 'Complete Setup'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          You can update your department and circle later in your profile settings.
        </p>
      </div>
    </div>
  );
};

export default SetupProfilePage;