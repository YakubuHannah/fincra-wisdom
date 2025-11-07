import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const categoryService = {
  async getAllCategories() {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  },

  async createCategory(data: {
    name: string;
    description?: string;
    icon?: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/categories`, data);
    return response.data;
  },

  async deleteCategory(categoryId: string) {
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
    return response.data;
  }
};

export default categoryService;