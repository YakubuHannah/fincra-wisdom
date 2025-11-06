import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, X, Sparkles, Bookmark, Bell, User, FileText, Clock, Star, TrendingDown } from 'lucide-react';
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
      // Update CEO's Office to CEO Circle
      const updatedData = data.map(circle => 
        circle.name === "The CEO's Office" 
          ? { ...circle, name: "CEO Circle" }
          : circle
      );
      setCircles(updatedData);
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

  // Mock data for new sections (replace with real data later)
  const frequentDocs = [
    { id: 1, title: 'Remittance Process Guide', department: 'Remittance', views: 234 },
    { id: 2, title: 'Treasury FX Guidelines', department: 'FX (Treasury)', views: 189 },
    { id: 3, title: 'Sales Playbook 2025', department: 'Sales', views: 156 }
  ];

  const recommendedDocs = [
    { id: 1, title: 'New Compliance Requirements', department: 'Compliance', date: '2 days ago' },
    { id: 2, title: 'Q1 Strategy Overview', department: 'Strategy', date: '1 week ago' },
    { id: 3, title: 'Customer Support Best Practices', department: 'Customer Support', date: '3 days ago' }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Animated Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/images/Fincra_coloured_full_logo.png" 
                alt="Fincra" 
                className="h-10 sm:h-12 transition-transform hover:scale-105"
              />
              <h1 className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Wisdom
              </h1>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* AI Wisdom Button */}
              <button className="group flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-medium">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">AI Wisdom</span>
                <span className="sm:hidden">AI</span>
              </button>

              {/* Icons */}
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
        {/* Hero Section with Search */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Your Single Source of{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Truth
            </span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Search across all circles and departments
          </p>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-2xl">
                <div className="bg-white rounded-xl flex items-center">
                  <Search className="ml-6 w-6 h-6 text-purple-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for documents, departments, or topics..."
                    className="w-full px-4 py-5 text-lg bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
                  />
                  <button 
                    type="submit"
                    className="mr-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-sm animate-shake">
            {error}
          </div>
        )}

        {/* Circles Grid */}
        <div className="mb-16" id="organizational-circles">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Organizational <span className="text-purple-600">Circles</span>
            </h2>
            <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {circles.length} Active
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circles.map((circle, index) => (
              <div
                key={circle._id}
                onClick={() => handleCircleClick(circle.slug)}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-purple-100 hover:border-purple-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {circle.icon}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md"
                      style={{ backgroundColor: circle.color }}
                    >
                      {Array.isArray(circle.departments) ? circle.departments.length : 0} Depts
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {circle.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{circle.description}</p>
                </div>
                <div
                  className="h-2 group-hover:h-3 transition-all duration-300"
                  style={{ 
                    background: `linear-gradient(90deg, ${circle.color}, ${circle.color}dd)` 
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Frequently Visited */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-xl mr-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Frequently Visited</h3>
            </div>
            <div className="space-y-3">
              {frequentDocs.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer group"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      {doc.title}
                    </div>
                    <div className="text-sm text-gray-500">{doc.department}</div>
                  </div>
                  <div className="text-sm font-semibold text-purple-600">{doc.views} views</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Documents */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-xl mr-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Recommended</h3>
            </div>
            <div className="space-y-3">
              {recommendedDocs.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-start p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer group"
                >
                  <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {doc.department} • {doc.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Departments */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-xl mr-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Most Visited Departments</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Sales', visits: 1234, trend: '+12%' },
                { name: 'Remittance', visits: 987, trend: '+8%' },
                { name: 'Treasury', visits: 856, trend: '+15%' }
              ].map((dept, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-medium text-gray-900">{dept.name}</div>
                    <div className="text-sm text-gray-500">{dept.visits} visits</div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">{dept.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-purple-100">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Platform Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={scrollToCircles}
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-5xl font-bold text-purple-600 group-hover:scale-110 transition-transform mb-2">
                {circles.length}
              </div>
              <div className="text-sm font-semibold text-gray-700">Active Circles →</div>
            </div>
            <div 
              onClick={() => setShowAllDepartments(true)}
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-5xl font-bold text-blue-600 group-hover:scale-110 transition-transform mb-2">
                {totalDepartments}
              </div>
              <div className="text-sm font-semibold text-gray-700">Departments →</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-5xl font-bold text-green-600 mb-2">0</div>
              <div className="text-sm font-semibold text-gray-700">Documents</div>
            </div>
          </div>
        </div>
      </main>

      {/* All Departments Modal */}
      {showAllDepartments && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-900">
                All Departments ({totalDepartments})
              </h2>
              <button
                onClick={() => setShowAllDepartments(false)}
                className="p-2 hover:bg-white rounded-xl transition-all hover:scale-110"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-88px)]">
              {circles.map((circle) => {
                const depts = Array.isArray(circle.departments) ? circle.departments as Department[] : [];
                return (
                  <div key={circle._id} className="mb-8 last:mb-0">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{circle.icon}</span>
                      <h3 className="text-xl font-bold" style={{ color: circle.color }}>
                        {circle.name} ({depts.length})
                      </h3>
                    </div>
                    <div className="ml-12 space-y-3">
                      {depts.map((dept) => (
                        <div
                          key={dept._id}
                          onClick={() => {
                            setShowAllDepartments(false);
                            navigate(`/departments/${dept.slug}`);
                          }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5"
                        >
                          <div>
                            <div className="font-semibold text-gray-900">{dept.name}</div>
                            {dept.teamLead && (
                              <div className="text-sm text-gray-600 mt-1">Lead: {dept.teamLead}</div>
                            )}
                          </div>
                          <div className="text-sm font-medium text-purple-600">{dept.documentCount || 0} docs</div>
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

export default HomePage;