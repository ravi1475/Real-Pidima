import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useTraceability } from '../context';

interface AddMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMappingModal: React.FC<AddMappingModalProps> = ({ isOpen, onClose }) => {
  const { createMapping } = useTraceability();
  const [requirementId, setRequirementId] = useState('');
  const [testcaseId, setTestcaseId] = useState('');
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    // For demonstration, we'd normally fetch test cases here too
    // but we'll simulate it for now
    setTestCases([
      { id: '09941cc9-d368-4963-8b9c-5b8ead1789af', name: 'TC-001: Login Authentication' },
      { id: '7c88b9a2-df56-48c1-aa38-1fd4fbe35a0f', name: 'TC-002: Password Reset' },
      { id: 'a1f3e86b-2e9a-42c4-b1c1-95d99f38ab2c', name: 'TC-003: User Registration' }
    ]);
   
    // Default values for quick testing in development
    setRequirementId('d7b33e78-de01-4feb-a9a7-d41a15988bfa');
    setTestcaseId('09941cc9-d368-4963-8b9c-5b8ead1789af');
    setDescription('Traceability used for testing');
  }, []);

  const handleSubmit = async () => {
    if (!requirementId || !testcaseId) return;
    
    await createMapping({
      id: `map-${Date.now()}`,
      requirementId,
      testcaseId,
      description,
      createdAt: new Date().toISOString()
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Mapping</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Requirement</label>
            <select 
              className="w-full p-2 border rounded"
              value={requirementId}
              onChange={(e) => setRequirementId(e.target.value)}
            >
              <option value="">Select Requirement</option>
              <option value="d7b33e78-de01-4feb-a9a7-d41a15988bfa">REQ-001: Login System</option>
              <option value="8c9e5f3a-7b12-4d6e-8945-c36d8e2a10a9">REQ-002: User Management</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Test Case</label>
            <select 
              className="w-full p-2 border rounded"
              value={testcaseId}
              onChange={(e) => setTestcaseId(e.target.value)}
            >
              <option value="">Select Test Case</option>
              {testCases.map(tc => (
                <option key={tc.id} value={tc.id}>{tc.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea 
              className="w-full p-2 border rounded"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-6 gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Mapping
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMappingModal;