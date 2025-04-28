import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaClipboardList, 
  FaVial, 
  FaProjectDiagram, 
  FaFileImport, 
  FaUserCog,
  FaChevronLeft,
  FaBars,
  FaQuestionCircle,
  FaHeadset
} from 'react-icons/fa';
import { isDarkModeEnabled } from '../utils/themeUtils';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
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
  
  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/sys-requirements', icon: <FaClipboardList />, label: 'Requirements' },
    { path: '/sys-tests', icon: <FaVial />, label: 'Test Specifications' },
    { path: '/traceability-matrix', icon: <FaProjectDiagram />, label: 'Traceability Matrix' },
    { path: '/import-export', icon: <FaFileImport />, label: 'Import/Export' },
    { path: '/account', icon: <FaUserCog />, label: 'Account' },
  ];

  return (
    <div 
      className={`fixed top-16 bottom-0 left-0 shadow-lg z-40 transition-all duration-300 border-r ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 text-gray-200' 
          : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute top-4 right-2 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-fast ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-primary-dark'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-primary'
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FaBars size={14} /> : <FaChevronLeft size={14} />}
        </button>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-2 py-6 mt-8 overflow-y-auto">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isHovered = hoveredItem === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-fast ${
                      isActive
                        ? isDarkMode
                          ? 'bg-primary-dark/20 text-primary-dark'
                          : 'bg-primary/10 text-primary'
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    } ${isHovered && !isActive ? isDarkMode ? 'bg-gray-700/70' : 'bg-gray-50' : ''}`}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className={`text-lg ${
                      isActive 
                        ? isDarkMode 
                          ? 'text-primary-dark' 
                          : 'text-primary'
                        : ''
                    }`}>
                      {item.icon}
                    </span>
                    
                    {!isCollapsed && (
                      <span className={`ml-3 ${isActive ? 'font-semibold' : ''}`}>
                        {item.label}
                      </span>
                    )}
                    
                    {isCollapsed && isHovered && (
                      <div className={`absolute left-14 px-3 py-2 rounded-md shadow-lg border z-50 ${
                        isDarkMode
                          ? 'bg-gray-800 text-gray-300 border-gray-700'
                          : 'bg-white text-gray-700 border-gray-200'
                      }`}>
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer Links */}
        {!isCollapsed ? (
          <div className={`px-4 py-4 mt-auto border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="space-y-3">
              <Link 
                to="/help" 
                className={`flex items-center px-4 py-2 text-sm rounded-md transition-all duration-fast ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-accent-dark hover:bg-gray-700'
                    : 'text-gray-600 hover:text-accent hover:bg-gray-50'
                }`}
              >
                <FaQuestionCircle className={`mr-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                Help & Documentation
              </Link>
              <Link 
                to="/contact" 
                className={`flex items-center px-4 py-2 text-sm rounded-md transition-all duration-fast ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-accent-dark hover:bg-gray-700'
                    : 'text-gray-600 hover:text-accent hover:bg-gray-50'
                }`}
              >
                <FaHeadset className={`mr-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                Contact Support
              </Link>
            </div>
            
            <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-accent-dark/20 text-accent-dark' 
                      : 'bg-accent/10 text-accent'
                  }`}>
                    <span className="text-xs font-medium">PRO</span>
                  </div>
                  <div className="ml-3">
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pidima Pro</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-2 py-4 mt-auto">
            <div className="flex flex-col items-center space-y-4">
              <Link to="/help" className={`p-2 rounded-md transition-all duration-fast ${
                isDarkMode
                  ? 'text-gray-400 hover:text-accent-dark hover:bg-gray-700'
                  : 'text-gray-500 hover:text-accent hover:bg-gray-100'
              }`}>
                <FaQuestionCircle />
              </Link>
              <Link to="/contact" className={`p-2 rounded-md transition-all duration-fast ${
                isDarkMode
                  ? 'text-gray-400 hover:text-accent-dark hover:bg-gray-700'
                  : 'text-gray-500 hover:text-accent hover:bg-gray-100'
              }`}>
                <FaHeadset />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 