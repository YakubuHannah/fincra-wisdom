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

const SetupProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchCircles();
  }, []);

  useEffect(() => {
    if (selectedCircle) {
      fetchDepartments(selectedCircle);
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
    
    if (!selectedCircle || !selectedDepartment) {
      setError('Please select both circle and department');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${API_URL}/auth/profile`,
        {
          circle: selectedCircle,
          department: selectedDepartment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      updateUser({ circle: selectedCircle, department: selectedDepartment });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="/images/Fincra_coloured_full_logo.png" 
            alt="Fincra" 
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Fincra Wisdom!</h1>
          <p className="text-gray-600">Please complete your profile to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Select Circle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Circle
              </label>
              <select
                value={selectedCircle}
                onChange={(e) => {
                  setSelectedCircle(e.target.value);
                  setSelectedDepartment('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a circle...</option>
                {circles.map((circle) => (
                  <option key={circle._id} value={circle._id}>
                    {circle.icon} {circle.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Department */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedCircle}
                required
              >
                <option value="">Choose a department...</option>
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
              disabled={loading || !selectedCircle || !selectedDepartment}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupProfilePage;