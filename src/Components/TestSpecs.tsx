import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSort, FaSpinner, FaLock, FaUnlock, FaTimes, FaAngleLeft, FaAngleRight, FaExclamationTriangle } from 'react-icons/fa';
import { isDarkModeEnabled } from '../utils/themeUtils';
import './animations.css';
import { apiService } from '../services/ApiService';

// Define types for our API data
interface TestCase {
  id: string;
  title: string;
  description: string;
  projectId: string;
  steps: string;
  expectedResult: string;
  status?: string;
}

// API constants
const PROJECT_ID = '1'; // Fixed project ID for now

// API operations using our centralized service
const api = {
  // Get test cases for a project
  getTestCases: async (): Promise<TestCase[]> => {
    try {
      return await apiService.testCases.getAll(PROJECT_ID);
    } catch (error) {
      console.error('Failed to fetch test cases:', error);
      throw error;
    }
  },
  
  // Create a new test case
  createTestCase: async (testCase: Omit<TestCase, 'id'>): Promise<TestCase> => {
    try {
      // Log the request payload for debugging
      console.log('Creating test case with payload:', testCase);
      
      return await apiService.testCases.create(testCase);
    } catch (error) {
      console.error('Failed to create test case:', error);
      throw error;
    }
  },
  
  // Update an existing test case
  updateTestCase: async (testCase: TestCase): Promise<TestCase> => {
    try {
      return await apiService.testCases.update(testCase.id, testCase);
    } catch (error) {
      console.error('Failed to update test case:', error);
      throw error;
    }
  },
  
  // Delete a test case
  deleteTestCase: async (id: string): Promise<void> => {
    try {
      await apiService.testCases.delete(id);
    } catch (error) {
      console.error('Failed to delete test case:', error);
      throw error;
    }
  },
};

