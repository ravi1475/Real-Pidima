import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaFilter, FaSort, FaSpinner, FaLock, FaUnlock, FaEdit, FaTimes, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { isDarkModeEnabled } from '../utils/themeUtils';
import './animations.css';

const TestSpecs: React.FC = () => {
  const [, setIsDarkMode] = useState(isDarkModeEnabled());
  const [isLoading, setIsLoading] = useState(false);
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isTableLocked, setIsTableLocked] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      { 
        id: 'TC-001', 
        description: 'Verify user login with valid credentials',
        preconditions: 'User has an active account in the system',
        steps: ['Navigate to login page', 'Enter valid username', 'Enter valid password', 'Click login button'],
        expectedOutcome: 'User is successfully logged in and redirected to dashboard',
        classification: 'Functional',
        module: 'Authentication'
      },
      { 
        id: 'TC-002', 
        description: 'Verify user login with invalid credentials',
        preconditions: 'User has an active account in the system',
        steps: ['Navigate to login page', 'Enter invalid username', 'Enter invalid password', 'Click login button'],
        expectedOutcome: 'User receives "Invalid credentials" error message',
        classification: 'Functional',
        module: 'Authentication'
      },
      { 
        id: 'TC-003', 
        description: 'Verify requirements can be exported to CSV',
        preconditions: 'User is logged in with admin privileges',
        steps: ['Navigate to Requirements page', 'Click Export button', 'Select CSV format', 'Confirm export'],
        expectedOutcome: 'CSV file with all requirements is downloaded',
        classification: 'Functional',
        module: 'Export'
      },
      { 
        id: 'TC-004', 
        description: 'Verify system handles high user load',
        preconditions: 'Test environment with load testing tools configured',
        steps: ['Configure load test for 1000 concurrent users', 'Run test for 1 hour', 'Monitor system performance'],
        expectedOutcome: 'System maintains response time under 2 seconds with 1000 concurrent users',
        classification: 'Performance',
        module: 'System'
      },
      { 
        id: 'TC-005', 
        description: 'Verify password reset functionality',
        preconditions: 'User has an active account in the system',
        steps: ['Navigate to login page', 'Click "Forgot Password" link', 'Enter registered email', 'Click Submit', 'Check email for reset link', 'Click reset link', 'Enter new password', 'Confirm new password'],
        expectedOutcome: 'Password is reset successfully and user can login with new password',
        classification: 'Functional',
        module: 'Authentication'
      }
    ];
    
    setIsLoading(true);
    setTimeout(() => {
      setTests(mockData);
      setTotalPages(Math.ceil(mockData.length / 10)); // Assuming 10 items per page
      setIsLoading(false);
    }, 1200); // Simulate loading
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

  const handleEditTest = (test: any) => {
    setCurrentTest(test);
    setShowDetailModal(true);
  };

  const handleAddTest = () => {
    setCurrentTest({
      id: '',
      description: '',
      preconditions: '',
      steps: [],
      expectedOutcome: '',
      classification: 'Functional',
      module: ''
    });
    setShowAddModal(true);
  };

  const handleDeleteSelected = () => {
    setTests(tests.filter(test => !selectedTests.includes(test.id)));
    setSelectedTests([]);
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

  const ListInput: React.FC<{
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
  }> = ({ value, onChange, placeholder, disabled = false }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddItem = () => {
      if (inputValue.trim()) {
        onChange([...value, inputValue.trim()]);
        setInputValue('');
      }
    };

    const handleRemoveItem = (index: number) => {
      const newList = [...value];
      newList.splice(index, 1);
      onChange(newList);
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
          {value.map((item, index) => (
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
            }}
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Test ID</label>
              <input 
                type="text" 
                value={currentTest?.id || ''}
                disabled={!showAddModal}
                className="w-full rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                placeholder="TC-XXX"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Module</label>
              <input 
                type="text" 
                value={currentTest?.module || ''}
                className="w-full rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Module Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea 
              value={currentTest?.description || ''}
              className="w-full resize-none rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Detailed description of the test"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Preconditions</label>
            <textarea 
              value={currentTest?.preconditions || ''}
              className="w-full resize-none rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Conditions that must be met before test execution"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Steps</label>
            <ListInput 
              value={currentTest?.steps || []}
              onChange={(steps) => setCurrentTest({...currentTest, steps})}
              placeholder="Add a step and press Enter"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Expected Outcome</label>
            <textarea 
              value={currentTest?.expectedOutcome || ''}
              className="w-full resize-none rounded-md p-2 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="What should happen when test is executed successfully"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Classification</label>
            <select 
              value={currentTest?.classification || 'Functional'}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option>Functional</option>
              <option>Performance</option>
              <option>Security</option>
              <option>Usability</option>
              <option>Compatibility</option>
              <option>Integration</option>
              <option>Regression</option>
            </select>
          </div>
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
          <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            Save Test
          </button>
        </div>
      </div>
    </div>
  );

  const renderPagination = () => (
    <div className="flex items-center justify-between border-t dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-b-xl">
      <div className="flex items-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{tests.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * 10, tests.length)}</span> of{' '}
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
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
            >
              <FaTrash className="mr-2" />
              Delete Selected
            </button>
          )}
          <button 
            onClick={handleAddTest}
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Test
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400" />
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
                        Description
                        <FaSort className="ml-1 text-gray-400" />
                      </div>
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                      <div className="flex items-center">
                        Preconditions
                        <FilterPopover />
                      </div>
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-left">
                      <div className="flex items-center">
                        Module
                        <FilterPopover />
                      </div>
                    </th>
                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-center w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150">
                      <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedTests.includes(test.id)}
                          onChange={() => handleTestSelection(test.id)}
                          className="rounded dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2 font-mono">{test.id}</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2 font-medium">{test.description}</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">{test.preconditions}</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2">{test.module}</td>
                      <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                        <button 
                          onClick={() => handleEditTest(test)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        >
                          <FaEdit />
                        </button>
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