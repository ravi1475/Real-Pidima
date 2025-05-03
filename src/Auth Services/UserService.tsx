import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../config/environment';

// Auth token management
export const tokenService = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token: string) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  getAuthHeader: () => {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

// HTTP service with authentication
export const httpService = {
  fetch: async (url: string, options: RequestInit = {}) => {
    const authHeaders = tokenService.getAuthHeader();
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
      ...(authHeaders as Record<string, string>)
    };

    const config: RequestInit = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        tokenService.removeToken();
        localStorage.removeItem('userRole');
        // Redirect to login page if necessary
        window.location.href = '/auth/signin';
        throw new Error('Authentication expired. Please login again.');
      }
      
      // Try to parse as JSON first
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, get text content
        data = { message: await response.text() };
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }
      
      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  get: (url: string, options: RequestInit = {}) => {
    return httpService.fetch(url, {
      ...options,
      method: 'GET'
    });
  },
  
  post: (url: string, data: any, options: RequestInit = {}) => {
    return httpService.fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: (url: string, data: any, options: RequestInit = {}) => {
    return httpService.fetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: (url: string, options: RequestInit = {}) => {
    return httpService.fetch(url, {
      ...options,
      method: 'DELETE'
    });
  }
};

// User API service
export const userAPI = {
  login: async (email: string, password: string) => {
    try {
      const data = await httpService.post(API.LOGIN, {
        email,
        password
      });
      
      // Store the token
      if (data.token) {
        tokenService.setToken(data.token);
      }
      
      return {
        success: true,
        token: data.token,
        user: data.user
      };
    } catch (error: any) {
      console.error('Login API error:', error);
      throw new Error(error.message || 'Invalid credentials');
    }
  },
  
  getUserProfile: async () => {
    try {
      return await httpService.get(API.USER_PROFILE);
    } catch (error: any) {
      console.error('Failed to get user profile:', error);
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  },
  
  updateUserProfile: async (userData: any) => {
    // In a real application, you would use httpService.put
    // Example: return httpService.put(`${SERVER_URL}/users/profile`, userData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      user: {
        ...userData,
        updatedAt: new Date().toISOString()
      }
    };
  },
  
  logout: () => {
    tokenService.removeToken();
    localStorage.removeItem('userRole');
  }
};

// User authentication hook
export const useUserAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenService.getToken();
      const role = localStorage.getItem('userRole');
      
      if (token && role === 'user') {
        try {
          const userProfile = await userAPI.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          logout();
        }
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await userAPI.login(email, password);
      // Token is already stored in the login function
      localStorage.setItem('userRole', 'user');
      setUser(result.user);
      toast.success('Successfully logged in');
      navigate('/');
      return true;
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    userAPI.logout();
    setUser(null);
    toast.info('You have been logged out');
    navigate('/auth/signin');
  };
  
  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
};

// User profile component (placeholder - can be expanded)
const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await userAPI.getUserProfile();
        setProfile(userData);
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (isLoading) {
    return <div>Loading profile...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
      {profile && (
        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300">Name: {profile.name}</p>
          <p className="text-gray-700 dark:text-gray-300">Email: {profile.email}</p>
          <p className="text-gray-700 dark:text-gray-300">Role: {profile.role}</p>
          <p className="text-gray-700 dark:text-gray-300">Member since: {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 