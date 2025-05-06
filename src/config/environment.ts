/**
 * Centralized environment configuration
 */

// Get the server URL from environment variables or use the default
export const SERVER_URL = import.meta.env?.SERVER_URL || 'http://localhost:20259/api/v1.0';

// Hardcoded project ID for development
export const PROJECT_ID = "66dada6e-f9e8-471b-9e86-5a832309f788";

// API endpoints
export const API = {
  REQUIREMENTS: `${SERVER_URL}/requirements`,
  PROJECT_REQUIREMENTS: `${SERVER_URL}/requirements/projects/${PROJECT_ID}`,
  REGISTER: `${SERVER_URL}/auth/register`,
  LOGIN: `${SERVER_URL}/auth/login`,
  ORGANIZATIONS: `${SERVER_URL}/organizations`,
  USER_PROFILE: `${SERVER_URL}/auth/me`,
  TRACEABILITY: `${SERVER_URL}/traceability`,
};