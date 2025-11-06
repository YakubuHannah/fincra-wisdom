import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home, Users, FileText } from 'lucide-react';
import { Circle, Department } from '../types';
import circleService from '../services/circleService';

const CirclePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchCircle(slug);
    }
  }, [slug]);

  const fetchCircle = async (circleSlug: string) => {
    try {
      setLoading(true);
      const data = await circleService.getCircleBySlug(circleSlug);
      setCircle(data);
      setError(null);
    } catch (err) {
      setError('Circle not found');
      console.error('Error fetching circle:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = (deptSlug: string) => {
    navigate(`/departments/${deptSlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !circle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Circle Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const departments = Array.isArray(circle.departments)
    ? (circle.departments as Department[])
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-blue-600 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">{circle.name}</span>
          </nav>

          {/* Circle Header */}
          <div className="flex items-center">
            <span className="text-5xl mr-4">{circle.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{circle.name}</h1>
              <p className="text-gray-600 mt-1">{circle.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Departments ({departments.length})
          </h2>
          <p className="text-gray-600">
            Select a department to view its documentation and resources
          </p>
        </div>

        {/* Departments Grid */}
        {departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept._id}
                onClick={() => handleDepartmentClick(dept.slug)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{dept.icon || '📂'}</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {dept.documentCount} {dept.documentCount === 1 ? 'Doc' : 'Docs'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {dept.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Lead: {dept.teamLead}</span>
                  </div>
                  {dept.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{dept.description}</p>
                  )}
                </div>
                <div
                  className="h-1"
                  style={{ backgroundColor: circle.color }}
                ></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Departments Yet</h3>
            <p className="text-gray-600">Departments will appear here once they are added.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Fincra Wisdom. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CirclePage;