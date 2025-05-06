import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/ApiService';
import { isDarkModeEnabled } from '../utils/themeUtils';
import './styles.css'; // Import the styles

const OrganizationCreation: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeEnabled());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    adminEmail: ''
  });

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setIsDarkMode(e.detail.isDarkMode);
    };
    
    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.organizations.create({
        name: formData.name,
        description: formData.description,
        adminEmail: formData.adminEmail
      });
      
      setResult(data);
      toast.success('Organization created successfully');
    } catch (err: any) {
      console.error('Organization creation error:', err);
      setError(err.message || 'Unknown error');
      toast.error(`Organization creation error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
        <div className={`px-8 py-6 ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-600'}`}>
          <h1 className="text-2xl font-bold text-white">Create Organization</h1>
          <p className="mt-2 text-purple-100">Set up a new organization in the system</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-l-4 border-red-500 animate-fadeIn">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {result ? (
            <div className="animate-fadeIn">
              <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-l-4 border-green-500">
                <p className="font-medium">Success!</p>
                <p>Organization "{result.name}" has been created successfully</p>
              </div>
              
              <div className={`mb-6 rounded-lg p-4 overflow-hidden font-mono text-sm ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className={`flex-1 py-3 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                  onClick={() => {
                    setResult(null);
                    setFormData({ name: '', description: '', adminEmail: '' });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Create Another
                </button>
                <button
                  className={`flex-1 py-3 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                  onClick={() => navigate('/')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={createOrganization} className="space-y-6 animate-fadeIn">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Organization Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v-4H5v4h10z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-3 py-3 rounded-lg focus:ring-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                    }`}
                    placeholder="Acme Corporation"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Description
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-0 flex items-center pl-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg focus:ring-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                    }`}
                    placeholder="Describe the purpose and mission of this organization"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="adminEmail" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Admin Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-3 py-3 rounded-lg focus:ring-2 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                    }`}
                    placeholder="admin@example.com"
                    disabled={isLoading}
                  />
                </div>
                <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  This email will be assigned administrative privileges
                </p>
              </div>
              
              <button
                type="submit"
                className={`w-full py-3 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all duration-300 ${
                  isLoading
                    ? `${isDarkMode ? 'bg-purple-800' : 'bg-purple-400'} cursor-not-allowed`
                    : `${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} cursor-pointer`
                } text-white`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Organization...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span>Create Organization</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default OrganizationCreation; 