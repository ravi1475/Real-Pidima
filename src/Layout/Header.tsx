import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaSearch, FaUser, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { isDarkModeEnabled, toggleDarkMode } from '../utils/themeUtils';

const Header: React.FC = () => {
  // Initialize dark mode from our utility
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeEnabled());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Listen for theme changes from other components
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setIsDarkMode(e.detail.isDarkMode);
    };
    
    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleToggleDarkMode = () => {
    const newMode = toggleDarkMode();
    setIsDarkMode(newMode);
  };
  
  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/auth/signin');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 shadow-md z-50 transition-colors duration-normal ${
      isDarkMode 
        ? 'bg-gray-800 text-gray-100 border-b border-gray-700' 
        : 'bg-white text-gray-900 border-b border-gray-200'
    }`}>
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-xl ${
              isDarkMode ? 'bg-primary-dark' : 'bg-primary'
            }`}>P</div>
            <span className={`text-2xl font-bold ${
              isDarkMode ? 'text-primary-dark' : 'text-primary'
            }`}>Pidima</span>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex relative mx-4 flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className={`block w-full pl-10 pr-3 py-2 rounded-md transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-primary-dark' 
                : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary'
            }`}
          />
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className={`p-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-fast relative ${
              isDarkMode
                ? 'text-gray-300 hover:bg-gray-700 hover:text-primary-dark focus:ring-primary-dark'
                : 'text-gray-700 hover:bg-gray-100 hover:text-primary focus:ring-primary'
            }`}
            aria-label="Notifications"
          >
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-error"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleDarkMode}
            className={`p-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-fast ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-primary-dark focus:ring-primary-dark' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-primary focus:ring-primary'
            }`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <FaSun className="w-5 h-5 text-warning-dark" />
            ) : (
              <FaMoon className="w-5 h-5 text-primary" />
            )}
          </button>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className={`flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary p-1.5 transition-all duration-fast ${
                isDarkMode
                  ? 'hover:bg-gray-700 focus:ring-primary-dark'
                  : 'hover:bg-gray-100 focus:ring-primary'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                isDarkMode ? 'bg-primary-dark' : 'bg-primary'
              }`}>
                <FaUser className="w-4 h-4" />
              </div>
            </button>
            
            {showUserMenu && (
              <div className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg overflow-hidden z-50 border transition-all duration-fast ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 shadow-gray-900' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>John Doe</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>john.doe@example.com</p>
                </div>
                
                <div className="py-1">
                  <Link to="/account" className={`flex items-center px-4 py-2 text-sm ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    <FaCog className="mr-3 w-4 h-4" />
                    Account Settings
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className={`w-full text-left flex items-center px-4 py-2 text-sm ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaSignOutAlt className="mr-3 w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Standalone Sign Out Button */}
          <button
            onClick={handleSignOut}
            className={`hidden md:flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-fast ${
              isDarkMode
                ? 'bg-primary-dark hover:bg-primary text-white focus:ring-primary-dark focus:ring-offset-gray-800'
                : 'bg-primary hover:bg-primary-hover text-white focus:ring-primary focus:ring-offset-white'
            }`}
          >
            <FaSignOutAlt className="mr-2 w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 