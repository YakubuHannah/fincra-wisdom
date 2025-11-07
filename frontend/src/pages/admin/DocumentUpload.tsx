import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import circleService from '../../services/circleService';
import departmentService from '../../services/departmentService';
import documentService from '../../services/documentService';
import type { Circle, Department } from '../../types';

const DocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  // Data state
  const [circles, setCircles] = useState<Circle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  
  // UI state
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Fetch circles on mount
  useEffect(() => {
    fetchCircles();
    fetchDepartments();
  }, []);

  // Filter departments when circle changes
  useEffect(() => {
    if (selectedCircle && departments.length > 0) {
      const filtered = departments.filter(
        (dept) => {
          const deptCircleId = typeof dept.circleId === 'string' 
            ? dept.circleId 
            : dept.circleId?._id;
          return deptCircleId === selectedCircle;
        }
      );
      setFilteredDepartments(filtered);
      setSelectedDepartment(''); // Reset department when circle changes
    } else {
      setFilteredDepartments([]);
    }
  }, [selectedCircle, departments]);

  const fetchCircles = async () => {
    try {
      const response = await circleService.getAllCircles();
      setCircles(response.data || response);
    } catch (err) {
      console.error('Error fetching circles:', err);
      setError('Failed to load circles');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data || response);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      
      // Auto-fill title if empty
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      
      // Validate file size
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!file || !selectedDepartment || !title || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await documentService.uploadDocument({
        title,
        description,
        circleId: selectedCircle,
        departmentId: selectedDepartment,
        category,
        tags: tagsArray,
        author: author || 'Anonymous',
        file
      });

      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm();
        setSuccess(false);
      }, 2000);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedCircle('');
    setSelectedDepartment('');
    setCategory('');
    setTags('');
    setAuthor('');
    setFile(null);
    setError('');
  };

  const removeFile = () => {
    setFile(null);
  };

  const categories = ['SOP', 'Report', 'Template', 'Guide', 'Policy', 'Manual', 'Other'];

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-4 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h1>
          <p className="text-gray-600">Add a new document to the knowledge base</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center space-x-3 animate-fade-in">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Document uploaded successfully!</p>
              <p className="text-sm text-green-700">Your document is now available in the knowledge base.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center space-x-3 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Upload failed</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-8 space-y-6">
          
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document File <span className="text-red-500">*</span>
            </label>
            
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-purple-300 bg-purple-50 hover:bg-purple-100'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, MD (Max 10MB)
                </p>
                <label className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg cursor-pointer transition-all">
                  Browse Files
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md"
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-10 h-10 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 break-all">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g., Q4 Sales Report 2024"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Brief description of the document content..."
            />
          </div>

          {/* Circle and Department Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Circle Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Circle <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCircle}
                onChange={(e) => setSelectedCircle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select a circle</option>
                {circles.map((circle) => (
                  <option key={circle._id} value={circle._id}>
                    {circle.icon} {circle.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={!selectedCircle}
              >
                <option value="">Select a department</option>
                {filteredDepartments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {!selectedCircle && (
                <p className="text-xs text-gray-500 mt-1">Select a circle first</p>
              )}
            </div>
          </div>

          {/* Category and Author Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Your name (optional)"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g., sales, quarterly, report (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={uploading || !file || !selectedDepartment || !title || !category}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              disabled={uploading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default DocumentUpload;