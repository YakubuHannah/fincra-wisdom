import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface UploadDocumentData {
  title: string;
  description?: string;
  circleId: string;
  departmentId: string;
  category: string;
  tags?: string[];
  author?: string;
  file: File;
}

export interface Document {
  _id: string;
  title: string;
  slug: string;
  departmentId: string;
  departmentName: string;
  circleId: string;
  circleName: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  summary?: string;
  tags: string[];
  author: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

const documentService = {
  async uploadDocument(data: UploadDocumentData) {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('circleId', data.circleId);
    formData.append('departmentId', data.departmentId);
    formData.append('category', data.category);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.author) {
      formData.append('author', data.author);
    }
    
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
      withCredentials: true
    });

    return response.data;
  },

  async getDocumentsByDepartment(departmentId: string) {
    const response = await axios.get(`${API_BASE_URL}/documents/department/${departmentId}`);
    return response.data;
  },

  // Suggest a document for admin review
  async suggestDocument(data: UploadDocumentData) {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('circleId', data.circleId);
    formData.append('departmentId', data.departmentId);
    formData.append('category', data.category);
    if (data.description) formData.append('description', data.description);
    if (data.author) formData.append('author', data.author);
    if (data.tags && data.tags.length > 0) formData.append('tags', JSON.stringify(data.tags));

    const response = await axios.post(`${API_BASE_URL}/documents/suggest`, formData, {
      withCredentials: true
    });
    return response.data;
  },

  async getDocumentById(documentId: string) {
    const response = await axios.get(`${API_BASE_URL}/documents/${documentId}`);
    return response.data;
  },

  // Increment view count by fetching the document (backend increments on GET)
  async incrementViewCount(documentId: string) {
    const response = await axios.get(`${API_BASE_URL}/documents/${documentId}`);
    return response.data;
  },

  async getAllDocuments(filters?: {
    circleId?: string;
    departmentId?: string;
    category?: string;
    search?: string;
  }) {
    const response = await axios.get(`${API_BASE_URL}/documents`, { params: filters });
    return response.data;
  },

  async incrementDownloadCount(documentId: string) {
    const response = await axios.post(`${API_BASE_URL}/documents/${documentId}/download`, {}, { withCredentials: true });
    return response.data;
  }
,

  // Admin: get suggested documents
  async getSuggestions() {
    const response = await axios.get(`${API_BASE_URL}/documents/suggestions`, { withCredentials: true });
    return response.data;
  },

  // Admin: approve a suggestion
  async approveSuggestion(suggestionId: string) {
    const response = await axios.put(`${API_BASE_URL}/documents/suggestions/${suggestionId}/approve`, {}, { withCredentials: true });
    return response.data;
  },

  // Admin: reject a suggestion with optional admin notes
  async rejectSuggestion(suggestionId: string, adminNotes?: string) {
    const response = await axios.put(`${API_BASE_URL}/documents/suggestions/${suggestionId}/reject`, { adminNotes }, { withCredentials: true });
    return response.data;
  }
};

export default documentService;