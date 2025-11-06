import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Sparkles, Bookmark, Bell, Clock, User } from 'lucide-react';
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
      setError('Failed to load department details.');
      console.error('Error fetching department:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested department could not be found.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Mock documents (replace with real data later)
  const documents = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Animated Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/Fincra_coloured_full_logo.png" 
                alt="Fincra" 
                className="h-10 sm:h-12 transition-transform hover:scale-105 cursor-pointer"
                onClick={() => navigate('/')}
              />
              <h1 
                className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate('/')}
              >
                Wisdom
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="group flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-medium">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Ask Wisdom</span>
                <span className="sm:hidden">Ask</span>
              </button>

              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-110">
                <Bookmark className="w-5 h-5" />
              </button>

              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-110 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              <button className="p-1 hover:scale-110 transition-transform">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow">
                  P
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-purple-600 transition-colors"
          >
            Home
          </button>
          <span>→</span>
          <button 
            onClick={() => navigate(-1)}
            className="hover:text-purple-600 transition-colors"
          >
            {department.circleName || 'Circle'}
          </button>
          <span>→</span>
          <span className="text-gray-900 font-medium">{department.name}</span>
        </div>

        {/* Department Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-12 border border-purple-100 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{department.name}</h1>
              {department.description && (
                <p className="text-lg text-gray-600 leading-relaxed mb-4">{department.description}</p>
              )}
              <div className="flex flex-wrap gap-4">
                {department.teamLead && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-xl">
                    <User className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">
                      <span className="text-gray-600">Lead:</span>{' '}
                      <span className="font-semibold text-gray-900">{department.teamLead}</span>
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {department.documentCount || 0} Documents
                  </span>
                </div>
              </div>
            </div>
            
            <button className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium">
              <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Documents & Resources
          </h2>
          
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc: any, index: number) => (
                <div
                  key={index}
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-purple-100 hover:border-purple-300 hover:-translate-y-2 p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      PDF
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                    {doc.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {doc.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{doc.date}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {doc.views} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-purple-200">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to upload a document to this department.
              </p>
              <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium">
                <Upload className="w-5 h-5" />
                <span>Upload First Document</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-100 mt-16">
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