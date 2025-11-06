// Circle types
export interface Circle {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  order: number;
  departments: Department[] | string[];
  departmentCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Department types
export interface Department {
  _id: string;
  name: string;
  slug: string;
  circleId: string | Circle;
  circleName: string;
  teamLead: string;
  teamLeadEmail?: string;
  description: string;
  icon: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

// Document types
export interface Document {
  _id: string;
  title: string;
  slug: string;
  departmentId: string | Department;
  departmentName: string;
  circleId: string | Circle;
  circleName: string;
  fileUrl: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'doc' | 'pptx' | 'ppt' | 'xlsx' | 'xls' | 'txt' | 'md';
  fileSize: number;
  content: string;
  summary?: string;
  author: string;
  version: string;
  tags: string[];
  category: 'SOP' | 'Report' | 'Template' | 'Guide' | 'Policy' | 'Manual' | 'Other';
  searchableText: string;
  viewCount: number;
  downloadCount: number;
  lastViewedAt?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Search types
export interface SearchFilters {
  circleId?: string;
  departmentId?: string;
  fileType?: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResult {
  document: Document;
  score: number;
  highlights: string[];
}

// AI types
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: DocumentReference[];
}

export interface DocumentReference {
  id: string;
  title: string;
  url: string;
}

export interface AIQueryResponse {
  answer: string;
  sources: DocumentReference[];
  relatedQuestions?: string[];
}
