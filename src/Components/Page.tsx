'use client';

import { useState, useEffect } from 'react';
import Gauge from './Gauge';
import { isDarkModeEnabled } from '../utils/themeUtils';

const Page = () => {
  // State for dark mode
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

  // Mock data state
  const [stats] = useState({
    requirementsCount: 24,
    testCasesCount: 48,
    coveragePercentage: "75.00"
  });
  const [currentProject] = useState("Demo Project");

  return (
    <div 
      className="min-h-screen pt-24 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-5 md:px-6 lg:px-8 transition-colors duration-300"
      style={{ 
        background: 'var(--color-background)',
        color: 'var(--color-foreground)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          <h1 
            className="text-3xl sm:text-3xl md:text-4xl font-extrabold"
            style={{ 
              background: isDarkMode ? 'linear-gradient(to right, #60A5FA, #818CF8)' : 'linear-gradient(to right, #2563EB, #4F46E5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Dashboard
          </h1>
          <div 
            className="rounded-lg px-3 sm:px-3 md:px-4 py-1.5 sm:py-2 shadow-md transition-colors duration-300"
            style={{ 
              backgroundColor: 'var(--color-surface-1)',
              borderColor: 'var(--color-card-border)',
              border: '1px solid var(--color-card-border)'
            }}
          >
            <span 
              className="text-sm md:text-base font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {currentProject}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Requirements Card */}
          <div 
            className="p-6 sm:p-7 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 ease-in-out hover:-translate-y-2"
            style={{ 
              backgroundColor: 'var(--color-surface-1)',
              borderTop: '4px solid var(--color-primary-button)'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="rounded-full p-3 sm:p-3.5 md:p-4 mb-4 sm:mb-5 md:mb-6"
                style={{ backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 246, 255, 1)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  style={{ color: 'var(--color-primary-button)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 
                className="text-xl sm:text-xl md:text-2xl font-semibold mb-2"
                style={{ 
                  background: 'linear-gradient(to right, #3B82F6, #06B6D4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Requirements
              </h2>
              <p 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2"
                style={{ color: isDarkMode ? '#60A5FA' : '#2563EB' }}
              >
                {stats.requirementsCount}
              </p>
              <p style={{ color: 'var(--color-text-tertiary)' }} className="text-xs sm:text-sm">
                Total requirements in project
              </p>
            </div>
          </div>
          
          {/* Test Cases Card */}
          <div 
            className="p-6 sm:p-7 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 ease-in-out hover:-translate-y-2"
            style={{ 
              backgroundColor: 'var(--color-surface-1)',
              borderTop: '4px solid var(--color-primary-button-hover)'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="rounded-full p-3 sm:p-3.5 md:p-4 mb-4 sm:mb-5 md:mb-6"
                style={{ backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(238, 242, 255, 1)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  style={{ color: 'var(--color-primary-button-hover)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 
                className="text-xl sm:text-xl md:text-2xl font-semibold mb-2"
                style={{ 
                  background: 'linear-gradient(to right, #6366F1, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Test Cases
              </h2>
              <p 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2"
                style={{ color: isDarkMode ? '#818CF8' : '#4F46E5' }}
              >
                {stats.testCasesCount}
              </p>
              <p style={{ color: 'var(--color-text-tertiary)' }} className="text-xs sm:text-sm">
                Total test cases created
              </p>
            </div>
          </div>
          
          {/* Coverage Card */}
          <div 
            className="p-6 sm:p-7 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 ease-in-out hover:-translate-y-2 relative overflow-hidden"
            style={{ 
              backgroundColor: 'var(--color-surface-1)',
              borderTop: '4px solid var(--color-accent)'
            }}
          >
            <div className="flex flex-col items-center text-center relative z-10">
              <div 
                className="rounded-full p-3 sm:p-3.5 md:p-4 mb-4 sm:mb-5 md:mb-6 shadow-sm"
                style={{ backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(245, 243, 255, 1)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  style={{ color: 'var(--color-accent)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 
                className="text-xl sm:text-xl md:text-2xl font-semibold mb-4"
                style={{ 
                  background: 'linear-gradient(to right, #8B5CF6, #6366F1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Test Coverage
              </h2>
              <div className="mb-6 relative transform transition-all duration-300 hover:scale-105">
                <Gauge coveragePercentage={stats.coveragePercentage} />
              </div>
              <div 
                className="px-4 py-2 rounded-full inline-block shadow-sm"
                style={{ 
                  background: isDarkMode ? 'linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))' : 
                                          'linear-gradient(to right, rgba(243, 232, 255, 1), rgba(238, 242, 255, 1))'
                }}
              >
                <p 
                  className="text-xs sm:text-sm font-medium"
                  style={{ 
                    background: isDarkMode ? 'linear-gradient(to right, #A78BFA, #818CF8)' : 'linear-gradient(to right, #7C3AED, #4F46E5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Requirements with test cases
                </p>
              </div>
            </div>
            <div 
              className="absolute top-0 right-0 w-20 h-20 rounded-bl-3xl opacity-50"
              style={{ 
                background: isDarkMode ? 'linear-gradient(to bottom right, rgba(139, 92, 246, 0.1), transparent)' : 
                                        'linear-gradient(to bottom right, rgba(243, 232, 255, 1), transparent)'
              }}
            ></div>
            <div 
              className="absolute bottom-0 left-0 w-16 h-16 rounded-tr-3xl opacity-40"
              style={{ 
                background: isDarkMode ? 'linear-gradient(to top right, rgba(139, 92, 246, 0.1), transparent)' : 
                                        'linear-gradient(to top right, rgba(243, 232, 255, 1), transparent)'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;