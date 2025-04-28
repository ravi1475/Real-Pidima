import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isDarkModeEnabled } from '../utils/themeUtils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeEnabled());
  
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
  
  return (
    <footer className={`py-4 border-t transition-colors duration-normal ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              &copy; {currentYear} Pidima. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              to="/terms" 
              className={`text-sm transition-colors duration-fast ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-accent-dark' 
                  : 'text-gray-500 hover:text-accent'
              }`}
            >
              Terms of Service
            </Link>
            <Link 
              to="/licenses" 
              className={`text-sm transition-colors duration-fast ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-accent-dark' 
                  : 'text-gray-500 hover:text-accent'
              }`}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/help" 
              className={`text-sm transition-colors duration-fast ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-accent-dark' 
                  : 'text-gray-500 hover:text-accent'
              }`}
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 