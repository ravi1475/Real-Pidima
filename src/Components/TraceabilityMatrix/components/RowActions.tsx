import React, { useState } from 'react';
import { RequirementDisplay, Remediation } from '../../../types/traceability';
import { useTraceability } from '../context';

interface RowActionsProps {
  requirement: RequirementDisplay;
  remediation?: Remediation;
}

/**
 * Component that provides actions for a traceability matrix row
 */
const RowActions: React.FC<RowActionsProps> = ({ requirement, remediation }) => {
  const { deleteRequirement } = useTraceability();
  const [modalContent, setModalContent] = useState<string | null>(null);
  
  // Show confirmation dialog for delete
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete requirement "${requirement.req_id}"?`)) {
      try {
        await deleteRequirement(requirement.req_id);
      } catch (error) {
        console.error('Failed to delete requirement', error);
      }
    }
  };
  
  // Show test case form
  const handleAddTestCase = () => {
    setModalContent('addTestCase');
  };
  
  // Show remediation form
  const handleRemediation = () => {
    setModalContent(remediation ? 'editRemediation' : 'addRemediation');
  };
  
  // Close modal
  const handleCloseModal = () => {
    setModalContent(null);
  };
  
  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={handleAddTestCase}
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
          title="Add Test Case"
        >
          + Test Case
        </button>
        <button
          onClick={handleRemediation}
          className={`${remediation ? 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'} text-white px-2 py-1 rounded text-xs transition-colors duration-200`}
          title={remediation ? 'Edit Remediation' : 'Add Remediation'}
        >
          {remediation ? 'Edit Remediation' : 'Remediate'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
          title="Delete Requirement"
        >
          Delete
        </button>
      </div>
      
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            {/* Modal content would go here - forms for test case and remediation */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {modalContent === 'addTestCase' ? 'Add Test Case' : 
                 modalContent === 'addRemediation' ? 'Add Remediation' : 'Edit Remediation'}
              </h2>
              
              {/* Form content would go here */}
              
              <div className="flex justify-end mt-4 space-x-2">
                <button 
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RowActions; 