const TestSpecs: React.FC = () => {
  const [, setIsDarkMode] = useState(isDarkModeEnabled());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tests, setTests] = useState<TestCase[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isTableLocked, setIsTableLocked] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentTest, setCurrentTest] = useState<TestCase | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

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

  // Load test cases from API
  const loadTestCases = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.getTestCases();
      setTests(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      setError('Failed to load test cases. Please try again later.');
      console.error('Error loading test cases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestCases();
  }, []);

  const handleTestSelection = (testId: string) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    } else {
      setSelectedTests([...selectedTests, testId]);
    }
  };

  const handleBulkSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTests(tests.map(test => test.id));
    } else {
      setSelectedTests([]);
    }
  };

  const handleEditTest = (test: TestCase) => {
    setCurrentTest(test);
    setShowDetailModal(true);
  };

  const handleAddTest = () => {
    setCurrentTest({
      id: '',
      title: '',
      description: '',
      projectId: PROJECT_ID,
      steps: '',
      expectedResult: '',
      status: 'NOT_RUN' // Set a default status
    });
    setShowAddModal(true);
  };

  const handleDeleteSelected = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Delete all selected test cases
      const deletePromises = selectedTests.map(id => api.deleteTestCase(id));
      await Promise.all(deletePromises);
      
      // Refresh the list
      await loadTestCases();
      setSelectedTests([]);
    } catch (err) {
      setError('Failed to delete test cases. Please try again later.');
      console.error('Error deleting test cases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTest = async () => {
    if (!currentTest) return;
    
    // Validate required fields
    if (!currentTest.title.trim()) {
      setError('Title is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (showAddModal) {
        // Create new test case - ensure data structure matches API expectations
        const { id, ...testWithoutId } = currentTest;
        
        // Ensure steps and expectedResult are properly formatted
        const testData = {
          ...testWithoutId,
          steps: testWithoutId.steps.trim() || 'No steps provided',
          expectedResult: testWithoutId.expectedResult.trim() || 'No expected results provided'
        };
        
        await api.createTestCase(testData);
      } else {
        // Update existing test case
        await api.updateTestCase(currentTest);
      }
      
      // Refresh the list
      await loadTestCases();
      setShowDetailModal(false);
      setShowAddModal(false);
    } catch (err: any) {
      // Improved error handling with more specific messages
      if (err.message.includes('401')) {
        setError('Authentication error. Please log in again.');
      } else if (err.message.includes('400')) {
        setError('Invalid test case data. Please check your input and try again.');
      } else {
        setError(`Failed to ${showAddModal ? 'create' : 'update'} test case. ${err.message || 'Please try again later.'}`);
      }
      console.error(`Error ${showAddModal ? 'creating' : 'updating'} test case:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to split steps or expected results into an array
  const splitToArray = (text: string): string[] => {
    if (!text) return [];
    return text.split('\n').filter(Boolean);
  };

  // Helper function to join array to string with newline separators
  const joinToString = (arr: string[]): string => {
    return arr.join('\n');
  };

  const ListInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
  }> = ({ value, onChange, placeholder, disabled = false }) => {
    // Split the string into an array for display and editing
    const [items, setItems] = useState<string[]>(splitToArray(value));
    const [inputValue, setInputValue] = useState('');

    // Update parent when items change
    useEffect(() => {
      onChange(joinToString(items));
    }, [items, onChange]);

    // Update local state when value prop changes
    useEffect(() => {
      setItems(splitToArray(value));
    }, [value]);

    const handleAddItem = () => {
      if (inputValue.trim()) {
        const newItems = [...items, inputValue.trim()];
        setItems(newItems);
        setInputValue('');
      }
    };

    const handleRemoveItem = (index: number) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddItem();
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-grow rounded-l-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleAddItem}
            disabled={disabled}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded-r-md transition-colors duration-200"
          >
            <FaPlus />
          </button>
        </div>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
              <span className="text-gray-700 dark:text-gray-300">{`${index + 1}. ${item}`}</span>
              {!disabled && (
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <FaTimes />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const formatList = (text: string): string => {
    if (!text) return '';
    return splitToArray(text)
      .map((item, index) => `${index + 1}. ${item}`)
      .join(' ');
  };

  const TestDetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-4/5 max-w-4xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {showAddModal ? 'Add New Test' : 'Test Details'}
          </h2>
          <button 
            onClick={() => {
              setShowDetailModal(false);
              setShowAddModal(false);
              setError(null); // Clear any errors when closing
            }}
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Test ID</label>
              <input 
                type="text" 
                value={currentTest?.id || ''}
                disabled={true} // Always disabled, as ID is generated by API
                className="w-full rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                placeholder="Generated automatically"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={currentTest?.title || ''}
                onChange={(e) => setCurrentTest(curr => curr ? {...curr, title: e.target.value} : null)}
                className="w-full rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Test title"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea 
              value={currentTest?.description || ''}
              onChange={(e) => setCurrentTest(curr => curr ? {...curr, description: e.target.value} : null)}
              className="w-full resize-none rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Detailed description of the test"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Steps</label>
            <ListInput 
              value={currentTest?.steps || ''}
              onChange={(steps) => setCurrentTest(curr => curr ? {...curr, steps} : null)}
              placeholder="Add a step and press Enter"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Expected Result</label>
            <ListInput 
              value={currentTest?.expectedResult || ''}
              onChange={(expectedResult) => setCurrentTest(curr => curr ? {...curr, expectedResult} : null)}
              placeholder="Add an expected outcome and press Enter"
            />
          </div>
          {!showAddModal && (
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={currentTest?.status || ''}
                onChange={(e) => setCurrentTest(curr => curr ? {...curr, status: e.target.value} : null)}
                className="w-full rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Status</option>
                <option value="PASSED">Passed</option>
                <option value="FAILED">Failed</option>
                <option value="BLOCKED">Blocked</option>
                <option value="NOT_RUN">Not Run</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button 
            onClick={() => {
              setShowDetailModal(false);
              setShowAddModal(false);
            }}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mr-3"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveTest}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : 'Save Test'}
          </button>
        </div>
      </div>
    </div>
  );

  // Get current page of tests
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tests.slice(startIndex, endIndex);
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between border-t dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-b-xl">
      <div className="flex items-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{tests.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, tests.length)}</span> of{' '}
          <span className="font-medium">{tests.length}</span> results
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          <FaAngleLeft className="mr-1" />
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Next
          <FaAngleRight className="ml-1" />
        </button>
      </div>
    </div>
  );

  const currentPageData = getCurrentPageData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Test Specifications
        </h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsTableLocked(!isTableLocked)}
            className={`${
              isTableLocked 
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/60' 
                : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/60'
            } font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center`}
          >
            {isTableLocked ? <FaLock className="mr-2" /> : <FaUnlock className="mr-2" />}
            {isTableLocked ? 'Unlock Editing' : 'Lock Editing'}
          </button>
          {selectedTests.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center disabled:opacity-50"
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaTrash className="mr-2" />}
              Delete Selected
            </button>
          )}
          <button 
            onClick={handleAddTest}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center disabled:opacity-50"
          >
            <FaPlus className="mr-2" />
            Add Test
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        {isLoading && tests.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400" />
          </div>
        ) : tests.length === 0 && !isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 text-gray-500 dark:text-gray-400">
            <p className="mb-4">No test cases found</p>
            <button 
              onClick={handleAddTest}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add your first test case
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-left w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedTests.length === tests.length && tests.length > 0}
                        onChange={handleBulkSelection}
                        className="rounded dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                      />
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-left w-24">
                      <div className="flex items-center">
                        ID
                        <FaSort className="ml-1 text-gray-400" />
                      </div>
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                      <div className="flex items-center">
                        Title
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
                      Steps
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                      Expected Result
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((test) => (
                    <tr key={test.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150">
                      <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedTests.includes(test.id)}
                          onChange={() => handleTestSelection(test.id)}
                          className="rounded dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2 font-mono text-blue-500 cursor-pointer hover:underline" onClick={() => handleEditTest(test)}>
                        {test.id.substring(0, 8)}...
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2 font-medium">
                        {test.title}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        {test.description}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        {formatList(test.steps)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        {formatList(test.expectedResult)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          test.status === 'PASSED' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                          test.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                          test.status === 'BLOCKED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                        }`}>
                          {test.status || 'NOT_RUN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        )}
      </div>
      
      {/* Modals */}
      {(showDetailModal || showAddModal) && <TestDetailModal />}
    </div>
  );
};

export default TestSpecs; 