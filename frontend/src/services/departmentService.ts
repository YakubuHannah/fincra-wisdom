import axios from 'axios';
import { Department, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const departmentService = {
  // Get all departments
  getAllDepartments: async (): Promise<Department[]> => {
    const response = await api.get<ApiResponse<Department[]>>('/departments');
    return response.data.data || [];
  },

  // Get department by ID
  getDepartmentById: async (id: string): Promise<Department> => {
    const response = await api.get<ApiResponse<Department>>(`/departments/${id}`);
    if (!response.data.data) {
      throw new Error('Department not found');
    }
    return response.data.data;
  },

  // Get departments by circle
  getDepartmentsByCircle: async (circleId: string): Promise<Department[]> => {
    const response = await api.get<ApiResponse<Department[]>>(`/departments/circle/${circleId}`);
    return response.data.data || [];
  },

  // Get department by slug
  getDepartmentBySlug: async (slug: string): Promise<Department> => {
    const response = await api.get<ApiResponse<Department>>(`/departments/slug/${slug}`);
    if (!response.data.data) {
      throw new Error('Department not found');
    }
    return response.data.data;
  },

  // Create department (admin)
  createDepartment: async (departmentData: Partial<Department>): Promise<Department> => {
    const response = await api.post<ApiResponse<Department>>('/departments', departmentData);
    if (!response.data.data) {
      throw new Error('Failed to create department');
    }
    return response.data.data;
  },

  // Update department (admin)
  updateDepartment: async (id: string, departmentData: Partial<Department>): Promise<Department> => {
    const response = await api.put<ApiResponse<Department>>(`/departments/${id}`, departmentData);
    if (!response.data.data) {
      throw new Error('Failed to update department');
    }
    return response.data.data;
  },

  // Delete department (admin)
  deleteDepartment: async (id: string): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
};

export default departmentService;
