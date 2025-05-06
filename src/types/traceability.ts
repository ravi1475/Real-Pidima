// Types for traceability matrix components

export enum RemediationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  NOT_REQUIRED = 'not_required'
}

export enum RemediationSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface RequirementDisplay {
  req_id: string;
  content: string;
  classification: string;
  module: string;
  description?: string;
  priority?: string;
  status?: string;
}

export interface TestCaseDisplay {
  test_id: string;
  description: string;
  preconditions: string;
  steps: string[] | string;
  expected_outcome: string[] | string;
  classification: string;
  module: string;
  id?: string; // Added for compatibility with new traceability UI
}

export interface Remediation {
  id: string;
  req_id: string;
  description: string;
  status: RemediationStatus;
  severity: RemediationSeverity;
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TraceabilityMapping {
  id?: string;
  requirementId: string;
  testcaseId: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TraceabilityItem {
  requirement: RequirementDisplay | null;
  testCases: TestCaseDisplay[];
  /**
   * @deprecated This field is no longer used in the updated UI
   */
  remediation?: Remediation;
  mappings?: TraceabilityMapping[]; // Added for new traceability UI
}

export type TraceabilityAction = 
  | { type: 'SET_MATRIX', payload: TraceabilityItem[] }
  | { type: 'ADD_TEST_CASE', payload: { requirementId: string, testCase: TestCaseDisplay } }
  | { type: 'DELETE_TEST_CASE', payload: { requirementId: string, testCaseId: string } }
  | { type: 'ADD_REMEDIATION', payload: { requirementId: string, remediation: Remediation } }
  | { type: 'UPDATE_REMEDIATION', payload: { requirementId: string, remediation: Remediation } }
  | { type: 'DELETE_REQUIREMENT', payload: { requirementId: string } }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS', payload: TraceabilityItem[] }
  | { type: 'FETCH_ERROR', payload: string }
  | { type: 'FETCH_MAPPINGS_SUCCESS', payload: TraceabilityMapping[] }
  | { type: 'ADD_MAPPING', payload: TraceabilityMapping }
  | { type: 'REMOVE_MAPPING', payload: string };