import { API } from '../../../config/environment';
import { httpService } from '../../../Auth Services/UserService';
import { TraceabilityMapping } from '../../../types/traceability';

/**
 * Service for handling traceability matrix API calls
 */
export const traceabilityService = {
  /**
   * Get all traceability mappings
   */
  getAllMappings: async () => {
    try {
      return await httpService.get(API.TRACEABILITY);
    } catch (error) {
      console.error('Failed to fetch traceability mappings:', error);
      throw error;
    }
  },

  /**
   * Get traceability mappings by requirement ID
   */
  getMappingsByRequirementId: async (requirementId: string) => {
    try {
      return await httpService.get(`${API.TRACEABILITY}/requirements/${requirementId}`);
    } catch (error) {
      console.error(`Failed to fetch traceability mappings for requirement ${requirementId}:`, error);
      throw error;
    }
  },

  /**
   * Get traceability mappings by test case ID
   */
  getMappingsByTestCaseId: async (testcaseId: string) => {
    try {
      return await httpService.get(`${API.TRACEABILITY}/testcases/${testcaseId}`);
    } catch (error) {
      console.error(`Failed to fetch traceability mappings for test case ${testcaseId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new traceability mapping
   */
  createMapping: async (mapping: TraceabilityMapping) => {
    try {
      return await httpService.post(API.TRACEABILITY, mapping);
    } catch (error) {
      console.error('Failed to create traceability mapping:', error);
      throw error;
    }
  },

  /**
   * Update an existing traceability mapping
   */
  updateMapping: async (id: string, mapping: Partial<TraceabilityMapping>) => {
    try {
      return await httpService.put(`${API.TRACEABILITY}/${id}`, mapping);
    } catch (error) {
      console.error(`Failed to update traceability mapping ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a traceability mapping
   */
  deleteMapping: async (id: string) => {
    try {
      return await httpService.delete(`${API.TRACEABILITY}/${id}`);
    } catch (error) {
      console.error(`Failed to delete traceability mapping ${id}:`, error);
      throw error;
    }
  }
};