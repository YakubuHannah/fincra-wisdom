import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface AIResponse {
  success: boolean;
  answer: string;
  relevantDocuments: Array<{
    _id: string;
    title: string;
    departmentName: string;
    category: string;
    slug: string;
  }>;
}

const aiService = {
  async askQuestion(question: string): Promise<AIResponse> {
    const response = await axios.post(`${API_URL}/ai/ask`, { question });
    return response.data;
  }
};

export default aiService;