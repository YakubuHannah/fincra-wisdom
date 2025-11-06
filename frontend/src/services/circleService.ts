import axios from 'axios';
import { Circle, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const circleService = {
  // Get all circles
  getAllCircles: async (): Promise<Circle[]> => {
    const response = await api.get<ApiResponse<Circle[]>>('/circles');
    return response.data.data || [];
  },

  // Get circle by ID
  getCircleById: async (id: string): Promise<Circle> => {
    const response = await api.get<ApiResponse<Circle>>(`/circles/${id}`);
    if (!response.data.data) {
      throw new Error('Circle not found');
    }
    return response.data.data;
  },

  // Get circle by slug
  getCircleBySlug: async (slug: string): Promise<Circle> => {
    const response = await api.get<ApiResponse<Circle>>(`/circles/slug/${slug}`);
    if (!response.data.data) {
      throw new Error('Circle not found');
    }
    return response.data.data;
  },

  // Create circle (admin)
  createCircle: async (circleData: Partial<Circle>): Promise<Circle> => {
    const response = await api.post<ApiResponse<Circle>>('/circles', circleData);
    if (!response.data.data) {
      throw new Error('Failed to create circle');
    }
    return response.data.data;
  },

  // Update circle (admin)
  updateCircle: async (id: string, circleData: Partial<Circle>): Promise<Circle> => {
    const response = await api.put<ApiResponse<Circle>>(`/circles/${id}`, circleData);
    if (!response.data.data) {
      throw new Error('Failed to update circle');
    }
    return response.data.data;
  },

  // Delete circle (admin)
  deleteCircle: async (id: string): Promise<void> => {
    await api.delete(`/circles/${id}`);
  },
};

export default circleService;
