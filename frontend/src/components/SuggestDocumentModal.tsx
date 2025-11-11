import React, { useState } from 'react';
import { X, Upload as UploadIcon } from 'lucide-react';
import documentService, { UploadDocumentData } from '../services/documentService';
interface Props {
  departmentId: string;
  circleId: string;
  onClose: () => void;
  onSuggested?: () => void;
}

const SuggestDocumentModal: React.FC<Props> = ({ departmentId, circleId, onClose, onSuggested }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    if (!title) return setError('Please provide a title');

    setLoading(true);
    setError(null);
    try {
      const payload: UploadDocumentData = {
        title,
        description,
        circleId,
        departmentId,
        category,
        file,
      };
      await documentService.suggestDocument(payload);
      if (onSuggested) onSuggested();
      onClose();
    } catch (err: any) {
      console.error('Suggest upload failed', err);
      setError(err?.response?.data?.message || 'Failed to suggest document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Suggest a Document for Upload</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5"/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded-md" rows={3} />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Category</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border px-3 py-2 rounded-md">
              <option>Other</option>
              <option>SOP</option>
              <option>Report</option>
              <option>Template</option>
              <option>Guide</option>
              <option>Policy</option>
              <option>Manual</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">File</label>
            <label className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer bg-white">
              <UploadIcon className="w-4 h-4" />
              <span className="text-sm">{file ? file.name : 'Select file (pdf, docx, etc)'}</span>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              {loading ? 'Submitting...' : 'Suggest for Review'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-500">Your suggestion will be sent to admins for review. It will not be published until approved.</p>
      </div>
    </div>
  );
};

export default SuggestDocumentModal;
