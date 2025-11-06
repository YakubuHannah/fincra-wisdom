import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home, FileText, Upload, Download } from 'lucide-react';
import { Department } from '../types';
import departmentService from '../services/departmentService';

const DepartmentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchDepartment(slug);
    }
  }, [slug]);

  const fetchDepartment = async (deptSlug: string) => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartmentBySlug(deptSlug);
      setDepartment(data);
      setError(null);
    } catch (err) {
      setError('Department not found');
      console.error('Error fetching department:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Not Found</h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/images/Fincra_coloured_full_logo.png" 
                alt="Fincra" 
                className="h-8 w-auto"
              />
              <div className="border-l border-gray-300 h-8"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fincra Wisdom</h1>
                <p className="mt-1 text-sm text-gray-600">Your Single Source of Truth</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600 flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          {department.circle && (
            <>
              <Link 
                to={`/circles/${department.circle.slug}`} 
                className="hover:text-blue-600"
              >
                {department.circle.name}
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
            </>
          )}
          <span className="text-gray-900 font-medium">{department.name}</span>
        </nav>

        {/* Department Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-5xl mr-4">{department.icon || '📂'}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{department.name}</h1>
                {department.description && (
                  <p className="text-gray-600 mb-4">{department.description}</p>
                )}
                {department.teamLead && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Team Lead:</span> {department.teamLead}
                  </p>
                )}
              </div>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {department.documentCount || 0} Documents
            </span>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Documents</h2>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </button>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No documents available yet
            </h3>
            <p className="text-gray-600 mb-6">
              Documents for this department will appear here once they are uploaded.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              Upload First Document
            </button>
          </div>
        </div>
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

export default DepartmentPage;