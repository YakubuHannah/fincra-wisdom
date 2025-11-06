import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react';
import circleService from '../../services/circleService';
import departmentService from '../../services/departmentService';
import { Circle, Department } from '../../types';

const DocumentUpload: React.FC = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCircles();
  }, []);

  const fetchCircles = async () => {
    try {
      const data = await circleService.getAllCircles();
      setCircles(data);
    } catch (err) {
      console.error('Error fetching circles:', err);
    }
  };

  const handleCircleChange = async (circleId: string) => {
    setSelectedCircle(circleId);
    setSelectedDepartment('');
    
    if (circleId) {
      const circle = circles.find(c => c._id === circleId);
      if (circle && Array.isArray(circle.departments)) {
        setDepartments(circle.departments as Department[]);
      }
    } else {
      setDepartments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !selectedDepartment || !title) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // TODO: Connect to actual upload API
      // Mock upload for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 3000);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setTags('');
    setSelectedCircle('');
    setSelectedDepartment('');
    setDepartments([]);
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h1>
        <p className="text-gray-600">Add new documents to the knowledge base</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center space-x-3 animate-fade-in">
          <Check className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">Document uploaded successfully!</p>
            <p className="text-sm text-green-700">Your document is now available in the knowledge base.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center space-x-3 animate-fade-in">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-semibold text-red-900">Upload failed</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document File *
            </label>
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-300 border-dashed rounded-2xl cursor-pointer bg-purple-50 hover:bg-purple-100 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, PPTX (MAX. 50MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter document title"
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
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Describe what this document contains..."
            />
          </div>

          {/* Circle Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Circle *
            </label>
            <select
              value={selectedCircle}
              onChange={(e) => handleCircleChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              Department *
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={!selectedCircle}
              required
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {!selectedCircle && (
              <p className="text-xs text-gray-500 mt-1">Select a circle first</p>
            )}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., process, guide, template (comma-separated)"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={uploading || !file || !selectedDepartment || !title}
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
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;