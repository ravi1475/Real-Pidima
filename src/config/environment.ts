/**
 * Centralized environment configuration
 */

// Get the server URL from environment variables or use the default
export const SERVER_URL = import.meta.env?.SERVER_URL || 'http://localhost:20259/api/v1.0';

// API endpoints
export const API = {
  REQUIREMENTS: `${SERVER_URL}/requirements`,
  REGISTER: `${SERVER_URL}/auth/register`,
  LOGIN: `${SERVER_URL}/auth/login`,
  ORGANIZATIONS: `${SERVER_URL}/organizations`,
  USER_PROFILE: `${SERVER_URL}/auth/me`,
}; 