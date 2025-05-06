import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Listen for theme changes (for future use)
  useEffect(() => {
    const handleThemeChange = () => {
      // Theme change handler for future theme-dependent functionality
    };
    
    window.addEventListener('themechange', handleThemeChange);
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);
  
  return (
    <footer 
      className="py-4 border-t transition-colors duration-normal"
      style={{
        backgroundColor: 'var(--color-header-bg)',
        borderColor: 'var(--color-header-border)',
        color: 'var(--color-text-secondary)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              © {currentYear} Pidima - Personal Digital Management Assistant. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              to="/terms" 
              className="transition-colors duration-150 hover:underline"
              style={{ color: 'var(--color-link)' }}
            >
              Terms of Service
            </Link>
            <Link 
              to="/privacy" 
              className="transition-colors duration-150 hover:underline"
              style={{ color: 'var(--color-link)' }}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/contact" 
              className="transition-colors duration-150 hover:underline"
              style={{ color: 'var(--color-link)' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 