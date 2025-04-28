import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { isDarkModeEnabled } from '../utils/themeUtils';

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeEnabled());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken);
    
    // Redirect unauthenticated users to login if trying to access protected routes
    if (!authToken && !location.pathname.includes('/auth/')) {
      navigate('/auth/signin');
    }
  }, [location.pathname, navigate]);

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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Public routes that don't need the full layout
  const isPublicRoute = location.pathname.startsWith('/auth/');

  if (isPublicRoute) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
        <Outlet />
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <Header />
      <div className="flex flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} mt-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className={`max-w-7xl mx-auto rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow'}`}>
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout; 