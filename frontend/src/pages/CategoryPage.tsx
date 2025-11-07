import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, X, Sparkles, Bookmark, Bell, User, FileText, Clock, Star, Shield, Download, Eye } from 'lucide-react';
import { Circle, Department } from '../types';
import circleService from '../services/circleService';
import documentService, { Document } from '../services/documentService';

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch circles
      const circlesData = await circleService.getAllCircles();
      const updatedCircles = circlesData.map(circle => 
        circle.name === "The CEO's Office" 
          ? { ...circle, name: "CEO Circle" }
          : circle
      );
      setCircles(updatedCircles);

      // Fetch all documents
      const docsResponse = await documentService.getAllDocuments();
      setDocuments(docsResponse.data || []);
      
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error fetching data:', err);
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

  // Group documents by department
  const documentsByDepartment = documents.reduce((acc, doc) => {
    const deptId = typeof doc.departmentId === 'string' ? doc.departmentId : doc.departmentId._id;
    if (!acc[deptId]) {
      acc[deptId] = [];
    }
    acc[deptId].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // Get top 3 most visited documents
  const frequentDocs = [...documents]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 3);

  // Get 3 most recent documents
  const recommendedDocs = [...documents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get top 3 departments by document count
  const departmentDocCounts = circles.flatMap(circle => 
    Array.isArray(circle.departments) 
      ? (circle.departments as Department[]).map(dept => ({
          name: dept.name,
          count: documentsByDepartment[dept._id]?.length || 0
        }))
      : []
  ).sort((a, b) => b.count - a.count).slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFileIcon = (fileType: string) => {
    const icons: Record<string, string> = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      ppt: '📙',
      pptx: '📙',
      xls: '📗',
      xlsx: '📗',
      txt: '📄',
      md: '📝'
    };
    return icons[fileType?.toLowerCase()] || '📄';
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
              <button 
                onClick={() => navigate('/')}
                className="group flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Ask Wisdom</span>
                <span className="sm:hidden">Ask</span>
              </button>

              <button 
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all font-medium"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Admin</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
          {/* Frequently Visited */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm p-3 border border-purple-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Frequently Visited</h3>
            </div>
            <div className="space-y-1.5">
              {frequentDocs.length > 0 ? frequentDocs.map((doc) => (
                <div 
                  key={doc._id}
                  onClick={() => navigate(`/departments/${doc.slug}`)}
                  className="flex items-center justify-between p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                      {doc.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{doc.departmentName}</div>
                  </div>
                  <div className="text-xs font-semibold text-purple-600 ml-2">{doc.viewCount}</div>
                </div>
              )) : (
                <div className="text-xs text-gray-500 text-center py-4">No documents yet</div>
              )}
            </div>
          </div>

          {/* Recommended Documents */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm p-3 border border-blue-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                <Star className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Recently Added</h3>
            </div>
            <div className="space-y-1.5">
              {recommendedDocs.length > 0 ? recommendedDocs.map((doc) => (
                <div 
                  key={doc._id}
                  onClick={() => navigate(`/departments/${doc.slug}`)}
                  className="flex items-start p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group"
                >
                  <span className="text-lg mr-2 flex-shrink-0">{getFileIcon(doc.fileType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {doc.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {doc.departmentName} • {formatDate(doc.createdAt)}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-gray-500 text-center py-4">No documents yet</div>
              )}
            </div>
          </div>

          {/* Top Departments */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm p-3 border border-green-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg mr-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Top Departments</h3>
            </div>
            <div className="space-y-1.5">
              {departmentDocCounts.length > 0 ? departmentDocCounts.map((dept, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-gray-900 truncate">{dept.name}</div>
                    <div className="text-xs text-gray-500">{dept.count} documents</div>
                  </div>
                  <div className="text-xs font-semibold text-green-600">📚</div>
                </div>
              )) : (
                <div className="text-xs text-gray-500 text-center py-4">No documents yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm p-3 border border-purple-100 mb-8">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
            <h3 className="text-base font-bold text-gray-900">Platform Overview</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div 
              onClick={scrollToCircles}
              className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform mb-0.5">
                {circles.length}
              </div>
              <div className="text-xs font-semibold text-gray-700">Circles</div>
            </div>
            <div 
              onClick={() => setShowAllDepartments(true)}
              className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform mb-0.5">
                {totalDepartments}
              </div>
              <div className="text-xs font-semibold text-gray-700">Departments</div>
            </div>
            <div 
              onClick={() => setShowDocumentsModal(true)}
              className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform mb-0.5">
                {documents.length}
              </div>
              <div className="text-xs font-semibold text-gray-700">Documents</div>
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
                      {depts.map((dept) => {
                        const deptDocs = documentsByDepartment[dept._id] || [];
                        return (
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
                            <div className="text-sm font-medium text-purple-600">{deptDocs.length} docs</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  All Documents ({documents.length})
                </h2>
                <p className="text-sm text-gray-600 mt-1">Organized by department</p>
              </div>
              <button
                onClick={() => setShowDocumentsModal(false)}
                className="p-2 hover:bg-white rounded-xl transition-all hover:scale-110"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-88px)]">
              {circles.map((circle) => {
                const depts = Array.isArray(circle.departments) ? circle.departments as Department[] : [];
                const circleHasDocs = depts.some(dept => documentsByDepartment[dept._id]?.length > 0);
                
                if (!circleHasDocs) return null;

                return (
                  <div key={circle._id} className="mb-8 last:mb-0">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{circle.icon}</span>
                      <h3 className="text-xl font-bold" style={{ color: circle.color }}>
                        {circle.name}
                      </h3>
                    </div>
                    <div className="ml-12 space-y-6">
                      {depts.map((dept) => {
                        const deptDocs = documentsByDepartment[dept._id] || [];
                        if (deptDocs.length === 0) return null;

                        return (
                          <div key={dept._id} className="border-l-4 border-purple-200 pl-4">
                            <div 
                              onClick={() => {
                                setShowDocumentsModal(false);
                                navigate(`/departments/${dept.slug}`);
                              }}
                              className="flex items-center justify-between mb-3 cursor-pointer group"
                            >
                              <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {dept.name}
                              </h4>
                              <span className="text-sm text-purple-600">{deptDocs.length} documents →</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {deptDocs.slice(0, 4).map((doc) => (
                                <div
                                  key={doc._id}
                                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:shadow-md transition-all cursor-pointer group"
                                >
                                  <span className="text-2xl flex-shrink-0">{getFileIcon(doc.fileType)}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                                      {doc.title}
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                      <span className="flex items-center space-x-1">
                                        <Eye className="w-3 h-3" />
                                        <span>{doc.viewCount}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Download className="w-3 h-3" />
                                        <span>{doc.downloadCount}</span>
                                      </span>
                                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                        {doc.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {deptDocs.length > 4 && (
                              <button
                                onClick={() => {
                                  setShowDocumentsModal(false);
                                  navigate(`/departments/${dept.slug}`);
                                }}
                                className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                              >
                                View all {deptDocs.length} documents →
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {documents.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Upload your first document to get started.
                  </p>
                  <button
                    onClick={() => {
                      setShowDocumentsModal(false);
                      navigate('/admin/documents');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    Upload Document
                  </button>
                </div>
              )}
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

export default CategoryPage;