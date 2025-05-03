import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaCalendarAlt, FaEdit, FaSync } from 'react-icons/fa';
import { httpService } from '../Auth Services/UserService';
import { API } from '../config/environment';
import { toast } from 'react-toastify';
import { isDarkModeEnabled } from '../utils/themeUtils';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

const AccountPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeEnabled());

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setIsDarkMode(e.detail.isDarkMode);
    };
    
    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await httpService.get(API.USER_PROFILE);
      setProfile({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      });
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError(err.message || 'Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={`rounded-lg shadow-lg overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b ${
          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-primary/10 to-accent/10 border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Account Profile
            </h1>
            <button 
              onClick={fetchUserProfile}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-100' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={isLoading}
            >
              <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className={`animate-pulse flex space-x-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-800'
              }`}>
                <div className="rounded-full bg-gray-400 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-400 rounded"></div>
                    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className={`p-4 rounded-md ${
              isDarkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
            }`}>
              <p>{error}</p>
              <button 
                onClick={fetchUserProfile}
                className={`mt-4 px-4 py-2 rounded-md text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-red-800 hover:bg-red-700 text-white' 
                    : 'bg-red-200 hover:bg-red-300 text-red-800'
                }`}
              >
                Try Again
              </button>
            </div>
          ) : profile ? (
            <div className="space-y-8">
              {/* Profile Avatar & Name */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className={`h-24 w-24 rounded-full flex items-center justify-center text-3xl ${
                  isDarkMode ? 'bg-primary-dark/20 text-primary-light' : 'bg-primary/10 text-primary'
                }`}>
                  <FaUser />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {profile.name}
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Account ID: {profile.id}
                  </p>
                </div>
              </div>

              {/* Profile Information */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg p-6 ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`flex items-start gap-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className={`mt-1 p-2 rounded-md ${
                    isDarkMode ? 'bg-gray-600 text-primary-light' : 'bg-primary/10 text-primary'
                  }`}>
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Email Address</p>
                    <p className="text-lg">{profile.email}</p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className={`mt-1 p-2 rounded-md ${
                    isDarkMode ? 'bg-gray-600 text-primary-light' : 'bg-primary/10 text-primary'
                  }`}>
                    <FaIdCard />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Account ID</p>
                    <p className="text-lg break-all">{profile.id}</p>
                  </div>
                </div>

                {profile.createdAt && (
                  <div className={`flex items-start gap-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className={`mt-1 p-2 rounded-md ${
                      isDarkMode ? 'bg-gray-600 text-primary-light' : 'bg-primary/10 text-primary'
                    }`}>
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Member Since</p>
                      <p className="text-lg">{new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Profile Button */}
              <div className="flex justify-center sm:justify-start">
                <button 
                  className={`flex items-center px-5 py-2.5 rounded-md font-medium transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-primary-dark hover:bg-primary-dark/90 text-white' 
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-md ${
              isDarkMode ? 'bg-yellow-700/20 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <p>No profile data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 