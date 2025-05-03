import React, { useState, useEffect } from 'react';
import { FaPlus, FaFileImport, FaFilter, FaSort, FaSpinner, FaLock, FaUnlock, FaTrash, FaTimes, FaSearch, FaEdit, FaEye } from 'react-icons/fa';
import { isDarkModeEnabled } from '../utils/themeUtils';
import { API } from '../config/environment';
import './animations.css'; // Import animations

const Requirements: React.FC = () => {
  const [, setIsDarkMode] = useState(isDarkModeEnabled());
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isTableLocked, setIsTableLocked] = useState(true);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{text: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  // Hardcoded project ID for now - can be changed in the future
  const PROJECT_ID = "1";
  
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

  // Auto-dismiss status messages after 5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Fetch requirements from the backend
  useEffect(() => {
    const fetchRequirements = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API.REQUIREMENTS}?projectId=${PROJECT_ID}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setRequirements(data);
        setStatusMessage({
          text: 'Requirements loaded successfully',
          type: 'success'
        });
      } catch (err) {
        console.error('Failed to fetch requirements:', err);
        setError('Failed to load requirements. Using mock data for development.');
        
        // Fallback to mock data for development purposes
        const mockData = [
          { 
            id: 'req-123-456', 
            title: 'System must support user authentication', 
            description: 'Users should be able to register and login using email/password',
            classification: 'Security', 
            module: 'Authentication',
            projectId: PROJECT_ID
          },
          { 
            id: 'req-234-567', 
            title: 'System must handle file uploads', 
            description: 'Users should be able to upload files up to 10MB in size',
            classification: 'Functionality', 
            module: 'File Management',
            projectId: PROJECT_ID
          },
          { 
            id: 'req-345-678', 
            title: 'System must be responsive', 
            description: 'UI should work on mobile and desktop devices',
            classification: 'Non-functional', 
            module: 'UI/UX',
            projectId: PROJECT_ID
          },
        ];
        
        setRequirements(mockData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequirements();
  }, []);

  // Filter requirements based on search term
  const filteredRequirements = requirements.filter(req => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      req.id?.toLowerCase().includes(searchLower) ||
      req.title?.toLowerCase().includes(searchLower) ||
      req.description?.toLowerCase().includes(searchLower) ||
      req.classification?.toLowerCase().includes(searchLower) ||
      req.module?.toLowerCase().includes(searchLower)
    );
  });

  const toggleRequirementSelection = (id: string) => {
    setSelectedRequirements(prev => 
      prev.includes(id) ? prev.filter(reqId => reqId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedRequirements.length === 0) return;
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    
    try {
      // You would implement proper API deletion here
      // For now, just filter locally
      setRequirements(prev => prev.filter(req => !selectedRequirements.includes(req.id)));
      setSelectedRequirements([]);
      setStatusMessage({
        text: `${selectedRequirements.length} requirement(s) deleted successfully`,
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to delete requirements:', err);
      setError('Failed to delete requirements. Please try again later.');
    } finally {
      setIsLoading(false);
      setShowConfirmDelete(false);
    }
  };

  const handleAddRequirement = async (requirementData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API.REQUIREMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requirementData,
          projectId: PROJECT_ID
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const newRequirement = await response.json();
      setRequirements(prev => [...prev, newRequirement]);
      setShowAddModal(false);
      setStatusMessage({
        text: 'Requirement added successfully',
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to add requirement:', err);
      
      // Generate a mock ID for frontend-only development in case of API error
      const mockId = `req-${Date.now()}`;
      const mockRequirement = {
        id: mockId,
        ...requirementData,
        projectId: PROJECT_ID
      };
      
      // Add the mock requirement to the list
      setRequirements(prev => [...prev, mockRequirement]);
      setShowAddModal(false);
      
      setStatusMessage({
        text: 'Requirement saved locally only. Backend connection failed.',
        type: 'info'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatusMessage = () => {
    if (!statusMessage) return null;
    
    const bgColors = {
      success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-400',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-400',
      info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-400'
    };
    
    return (
      <div className={`${bgColors[statusMessage.type]} p-3 rounded-lg mb-4 border shadow-sm flex justify-between items-center animate-fadeIn`}>
        <span>{statusMessage.text}</span>
        <button 
          onClick={() => setStatusMessage(null)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <FaTimes size={16} />
        </button>
      </div>
    );
  };

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
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 cursor-pointer">
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

  const AddRequirementModal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [classification, setClassification] = useState('Security');
    const [module, setModule] = useState('Authentication');
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    
    const validateForm = () => {
      const errors: {[key: string]: string} = {};
      
      if (!title.trim()) {
        errors.title = 'Title is required';
      }
      
      if (!description.trim()) {
        errors.description = 'Description is required';
      }
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
    
    const handleSubmit = () => {
      if (!validateForm()) return;
      
      handleAddRequirement({
        title,
        description,
        classification,
        module
      });
    };
    
    return (
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
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                className={`w-full rounded-md p-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder="Requirement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                className={`w-full resize-none rounded-md p-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder="Requirement description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Classification</label>
                <select 
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                >
                  <option>Security</option>
                  <option>Functionality</option>
                  <option>Non-functional</option>
                  <option>Functional</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Module</label>
                <select 
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                >
                  <option>Authentication</option>
                  <option>File Management</option>
                  <option>UI/UX</option>
                  <option>Performance</option>
                  <option>Security</option>
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
            <button 
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmDeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full inline-block mb-4">
            <FaTrash className="text-3xl text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Confirm Deletion</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete {selectedRequirements.length} selected requirement(s)? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowConfirmDelete(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={confirmDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 lg:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">
          Requirements
        </h1>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button 
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            <span className="hidden md:inline">Generate Test Cases</span>
            <span className="md:hidden">Test Cases</span>
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <FaFileImport className="mr-2" />
            <span className="hidden md:inline">Import Requirements</span>
            <span className="md:hidden">Import</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            <span className="hidden md:inline">Add Requirement</span>
            <span className="md:hidden">Add</span>
          </button>
          <button 
            onClick={handleDeleteSelected}
            className={`bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center ${selectedRequirements.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedRequirements.length === 0}
          >
            <FaTrash className="mr-2" />
            <span className="hidden md:inline">Delete Selected</span>
            <span className="md:hidden">Delete</span>
          </button>
          <button 
            onClick={() => setIsTableLocked(!isTableLocked)}
            className={`${
              isTableLocked 
                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/60' 
                : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/60'
            } font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center`}
          >
            {isTableLocked ? <FaLock className="mr-2" /> : <FaUnlock className="mr-2" />}
            <span className="hidden md:inline">{isTableLocked ? 'Unlock Editing' : 'Lock Editing'}</span>
          </button>
        </div>
      </div>
      
      {/* Search and filters bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 mb-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search requirements..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setSearchTerm('')}
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredRequirements.length} of {requirements.length} requirements
          </span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        {statusMessage && <StatusMessage />}
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 border border-red-200 dark:border-red-800 flex items-center">
            <FaTimes className="text-red-500 mr-2" />
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading requirements...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredRequirements.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                {searchTerm ? (
                  <>
                    <FaSearch className="text-4xl mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg">No requirements matching "<span className="font-semibold">{searchTerm}</span>"</p>
                    <p className="mt-2">Try adjusting your search terms or clear the search</p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Clear Search
                    </button>
                  </>
                ) : (
                  <>
                    <FaPlus className="text-4xl mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg">No requirements found</p>
                    <p className="mt-2">Create your first requirement to get started</p>
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Add Requirement
                    </button>
                  </>
                )}
              </div>
            ) : (
              <table className="w-full table-fixed border-collapse">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="w-10 border border-gray-200 dark:border-gray-700 p-2 text-center">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRequirements(filteredRequirements.map(req => req.id));
                            } else {
                              setSelectedRequirements([]);
                            }
                          }}
                          checked={selectedRequirements.length === filteredRequirements.length && filteredRequirements.length > 0}
                        />
                      </div>
                    </th>
                    <th className="w-1/6 border border-gray-200 dark:border-gray-700 p-2 text-left">
                      <div className="flex items-center">
                        ID
                        <FaSort className="ml-1 text-gray-400 cursor-pointer hover:text-blue-500" />
                      </div>
                    </th>
                    <th className="w-2/5 border border-gray-200 dark:border-gray-700 p-2 text-left">
                      <div className="flex items-center">
                        Title/Description
                        <FaSort className="ml-1 text-gray-400 cursor-pointer hover:text-blue-500" />
                      </div>
                    </th>
                    <th className="w-1/6 border border-gray-200 dark:border-gray-700 p-2 text-left">
                      <div className="flex items-center">
                        Classification
                        <FilterPopover />
                      </div>
                    </th>
                    <th className="w-1/6 border border-gray-200 dark:border-gray-700 p-2 text-left">
                      <div className="flex items-center">
                        Module
                        <FilterPopover />
                      </div>
                    </th>
                    <th className="w-1/12 border border-gray-200 dark:border-gray-700 p-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  {filteredRequirements.map((req) => (
                    <tr key={req.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150">
                      <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={selectedRequirements.includes(req.id)}
                          onChange={() => toggleRequirementSelection(req.id)}
                        />
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          {req.id}
                        </a>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        <div className="font-medium">{req.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{req.description}</div>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {req.classification}
                        </span>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          {req.module}
                        </span>
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        <div className="flex justify-center space-x-2">
                          <button 
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                            title="View Details"
                          >
                            <FaEye size={16} />
                          </button>
                          <button 
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200"
                            title="Edit"
                            disabled={isTableLocked}
                          >
                            <FaEdit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showImportModal && <ImportRequirementsModal />}
      {showAddModal && <AddRequirementModal />}
      {showConfirmDelete && <ConfirmDeleteModal />}
    </div>
  );
};

export default Requirements; 