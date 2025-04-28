import React, { memo } from 'react';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { TraceabilityItem } from '../../../types/traceability';
import RemediationBadge from './RemediationBadge';
import RowActions from './RowActions';

interface MatrixRowProps {
  item: TraceabilityItem;
  isCompactMode: boolean;
  index: number;
  isSelected: boolean;
  onSelectRow: (index: number, shiftKey: boolean) => void;
}

const HtmlTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} placement="top-end" arrow />
))({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 500,
    fontSize: "0.75rem",
    border: "1px solid black",
  },
});

/**
 * A single row in the traceability matrix
 * Optimized with memo to prevent unnecessary re-renders
 */
const MatrixRow: React.FC<MatrixRowProps> = memo(({ 
  item, 
  isCompactMode, 
  index,
  isSelected,
  onSelectRow
}) => {
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isShiftKey = (e.nativeEvent as MouseEvent).shiftKey;
    onSelectRow(index, isShiftKey);
  };
  
  // Only render tests up to a certain limit in compact mode
  const renderTestCases = () => {
    const testCases = item.testCases;
    const limit = isCompactMode ? 20 : testCases.length;
    const displayedTestCases = testCases.slice(0, limit);
    
    return (
      <>
        {displayedTestCases.map((testCase, idx) => (
          <span key={testCase.test_id} className="relative">
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">{testCase.description}</Typography>
                </React.Fragment>
              }
            >
              <a href={`/sys-test/${testCase.test_id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200">
                {testCase.test_id}
              </a>
            </HtmlTooltip>
            {idx < displayedTestCases.length - 1 && ", "}
          </span>
        ))}
        {isCompactMode && testCases.length > limit && (
          <span className="text-blue-500 dark:text-blue-400"> and {testCases.length - limit} more...</span>
        )}
      </>
    );
  };
  
  return (
    <tr key={item.requirement?.req_id || `no-req-${index}`} className={`transition-colors duration-200 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'}`}>
      <td className="border px-4 py-2 border-gray-200 dark:border-gray-700">
        {item.requirement && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="rounded text-blue-500 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
          />
        )}
      </td>
      <td className="border px-4 py-2 border-gray-200 dark:border-gray-700 relative">
        {item.requirement ? (
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">{item.requirement.content}</Typography>
              </React.Fragment>
            }
          >
            <a href={`/sys-requirement/${item.requirement.req_id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200">
              {item.requirement.req_id}
            </a>
          </HtmlTooltip>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">No requirement</span>
        )}
      </td>
      <td className="border px-4 py-2 border-gray-200 dark:border-gray-700">{item.testCases.length}</td>
      <td className="border px-4 py-2 border-gray-200 dark:border-gray-700 max-w-md truncate">
        {item.testCases.length > 0 ? renderTestCases() : <span className="text-gray-500 dark:text-gray-400">No test cases</span>}
      </td>
      <td className="border px-4 py-2 border-gray-200 dark:border-gray-700">
        {item.remediation ? (
          <RemediationBadge remediation={item.remediation} />
        ) : (
          <span className="text-gray-500 dark:text-gray-400">-</span>
        )}
      </td>
      <td className="border px-4 py-2 border-gray-200 dark:border-gray-700">
        {item.requirement && (
          <RowActions requirement={item.requirement} remediation={item.remediation} />
        )}
      </td>
    </tr>
  );
});

// Display name for debugging
MatrixRow.displayName = 'MatrixRow';

export default MatrixRow; 