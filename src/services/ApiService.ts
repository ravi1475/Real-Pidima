import { API } from '../config/environment';
import { httpService } from '../Auth Services/UserService';

/**
 * Centralized API service for making authenticated requests to the backend
 * All API calls should go through this service to ensure proper auth token handling
 */
export const apiService = {
  /**
   * Organizations API
   */
  organizations: {
    getAll: () => httpService.get(API.ORGANIZATIONS),
    getById: (id: string) => httpService.get(`${API.ORGANIZATIONS}/${id}`),
    create: (data: any) => httpService.post(API.ORGANIZATIONS, data),
    update: (id: string, data: any) => httpService.put(`${API.ORGANIZATIONS}/${id}`, data),
    delete: (id: string) => httpService.delete(`${API.ORGANIZATIONS}/${id}`),
    // Add more organization-specific endpoints as needed
  },

  /**
   * Authentication API
   */
  auth: {
    login: (email: string, password: string) => 
      httpService.post(API.LOGIN, { email, password }),
    register: (userData: any) => 
      httpService.post(API.REGISTER, userData),
    // Add more auth endpoints as needed
  },

  /**
   * Requirements API
   */
  requirements: {
    getAll: () => httpService.get(API.REQUIREMENTS),
    getById: (id: string) => httpService.get(`${API.REQUIREMENTS}/${id}`),
    create: (data: any) => httpService.post(API.REQUIREMENTS, data),
    update: (id: string, data: any) => httpService.put(`${API.REQUIREMENTS}/${id}`, data),
    delete: (id: string) => httpService.delete(`${API.REQUIREMENTS}/${id}`),
    // Add more requirements-specific endpoints as needed
  },

  /**
   * Users API
   */
  users: {
    // Example placeholder functions - implement based on actual API
    getProfile: () => httpService.get(`${API.ORGANIZATIONS}/users/profile`),
    updateProfile: (data: any) => httpService.put(`${API.ORGANIZATIONS}/users/profile`, data),
    // Add more user-specific endpoints as needed
  },

  /**
   * Test cases API
   */
  testCases: {
    getAll: (projectId: string) => 
      httpService.get(`${API.ORGANIZATIONS}/test-cases/project/${projectId}`),
    getById: (id: string) => 
      httpService.get(`${API.ORGANIZATIONS}/test-cases/${id}`),
    create: (data: any) => 
      httpService.post(`${API.ORGANIZATIONS}/test-cases`, data),
    update: (id: string, data: any) => 
      httpService.put(`${API.ORGANIZATIONS}/test-cases/${id}`, data),
    delete: (id: string) => 
      httpService.delete(`${API.ORGANIZATIONS}/test-cases/${id}`),
    // Add more test case-specific endpoints as needed
  }
}; 