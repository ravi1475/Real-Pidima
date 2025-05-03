import { API } from '../config/environment';
import { httpService } from '../Auth Services/UserService';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  members?: number;
  createdAt?: string;
  updatedAt?: string;
  adminEmail?: string;
}

/**
 * Organization service for managing organization-related API calls
 */
export const organizationService = {
  /**
   * Get all organizations the user has access to
   */
  getOrganizations: async (): Promise<Organization[]> => {
    try {
      return await httpService.get(API.ORGANIZATIONS);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      throw error;
    }
  },

  /**
   * Get a specific organization by ID
   */
  getOrganization: async (id: string): Promise<Organization> => {
    try {
      return await httpService.get(`${API.ORGANIZATIONS}/${id}`);
    } catch (error) {
      console.error(`Failed to fetch organization with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new organization
   */
  createOrganization: async (organization: Omit<Organization, 'id'>): Promise<Organization> => {
    try {
      return await httpService.post(API.ORGANIZATIONS, organization);
    } catch (error) {
      console.error('Failed to create organization:', error);
      throw error;
    }
  },

  /**
   * Update an existing organization
   */
  updateOrganization: async (id: string, organization: Partial<Organization>): Promise<Organization> => {
    try {
      return await httpService.put(`${API.ORGANIZATIONS}/${id}`, organization);
    } catch (error) {
      console.error(`Failed to update organization with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an organization
   */
  deleteOrganization: async (id: string): Promise<void> => {
    try {
      await httpService.delete(`${API.ORGANIZATIONS}/${id}`);
    } catch (error) {
      console.error(`Failed to delete organization with ID ${id}:`, error);
      throw error;
    }
  }
}; 