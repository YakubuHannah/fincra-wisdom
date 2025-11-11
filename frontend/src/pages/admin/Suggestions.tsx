import React, { useEffect, useState } from 'react';
import documentService, { Document } from '../../services/documentService';
import { Eye, Check, X } from 'lucide-react';
import DocumentViewer from '../../components/DocumentViewer';

interface Suggestion {
  _id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  submitterEmail?: string;
  departmentName?: string;
  createdAt: string;
}

const SuggestionsPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const res = await documentService.getSuggestions();
      setSuggestions(res.data || []);
    } catch (err) {
      console.error('Error fetching suggestions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await documentService.approveSuggestion(id);
      await fetchSuggestions();
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await documentService.rejectSuggestion(id, rejectNotes);
      setRejectNotes('');
      setRejectingId(null);
      await fetchSuggestions();
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

  if (loading) return <div className="py-12">Loading...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suggested Documents</h1>
      </div>

      {suggestions.length === 0 ? (
        <div className="p-8 bg-white rounded-xl">No suggestions found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {suggestions.map(s => (
            <div key={s._id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-xs text-gray-500">{s.departmentName} • {s.submitterEmail || 'Unknown'}</div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setSelectedSuggestion(s)} className="p-2 bg-gray-50 rounded-md"><Eye className="w-4 h-4"/></button>
                <button onClick={() => handleApprove(s._id)} className="p-2 bg-green-50 text-green-600 rounded-md"><Check className="w-4 h-4"/></button>
                <button onClick={() => setRejectingId(s._id)} className="p-2 bg-red-50 text-red-600 rounded-md"><X className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Viewer Modal */}
      {selectedSuggestion && (
        <DocumentViewer document={selectedSuggestion as unknown as Document} onClose={() => setSelectedSuggestion(null)} />
      )}

      {/* Reject modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-3">Reject Suggestion</h3>
            <textarea value={rejectNotes} onChange={(e)=>setRejectNotes(e.target.value)} className="w-full border p-3 rounded-md mb-4" rows={4} placeholder="Reason for rejection (optional)" />
            <div className="flex justify-end space-x-3">
              <button onClick={()=>setRejectingId(null)} className="px-4 py-2 border rounded-md">Cancel</button>
              <button onClick={()=>handleReject(rejectingId)} className="px-4 py-2 bg-red-600 text-white rounded-md">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPage;
