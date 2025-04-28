import React from 'react';
import { Remediation, RemediationStatus, RemediationSeverity } from '../../../types/traceability';

interface RemediationBadgeProps {
  remediation: Remediation;
}

/**
 * Badge component to display remediation status and severity
 */
const RemediationBadge: React.FC<RemediationBadgeProps> = ({ remediation }) => {
  // Get background color based on status
  const getStatusColor = (status: RemediationStatus): string => {
    switch (status) {
      case RemediationStatus.PENDING:
        return 'bg-gray-500 dark:bg-gray-600';
      case RemediationStatus.IN_PROGRESS:
        return 'bg-blue-500 dark:bg-blue-600';
      case RemediationStatus.COMPLETED:
        return 'bg-green-500 dark:bg-green-600';
      case RemediationStatus.NOT_REQUIRED:
        return 'bg-purple-500 dark:bg-purple-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };
  
  // Get border color based on severity
  const getSeverityBorder = (severity: RemediationSeverity): string => {
    switch (severity) {
      case RemediationSeverity.LOW:
        return 'border-green-500 dark:border-green-400';
      case RemediationSeverity.MEDIUM:
        return 'border-yellow-500 dark:border-yellow-400';
      case RemediationSeverity.HIGH:
        return 'border-orange-500 dark:border-orange-400';
      case RemediationSeverity.CRITICAL:
        return 'border-red-500 dark:border-red-400';
      default:
        return 'border-gray-500 dark:border-gray-400';
    }
  };
  
  // Get severity indicator text
  const getSeverityText = (severity: RemediationSeverity): string => {
    switch (severity) {
      case RemediationSeverity.LOW:
        return 'L';
      case RemediationSeverity.MEDIUM:
        return 'M';
      case RemediationSeverity.HIGH:
        return 'H';
      case RemediationSeverity.CRITICAL:
        return 'C';
      default:
        return '';
    }
  };
  
  return (
    <div 
      className={`inline-flex items-center px-2 py-1 rounded text-white text-xs ${getStatusColor(remediation.status)} border-l-4 ${getSeverityBorder(remediation.severity)} transition-colors duration-200`}
      title={`${remediation.status} (${remediation.severity} severity)`}
    >
      <span className="mr-1">{remediation.status}</span>
      <span className={`ml-1 w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-gray-200 ${getSeverityBorder(remediation.severity)} bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300`}>
        {getSeverityText(remediation.severity)}
      </span>
    </div>
  );
};

export default RemediationBadge; 