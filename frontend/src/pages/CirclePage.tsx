import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Users, Sparkles, Shield } from 'lucide-react';
import Header from '../components/Header';
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
      if (data.name === "The CEO's Office") {
        data.name = "CEO Circle";
      }
      setCircle(data);
      setError(null);
    } catch (err) {
      setError('Failed to load circle details.');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (error || !circle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Circle Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested circle could not be found.'}</p>
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

  const departments = Array.isArray(circle.departments) ? circle.departments as Department[] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <Header />
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8 transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Circles</span>
        </button>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-12 border border-purple-100 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-lg"
              style={{ backgroundColor: `${circle.color}20` }}
            >
              {circle.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-gray-900">{circle.name}</h1>
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-md"
                  style={{ backgroundColor: circle.color }}
                >
                  {departments.length} Departments
                </span>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">{circle.description}</p>
            </div>
          </div>
        </div>

        {departments.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Departments in <span style={{ color: circle.color }}>{circle.name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <div
                  key={dept._id}
                  onClick={() => handleDepartmentClick(dept.slug)}
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-purple-100 hover:border-purple-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                          {dept.name}
                        </h3>
                        {dept.teamLead && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>Lead: {dept.teamLead}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {dept.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{dept.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span>{dept.documentCount || 0} documents</span>
                      </div>
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all"
                        style={{ backgroundColor: `${circle.color}20` }}
                      >
                        <span style={{ color: circle.color }}>→</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="h-2 group-hover:h-3 transition-all duration-300"
                    style={{ background: `linear-gradient(90deg, ${circle.color}, ${circle.color}dd)` }}
                  ></div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Departments Yet</h3>
            <p className="text-gray-600">Departments will appear here once they're added to this circle.</p>
          </div>
        )}
      </main>

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

export default CirclePage;