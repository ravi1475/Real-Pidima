import React, { useState, useEffect } from 'react';
import { FaPlus, FaFileImport, FaFilter, FaSort, FaSpinner, FaLock, FaUnlock, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { isDarkModeEnabled } from '../utils/themeUtils';
import './animations.css'; // Import animations

const Requirements: React.FC = () => {
  const [, setIsDarkMode] = useState(isDarkModeEnabled());
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isTableLocked, setIsTableLocked] = useState(true);

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

  // Mock data for demonstration
  useEffect(() => {
    const mockData = [
      { id: 'REQ-001', name: 'User Authentication', description: 'System shall provide secure authentication', priority: 'High', status: 'Approved' },
      { id: 'REQ-002', name: 'Data Export', description: 'System shall allow exporting data in CSV format', priority: 'Medium', status: 'In Review' },
      { id: 'REQ-003', name: 'Audit Logging', description: 'System shall maintain detailed audit logs', priority: 'High', status: 'Approved' },
      { id: 'REQ-004', name: 'User Permissions', description: 'System shall support role-based access control', priority: 'High', status: 'Draft' },
      { id: 'REQ-005', name: 'Search Functionality', description: 'System shall provide advanced search capabilities', priority: 'Medium', status: 'In Review' },
    ];
    
    setIsLoading(true);
    setTimeout(() => {
      setRequirements(mockData);
      setIsLoading(false);
    }, 1000); // Simulate loading
  }, []);

  const FilterPopover = () => (
    <div className="relative">
      <button 
        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
      >
        <FaFilter />
      </button>
      {/* Filter popover content would go here */}
    </div>
  );

  const ImportRequirementsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-4/5 max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-transform duration-300">
        <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Import Requirements</h2>
          <button 
            onClick={() => setShowImportModal(false)}
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Import File</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center">
            <FaFileImport className="text-4xl text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">Drag & drop your file here</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">Supports CSV, Excel, or XML</p>
            <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              Browse Files
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={() => setShowImportModal(false)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mr-3"
          >
            Cancel
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            Import
          </button>
        </div>
      </div>
    </div>
  );

  const AddRequirementModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-4/5 max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-transform duration-300">
        <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Requirement</h2>
          <button 
            onClick={() => setShowAddModal(false)}
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">ID</label>
            <input 
              type="text" 
              className="w-full rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="REQ-XXX"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input 
              type="text" 
              className="w-full rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Requirement Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea 
              className="w-full resize-none rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Detailed description of the requirement"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                <option>Draft</option>
                <option>In Review</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button 
            onClick={() => setShowAddModal(false)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mr-3"
          >
            Cancel
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          System Requirements
        </h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsTableLocked(!isTableLocked)}
            className={`${
              isTableLocked 
                ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/60' 
                : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/60'
            } font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center`}
          >
            {isTableLocked ? <FaLock className="mr-2" /> : <FaUnlock className="mr-2" />}
            {isTableLocked ? 'Unlock' : 'Lock'}
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <FaFileImport className="mr-2" />
            Import
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                    <div className="flex items-center">
                      ID
                      <FaSort className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                    <div className="flex items-center">
                      Name
                      <FaSort className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                    <div className="flex items-center">
                      Description
                      <FaSort className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                    <div className="flex items-center">
                      Priority
                      <FilterPopover />
                    </div>
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                    <div className="flex items-center">
                      Status
                      <FilterPopover />
                    </div>
                  </th>
                  <th className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => (
                  <tr key={req.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150">
                    <td className="border border-gray-200 dark:border-gray-700 p-2">{req.id}</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2 font-medium">{req.name}</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2 truncate">{req.description}</td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        req.priority === 'High' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
                          : req.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'Approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                          : req.status === 'In Review'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                            : req.status === 'Rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="border border-gray-200 dark:border-gray-700 p-2">
                      <div className="flex justify-center space-x-2">
                        <button 
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                          disabled={isTableLocked}
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                          disabled={isTableLocked}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showImportModal && <ImportRequirementsModal />}
      {showAddModal && <AddRequirementModal />}
    </div>
  );
};

export default Requirements; 