import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarkContext';
import { ArrowLeft, Bookmark, FileText, Trash2, Sparkles } from 'lucide-react';

const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookmarks, removeBookmark } = useBookmarks();

  const getFileIcon = (fileType: string) => {
    const icons: Record<string, string> = {
      pdf: '📕', doc: '📘', docx: '📘', ppt: '📙', pptx: '📙',
      xls: '📗', xlsx: '📗', txt: '📄', md: '📝'
    };
    return icons[fileType?.toLowerCase()] || '📄';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-purple-600">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-3xl font-bold mb-8">My Bookmarks ({bookmarks.length})</h1>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookmarks.map((doc) => (
              <div key={doc._id} className="bg-white rounded-2xl shadow-md p-6 border border-purple-100">
                <div className="text-4xl mb-4">{getFileIcon(doc.fileType)}</div>
                <h3 className="text-lg font-bold mb-2">{doc.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{doc.departmentName}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/departments/${doc.departmentSlug}`)}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => removeBookmark(doc._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="text-6xl mb-4">🔖</div>
            <h3 className="text-2xl font-bold mb-2">No Bookmarks Yet</h3>
            <p className="text-gray-600 mb-6">Start bookmarking documents!</p>
            <button
              onClick={() => navigate('/category')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl"
            >
              Browse Documents
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;