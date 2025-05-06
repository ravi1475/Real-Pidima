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
    <header className="fixed top-0 left-0 right-0 h-16 shadow-md z-50 transition-colors duration-normal"
      style={{
        backgroundColor: 'var(--color-header-bg)',
        color: 'var(--color-foreground)',
        borderBottom: `1px solid var(--color-header-border)`
      }}>
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: isDarkMode ? 'var(--color-primary-button-hover)' : 'var(--color-primary-button)' }}>
              P
            </div>
            <span className="text-2xl font-bold"
              style={{ color: isDarkMode ? 'var(--color-primary-button-hover)' : 'var(--color-primary-button)' }}>
              Pidima
            </span>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex relative mx-4 flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4" style={{ color: isDarkMode ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)' }} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="input-field block w-full pl-10 pr-3 py-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--color-input-bg)',
              borderColor: 'var(--color-input-border)',
              color: 'var(--color-input-text)'
            }}
          />
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="p-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 relative"
            style={{
              color: isDarkMode ? 'var(--color-text-secondary)' : 'var(--color-text-secondary)',
              backgroundColor: 'transparent'
            }}
            aria-label="Notifications"
          >
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-error)' }}></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleDarkMode}
            className="p-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150"
            style={{
              color: isDarkMode ? 'var(--color-text-secondary)' : 'var(--color-text-secondary)',
              backgroundColor: 'transparent'
            }}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <FaSun className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
            ) : (
              <FaMoon className="w-5 h-5" style={{ color: 'var(--color-primary-button)' }} />
            )}
          </button>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary p-1.5 transition-all duration-150"
              style={{
                backgroundColor: showUserMenu 
                  ? (isDarkMode ? 'var(--color-sidebar-active)' : 'var(--color-sidebar-active)')
                  : 'transparent'
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: isDarkMode ? 'var(--color-primary-button-hover)' : 'var(--color-primary-button)' }}>
                <FaUser className="w-4 h-4" />
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg overflow-hidden z-50 border transition-all duration-150"
                style={{
                  backgroundColor: 'var(--color-surface-1)',
                  borderColor: 'var(--color-card-border)',
                  boxShadow: '0 10px 15px -3px var(--color-card-shadow), 0 4px 6px -2px var(--color-card-shadow)'
                }}>
                <div className="p-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>John Doe</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>john.doe@example.com</p>
                </div>
                
                <div className="py-1">
                  <Link to="/account" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <FaCog className="mr-3 w-4 h-4" />
                    Account Settings
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{ color: 'var(--color-text-secondary)' }}
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
            className="hidden md:flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 btn-primary"
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