import React, { useState } from 'react';
import { X, Download, FileText, AlertCircle } from 'lucide-react';
import { Document } from '../services/documentService';
import { useAuth } from '../contexts/AuthContext';
import documentService from '../services/documentService';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadError(null);

      // Increment download count
      await documentService.incrementDownloadCount(document._id);

      // Create download link
      const link = globalThis.document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.title || 'document';
      link.target = '_blank';
      globalThis.document.body.appendChild(link);
      link.click();
      globalThis.document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading document:', err);
      setDownloadError('Failed to download document. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Check if document is PDF or can be viewed as PDF
  const isPdf = document.fileType?.toLowerCase() === 'pdf' ||
    document.fileName?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full h-full max-w-6xl max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <FileText className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {document.title}
              </h2>
              <p className="text-xs text-gray-600 truncate">
                {document.fileName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {isAdmin && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                <Download className={`w-4 h-4 ${downloading ? 'animate-spin' : ''}`} />
                <span>{downloading ? 'Downloading...' : 'Download'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Close document viewer"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Error message */}
        {downloadError && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{downloadError}</p>
          </div>
        )}

        {/* Document Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {isPdf ? (
            // PDF Viewer using iframe with Google Docs PDF Viewer
            <iframe
              key={document._id}
              src={`https://docs.google.com/gview?url=${encodeURIComponent(document.fileUrl)}&embedded=true`}
              className="w-full h-full border-0"
              title={document.title}
              onError={() => (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">Unable to display PDF</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {isAdmin ? 'You can download the document instead.' : 'Please contact an administrator.'}
                    </p>
                  </div>
                </div>
              )}
            />
          ) : (
            // For non-PDF files, show download prompt
            <div className="flex flex-col items-center justify-center h-full p-8">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cannot Preview This File
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                This document format ({document.fileType?.toUpperCase()}) cannot be previewed in the browser.
                {isAdmin && ' You can download it instead.'}
              </p>

              {isAdmin && (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Download className={`w-5 h-5 ${downloading ? 'animate-spin' : ''}`} />
                  <span>{downloading ? 'Downloading...' : 'Download Document'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer with metadata */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-6">
            <div>
              <span className="font-semibold text-gray-900">{document.viewCount}</span> views
            </div>
            {isAdmin && (
              <div>
                <span className="font-semibold text-gray-900">{document.downloadCount}</span> downloads
              </div>
            )}
            <div>
              By <span className="font-semibold text-gray-900">{document.author || 'Unknown'}</span>
            </div>
          </div>
          <div className="text-gray-500">
            {new Date(document.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
