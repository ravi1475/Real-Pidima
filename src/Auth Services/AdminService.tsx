import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tokenService } from './UserService';

// Admin API service
export const adminAPI = {
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes - in real app this would validate against an actual backend
    if (email === 'admin@example.com' && password === 'adminpassword') {
      const token = 'admin-token-' + Date.now();
      // Store the token using tokenService
      tokenService.setToken(token);
      
      return {
        success: true,
        token: token,
        user: {
          id: 'admin1',
          name: 'Admin User',
          email: email,
          role: 'admin',
          permissions: ['manage_users', 'manage_content', 'view_reports']
        }
      };
    }
    throw new Error('Invalid admin credentials');
  },
  
  getAdminProfile: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const admin = {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      permissions: ['manage_users', 'manage_content', 'view_reports'],
      createdAt: '2023-01-01'
    };
    
    return admin;
  },
  
  getUsers: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      { id: '1', name: 'User One', email: 'user1@example.com', role: 'user', status: 'active' },
      { id: '2', name: 'User Two', email: 'user2@example.com', role: 'user', status: 'inactive' },
      { id: '3', name: 'User Three', email: 'user3@example.com', role: 'user', status: 'active' },
    ];
  },
  
  getSystemStats: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalUsers: 150,
      activeUsers: 87,
      totalRequirements: 324,
      totalTestCases: 512,
      systemUptime: '99.8%'
    };
  },
  
  logout: () => {
    tokenService.removeToken();
    localStorage.removeItem('userRole');
  }
};

// Admin authentication hook
export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenService.getToken();
      const role = localStorage.getItem('userRole');
      
      if (token && role === 'admin') {
        try {
          const adminProfile = await adminAPI.getAdminProfile();
          setAdmin(adminProfile);
        } catch (error) {
          console.error('Failed to get admin profile:', error);
          logout();
        }
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await adminAPI.login(email, password);
      // Token is already stored in the login function
      localStorage.setItem('userRole', 'admin');
      setAdmin(result.user);
      toast.success('Successfully logged in as Admin');
      navigate('/admin/dashboard');
      return true;
    } catch (error) {
      toast.error('Invalid admin credentials. Please try again.');
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    adminAPI.logout();
    setAdmin(null);
    toast.info('Admin logged out');
    navigate('/auth/signin');
  };
  
  return {
    admin,
    isLoading,
    login,
    logout,
    isAuthenticated: !!admin
  };
};

// Admin Dashboard Component (placeholder - can be expanded)
const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          adminAPI.getSystemStats(),
          adminAPI.getUsers()
        ]);
        
        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        toast.error('Failed to load admin data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);
  
  if (isLoading) {
    return <div>Loading admin dashboard...</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      
      {stats && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">User Statistics</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">Total Users: {stats.totalUsers}</p>
            <p className="text-gray-700 dark:text-gray-300">Active Users: {stats.activeUsers}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Content Statistics</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">Requirements: {stats.totalRequirements}</p>
            <p className="text-gray-700 dark:text-gray-300">Test Cases: {stats.totalTestCases}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">System Status</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">Uptime: {stats.systemUptime}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Users</h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map(user => (
            <li key={user.id} className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="ml-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard; 