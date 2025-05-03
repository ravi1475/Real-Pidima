'use client';

import { useState, useEffect } from 'react';
import Gauge from './Gauge';
import { isDarkModeEnabled } from '../utils/themeUtils';

const Dashboard = () => {
  // State for dark mode
  const [, setIsDarkMode] = useState(isDarkModeEnabled());

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

  // Mock data state - this replaces the backend data fetching
  const [stats] = useState({
    requirementsCount: 24,
    testCasesCount: 48,
    coveragePercentage: "75.00"
  });
  const [currentProject] = useState("Demo Project");

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 min-h-screen pt-24 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-5 md:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
            Dashboard
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg px-3 sm:px-3 md:px-4 py-1.5 sm:py-2 shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">{currentProject}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-7 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 ease-in-out hover:-translate-y-2 border-t-4 border-blue-500 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-blue-50 dark:bg-blue-900/30 p-3 sm:p-3.5 md:p-4 mb-4 sm:mb-5 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 mb-2">Requirements</h2>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.requirementsCount}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Total requirements in project</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-7 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 ease-in-out hover:-translate-y-2 border-t-4 border-indigo-500 dark:border-indigo-600 hover:border-indigo-400 dark:hover:border-indigo-500">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 p-3 sm:p-3.5 md:p-4 mb-4 sm:mb-5 md:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 mb-2">Test Cases</h2>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {stats.testCasesCount}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Total test cases created</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-7 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 ease-in-out hover:-translate-y-2 border-t-4 border-purple-500 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500 relative overflow-hidden">
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="rounded-full bg-purple-50 dark:bg-purple-900/40 p-3 sm:p-3.5 md:p-4 mb-4 sm:mb-5 md:mb-6 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 mb-4">Test Coverage</h2>
              <div className="mb-6 relative transform transition-all duration-300 hover:scale-105">
                <Gauge coveragePercentage={stats.coveragePercentage} />
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-2 rounded-full inline-block shadow-sm">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 text-xs sm:text-sm font-medium">Requirements with test cases</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent dark:from-purple-900/10 dark:to-transparent rounded-bl-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-100 to-transparent dark:from-purple-900/10 dark:to-transparent rounded-tr-3xl opacity-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;