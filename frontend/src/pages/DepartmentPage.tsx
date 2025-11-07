import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Sparkles, Clock, User, Shield, Download, Eye, Filter, ChevronDown } from 'lucide-react';
import { Department } from '../types';
import departmentService from '../services/departmentService';
import documentService, { Document } from '../services/documentService';

const DepartmentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    { value: 'all', label: 'All Documents', icon: '📚' },
    { value: 'SOP', label: 'SOP', icon: '📋' },
    { value: 'Report', label: 'Report', icon: '📊' },
    { value: 'Template', label: 'Template', icon: '📄' },
    { value: 'Guide', label: 'Guide', icon: '📖' },
    { value: 'Policy', label: 'Policy', icon: '⚖️' },
    { value: 'Manual', label: 'Manual', icon: '📗' },
  ];

  const aiSuggestions: Record<string, string[]> = {
    SOP: [
      "What are the step-by-step instructions in this SOP?",
      "Who needs to approve this process?",
      "What are the prerequisites for starting this process?",
      "How often should this SOP be reviewed?"
    ],
    Report: [
      "What are the key findings in this report?",
      "What metrics improved this quarter?",
      "What are the main recommendations?",
      "How does this compare to previous periods?"
    ],
    Template: [
      "How do I use this template?",
      "What sections need to be filled out?",
      "Can you show me an example?",
      "What's the best practice for using this?"
    ],
    Guide: [
      "What's the main objective of this guide?",
      "What are the key steps to follow?",
      "Are there any common mistakes to avoid?",
      "Where can I find related resources?"
    ],
    Policy: [
      "What are the compliance requirements?",
      "Who does this policy apply to?",
      "What are the consequences of non-compliance?",
      "When was this policy last updated?"
    ],
    Manual: [
      "How do I get started with this system?",
      "What troubleshooting steps are available?",
      "Where can I find advanced features?",
      "Who do I contact for support?"
    ]
  };

  useEffect(() => {
    if (slug) {
      fetchDepartment(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (department) {
      fetchDocuments();
    }
  }, [department]);

  useEffect(() => {
    filterDocuments();
  }, [selectedCategory, documents]);

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

  const fetchDocuments = async () => {
    try {
      if (!department?._id) return;
      
      const response = await documentService.getDocumentsByDepartment(department._id);
      setDocuments(response.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const filterDocuments = () => {
    if (selectedCategory === 'all') {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(documents.filter(doc => doc.category === selectedCategory));
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      await documentService.incrementDownloadCount(doc._id);
      window.open(doc.fileUrl, '_blank');
    } catch (err) {
      console.error('Error downloading document:', err);
    }
  };

  const handleAskQuestion = (question: string) => {
    navigate(`/?question=${encodeURIComponent(question)}`);
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const currentCategory = categories.find(cat => cat.value === selectedCategory);
  const currentSuggestions = selectedCategory !== 'all' ? aiSuggestions[selectedCategory] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

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

              <button className="p-1 hover:scale-110 transition-transform">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow">
                  P
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                    {documents.length} Documents
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/admin/documents')}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
            >
              <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-purple-100">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Filter by Category:</span>
                
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-purple-200 rounded-xl hover:border-purple-400 transition-all"
                  >
                    <span className="text-xl">{currentCategory?.icon}</span>
                    <span className="font-medium text-gray-900">{currentCategory?.label}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-purple-100 py-2 z-50">
                      {categories.map((cat) => {
                        const count = cat.value === 'all' 
                          ? documents.length 
                          : documents.filter(doc => doc.category === cat.value).length;
                        
                        return (
                          <button
                            key={cat.value}
                            onClick={() => {
                              setSelectedCategory(cat.value);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2 hover:bg-purple-50 transition-colors ${
                              selectedCategory === cat.value ? 'bg-purple-50' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{cat.icon}</span>
                              <span className="font-medium text-gray-900">{cat.label}</span>
                            </div>
                            <span className="text-sm text-gray-500">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-purple-600">{filteredDocuments.length}</span> documents
              </div>
            </div>

            {currentSuggestions.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-md p-6 border border-purple-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">AI Suggested Questions for {currentCategory?.label}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentSuggestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleAskQuestion(question)}
                      className="text-left px-4 py-3 bg-white rounded-xl hover:shadow-lg hover:scale-105 transition-all border border-purple-100 hover:border-purple-300 group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                        💬 {question}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Documents & Resources
          </h2>
          
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc, index) => (
                <div
                  key={doc._id}
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        {doc.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    
                    {doc.summary && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {doc.summary}
                      </p>
                    )}

                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doc.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(doc.createdAt)}</span>
                        </div>
                        <span>{formatFileSize(doc.fileSize)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>{doc.viewCount} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>{doc.downloadCount} downloads</span>
                        </div>
                      </div>

                      {doc.author && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <User className="w-4 h-4" />
                          <span>By {doc.author}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex items-center space-x-3">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    
                    <button
                      onClick={() => handleAskQuestion(`Tell me about ${doc.title}`)}
                      className="p-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-all"
                      title="Ask AI about this document"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : documents.length > 0 ? (
            <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-purple-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents in This Category</h3>
              <p className="text-gray-600 mb-6">
                Try selecting a different category or upload a new document.
              </p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
              >
                <span>View All Documents</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-purple-200">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to upload a document to this department.
              </p>
              <button 
                onClick={() => navigate('/admin/documents')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
              >
                <Upload className="w-5 h-5" />
                <span>Upload First Document</span>
              </button>
            </div>
          )}
        </div>
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

export default DepartmentPage;