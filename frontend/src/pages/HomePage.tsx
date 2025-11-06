import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, TrendingUp, X, Sparkles, Bookmark, Bell } from 'lucide-react';
import { Circle, Department } from '../types';
import circleService from '../services/circleService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllDepartments, setShowAllDepartments] = useState(false);

  useEffect(() => {
    fetchCircles();
  }, []);

  const fetchCircles = async () => {
    try {
      setLoading(true);
      const data = await circleService.getAllCircles();
      setCircles(data);
      setError(null);
    } catch (err) {
      setError('Failed to load circles. Please try again.');
      console.error('Error fetching circles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCircleClick = (slug: string) => {
    navigate(`/circles/${slug}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const scrollToCircles = () => {
    const circlesSection = document.getElementById('organizational-circles');
    circlesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalDepartments = circles.reduce(
    (acc, circle) => acc + (Array.isArray(circle.departments) ? circle.departments.length : 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo - Hidden text on mobile */}
      <div className="flex items-center space-x-3">
        <img 
          src="/images/Fincra_coloured_full_logo.png" 
          alt="Fincra" 
          className="h-8"
        />
        <h1 className="hidden sm:block text-xl font-bold text-gray-900">
          Fincra Wisdom
        </h1>
      </div>

      {/* Right side icons - Adjusted spacing */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Ask AI Button - Compact on mobile */}
        <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Icons - Smaller on mobile */}
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <Bookmark className="w-5 h-5" />
        </button>

        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="p-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            P
          </div>
        </button>
      </div>
    </div>
  </div>
</header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for documents, departments, or topics..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Circles Grid */}
        <div className="mb-12" id="organizational-circles">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Organizational Circles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circles.map((circle) => (
              <div
                key={circle._id}
                onClick={() => handleCircleClick(circle.slug)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{circle.icon}</span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: circle.color }}
                    >
                      {Array.isArray(circle.departments) ? circle.departments.length : 0} Departments
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {circle.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{circle.description}</p>
                </div>
                <div
                  className="h-1"
                  style={{ backgroundColor: circle.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats - Now Clickable */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={scrollToCircles}
              className="text-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
            >
              <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
                {circles.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Circles →</div>
            </div>
            <div 
              onClick={() => setShowAllDepartments(true)}
              className="text-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
            >
              <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform">
                {totalDepartments}
              </div>
              <div className="text-sm text-gray-600 mt-1">Departments →</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600 mt-1">Documents</div>
            </div>
          </div>
        </div>
      </main>

      {/* All Departments Modal */}
      {showAllDepartments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                All Departments ({totalDepartments})
              </h2>
              <button
                onClick={() => setShowAllDepartments(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              {circles.map((circle) => {
                const depts = Array.isArray(circle.departments) ? circle.departments as Department[] : [];
                return (
                  <div key={circle._id} className="mb-6 last:mb-0">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-2">{circle.icon}</span>
                      <h3 className="text-lg font-semibold" style={{ color: circle.color }}>
                        {circle.name} ({depts.length})
                      </h3>
                    </div>
                    <div className="ml-10 space-y-2">
                      {depts.map((dept) => (
                        <div
                          key={dept._id}
                          onClick={() => {
                            setShowAllDepartments(false);
                            navigate(`/departments/${dept.slug}`);
                          }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{dept.name}</div>
                            {dept.teamLead && (
                              <div className="text-sm text-gray-600">Lead: {dept.teamLead}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{dept.documentCount || 0} docs</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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

export default HomePage;