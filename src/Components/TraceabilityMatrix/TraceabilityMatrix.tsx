import React, { useState, useCallback } from "react";
import { FaSpinner, FaCheck, FaTimes, FaComment } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTraceability } from './context';
import MatrixRow from './components/MatrixRow';
import { TraceabilityProvider } from './context';
import { TraceabilityItem } from '../../types/traceability';

const TraceabilityMatrix: React.FC = () => {
  const { state } = useTraceability();
  const { matrix, isLoading, error } = state;
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastCheckedIndex, setLastCheckedIndex] = useState<number | null>(null);
  const [critiqueText, setCritiqueText] = useState("");
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(true);

  // Handle row selection with shift key support
  const handleSelectRow = useCallback((index: number, isShiftKey: boolean) => {
    const item = matrix[index];
    if (!item.requirement) return;
    
    const req_id = item.requirement.req_id;
    
    setSelectedIds(prev => {
      const newSelectedIds = prev.includes(req_id) 
        ? prev.filter(id => id !== req_id) 
        : [...prev, req_id];
      
      // If Shift is held and lastCheckedIndex is set, select all in between
      if (isShiftKey && lastCheckedIndex !== null && lastCheckedIndex !== index) {
        const start = Math.min(lastCheckedIndex, index);
        const end = Math.max(lastCheckedIndex, index);
        
        for (let i = start; i <= end; i++) {
          const reqId = matrix[i]?.requirement?.req_id;
          if (reqId) {
            newSelectedIds.push(reqId);
          }
        }
      }

      return Array.from(new Set(newSelectedIds)); // Remove duplicates
    });

    setLastCheckedIndex(index); // Update last checked index
  }, [matrix, lastCheckedIndex]);

  // Handle "select all" toggle
  const handleToggleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      if (prev.length === 0) {
        // Select all requirements
        return matrix
          .filter((item: TraceabilityItem) => item.requirement)
          .map((item: TraceabilityItem) => item.requirement!.req_id);
      } else {
        // Deselect all
        return [];
      }
    });
  }, [matrix]);

  // Handle critique button click
  const handleCritique = async () => {
    if (selectedIds.length === 0) return;
    
    setIsCritiquing(true);
    
    // Filter selected items for future API integration
    // This comment prevents the unused variable warning while keeping the logic for later use
    // const selectedItems = matrix.filter(item => 
    //   item.requirement && selectedIds.includes(item.requirement.req_id)
    // );
    
    try {
      // BACKEND API CALL - COMMENTED OUT FOR NOW
      // const response = await fetch("/api/call-webhook", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     webhookType: WebhookType.CRITIQUE_TRACEABILITY_MATRIX,
      //     traceabilityMatrix: selectedItems,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("Critique request failed");
      // }

      // const result = await response.json();
      
      // const findings = result.results?.findings || result.findings;

      // Simulating backend response with mock data
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const mockFindings = [
        {
          finding_severity: "HIGH",
          finding_description: "REQ-001 has limited test coverage. Consider adding test cases for edge cases and error scenarios."
        },
        {
          finding_severity: "MEDIUM",
          finding_description: "REQ-003 security requirement needs more comprehensive test cases to ensure all aspects of password encryption are verified."
        },
        {
          finding_severity: "LOW",
          finding_description: "Test case TC-001 lacks specific validation steps. Consider adding verification steps for UI feedback on successful login."
        }
      ];
      
      const critiqueText = mockFindings.map((finding: any) => 
        `${finding.finding_severity}: ${finding.finding_description}`
      ).join('\n');
      
      setCritiqueText(critiqueText);
      toast.success("Critique completed successfully");
    } catch (error) {
      setCritiqueText("An error occurred during the critique.");
      toast.error("Error during critique");
    } finally {
      setIsCritiquing(false);
    }
  };

  const isCritiqueEnabled = selectedIds.length > 0;
  const hasValidMatrix = Array.isArray(matrix) && matrix.length > 0;

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 mb-6 gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Traceability Matrix</h1>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200">
            <input
              type="checkbox"
              checked={isCompactMode}
              onChange={() => setIsCompactMode(!isCompactMode)}
              className="mr-2 rounded text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-gray-800 dark:text-gray-200">Compact Mode</span>
          </label>
          <button
            className={`bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleCritique}
            disabled={isCritiquing || !isCritiqueEnabled}
          >
            {isCritiquing ? 
              <FaSpinner className="animate-spin mr-2" /> : 
              <FaComment className="mr-2" />
            }
            <span>{isCritiquing ? "Critiquing..." : "Critique"}</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/30 overflow-x-auto mt-4 transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400 text-center">{error}</div>
        ) : !hasValidMatrix ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No data available in the traceability matrix.</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300">
                <th className="px-4 py-3 text-left w-10 border-b-2 border-blue-200 dark:border-blue-800">
                  <button
                    onClick={handleToggleSelectAll}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="Toggle select all"
                  >
                    {selectedIds.length > 0 ? (
                      <FaTimes className="text-red-500 dark:text-red-400" />
                    ) : (
                      <FaCheck className="text-green-500 dark:text-green-400" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left border-b-2 border-blue-200 dark:border-blue-800">Requirement ID</th>
                <th className="px-4 py-3 text-left border-b-2 border-blue-200 dark:border-blue-800">Count</th>
                <th className="px-4 py-3 text-left border-b-2 border-blue-200 dark:border-blue-800">Test Case IDs</th>
                <th className="px-4 py-3 text-left border-b-2 border-blue-200 dark:border-blue-800">Remediation</th>
                <th className="px-4 py-3 text-left border-b-2 border-blue-200 dark:border-blue-800">Actions</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-200">
              {matrix.map((item, rowIndex) => (
                <MatrixRow
                  key={item.requirement?.req_id || `no-req-${rowIndex}`}
                  item={item}
                  isCompactMode={isCompactMode}
                  index={rowIndex}
                  isSelected={item.requirement ? selectedIds.includes(item.requirement.req_id) : false}
                  onSelectRow={handleSelectRow}
                />
              ))}
            </tbody>
          </table>
        )}

        {critiqueText && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Critique Results</h2>
            <div className="whitespace-pre-line text-sm text-gray-800 dark:text-gray-200">
              <ReactMarkdown>{critiqueText}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

// Export the component wrapped with the provider to ensure context is available
export default function TraceabilityMatrixWithProvider() {
  return (
    <TraceabilityProvider>
      <TraceabilityMatrix />
    </TraceabilityProvider>
  );
} 