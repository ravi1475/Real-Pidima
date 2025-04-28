import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { TraceabilityItem, TraceabilityAction, TestCaseDisplay, Remediation, RemediationStatus, RemediationSeverity } from '../../types/traceability';

// Define the context state type
interface TraceabilityState {
  matrix: TraceabilityItem[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: TraceabilityState = {
  matrix: [],
  isLoading: true,
  error: null
};

// Create the context
const TraceabilityContext = createContext<{
  state: TraceabilityState;
  dispatch: React.Dispatch<TraceabilityAction>;
  addTestCase: (requirementId: string, testCase: TestCaseDisplay) => Promise<void>;
  deleteTestCase: (requirementId: string, testCaseId: string) => Promise<void>;
  addRemediation: (requirementId: string, remediation: Remediation) => Promise<void>;
  updateRemediation: (requirementId: string, remediation: Remediation) => Promise<void>;
  deleteRequirement: (requirementId: string) => Promise<void>;
  refreshMatrix: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => {},
  addTestCase: async () => {},
  deleteTestCase: async () => {},
  addRemediation: async () => {},
  updateRemediation: async () => {},
  deleteRequirement: async () => {},
  refreshMatrix: async () => {}
});

// Mock data for development
const mockMatrixData: TraceabilityItem[] = [
  {
    requirement: {
      req_id: "REQ-001",
      content: "The system shall provide a login mechanism for users",
      classification: "Functional",
      module: "Authentication"
    },
    testCases: [
      {
        test_id: "TC-001",
        description: "Test successful login with valid credentials",
        preconditions: "User account exists in the system",
        steps: ["Enter valid username", "Enter valid password", "Click login button"],
        expected_outcome: ["User is logged in", "Redirect to dashboard"],
        classification: "Functional",
        module: "Authentication"
      },
      {
        test_id: "TC-002",
        description: "Test login failure with invalid credentials",
        preconditions: "N/A",
        steps: ["Enter invalid username", "Enter invalid password", "Click login button"],
        expected_outcome: ["Error message is displayed", "User remains on login page"],
        classification: "Functional",
        module: "Authentication"
      }
    ],
    remediation: {
      id: "REM-001",
      req_id: "REQ-001",
      description: "Update login error messaging to be more descriptive",
      status: RemediationStatus.IN_PROGRESS,
      severity: RemediationSeverity.MEDIUM,
      assignedTo: "John Doe",
      createdAt: new Date("2023-09-15")
    }
  },
  {
    requirement: {
      req_id: "REQ-002",
      content: "The system shall allow users to reset their password",
      classification: "Functional",
      module: "Authentication"
    },
    testCases: [
      {
        test_id: "TC-003",
        description: "Test password reset with valid email",
        preconditions: "User account exists in the system",
        steps: ["Click 'Forgot Password'", "Enter valid email", "Submit form"],
        expected_outcome: ["Reset email is sent", "Confirmation message displayed"],
        classification: "Functional",
        module: "Authentication"
      }
    ]
  },
  {
    requirement: {
      req_id: "REQ-003",
      content: "The system shall encrypt all passwords using industry-standard algorithms",
      classification: "Security",
      module: "Authentication"
    },
    testCases: [
      {
        test_id: "TC-004",
        description: "Verify password is stored encrypted in the database",
        preconditions: "Test database access",
        steps: ["Create test user", "Check password field in database"],
        expected_outcome: ["Password is not stored in plaintext", "Password uses proper hashing"],
        classification: "Security",
        module: "Authentication"
      }
    ],
    remediation: {
      id: "REM-002",
      req_id: "REQ-003",
      description: "Upgrade hashing algorithm to latest standard",
      status: RemediationStatus.PENDING,
      severity: RemediationSeverity.HIGH,
      createdAt: new Date("2023-09-10")
    }
  }
];

// Reducer function
function traceabilityReducer(state: TraceabilityState, action: TraceabilityAction): TraceabilityState {
  switch (action.type) {
    case 'SET_MATRIX':
      return {
        ...state,
        matrix: action.payload,
        isLoading: false,
        error: null
      };
      
    case 'ADD_TEST_CASE': {
      const { requirementId, testCase } = action.payload;
      
      return {
        ...state,
        matrix: state.matrix.map(item => {
          if (item.requirement && item.requirement.req_id === requirementId) {
            return {
              ...item,
              testCases: [...item.testCases, testCase]
            };
          }
          return item;
        })
      };
    }
    
    case 'DELETE_TEST_CASE': {
      const { requirementId, testCaseId } = action.payload;
      
      return {
        ...state,
        matrix: state.matrix.map(item => {
          if (item.requirement && item.requirement.req_id === requirementId) {
            return {
              ...item,
              testCases: item.testCases.filter(tc => tc.test_id !== testCaseId)
            };
          }
          return item;
        })
      };
    }
    
    case 'ADD_REMEDIATION': 
    case 'UPDATE_REMEDIATION': {
      const { requirementId, remediation } = action.payload;
      
      return {
        ...state,
        matrix: state.matrix.map(item => {
          if (item.requirement && item.requirement.req_id === requirementId) {
            return {
              ...item,
              remediation
            };
          }
          return item;
        })
      };
    }
    
    case 'DELETE_REQUIREMENT': {
      const { requirementId } = action.payload;
      
      return {
        ...state,
        matrix: state.matrix.filter(item => 
          !item.requirement || item.requirement.req_id !== requirementId
        )
      };
    }
    
    default:
      return state;
  }
}

// Provider component
export const TraceabilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(traceabilityReducer, initialState);
  
  // Fetch the traceability matrix
  const refreshMatrix = async () => {
    try {
      // Simulating API loading state
      dispatch({ type: 'SET_MATRIX', payload: [] });
      
      // BACKEND API CALL - COMMENTED OUT FOR NOW
      // const response = await fetch("/api/traceability-matrix", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Cache-Control": "no-cache",
      //   },
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      //
      // const data = await response.json();
      
      // Use mock data instead of API response
      setTimeout(() => {
        const data = mockMatrixData;
        
        // Ensure we always have a valid array
        const matrix = Array.isArray(data) ? data : [];
        dispatch({ type: 'SET_MATRIX', payload: matrix });
      }, 800); // Simulate network delay
      
    } catch (error) {
      console.error('Error fetching matrix:', error);
      dispatch({
        type: 'SET_MATRIX',
        payload: []
      });
      // Set error state if needed
    }
  };
  
  // Load initial data
  useEffect(() => {
    refreshMatrix();
  }, []);
  
  // Action handlers
  const addTestCase = async (requirementId: string, testCase: TestCaseDisplay) => {
    try {
      // BACKEND API CALL - COMMENTED OUT FOR NOW
      // Await API call here
      
      // For now, just update the state directly
      dispatch({ 
        type: 'ADD_TEST_CASE', 
        payload: { requirementId, testCase } 
      });
    } catch (error) {
      console.error('Error adding test case:', error);
    }
  };
  
  const deleteTestCase = async (requirementId: string, testCaseId: string) => {
    try {
      // BACKEND API CALL - COMMENTED OUT FOR NOW
      // Await API call here
      
      // For now, just update the state directly
      dispatch({ 
        type: 'DELETE_TEST_CASE', 
        payload: { requirementId, testCaseId } 
      });
    } catch (error) {
      console.error('Error deleting test case:', error);
    }
  };
  
  const addRemediation = async (requirementId: string, remediation: Remediation) => {
    try {
      // BACKEND API CALL - COMMENTED OUT FOR NOW
      // Await API call here
      
      // For now, just update the state directly
      dispatch({ 
        type: 'ADD_REMEDIATION', 
        payload: { requirementId, remediation } 
      });
    } catch (error) {
      console.error('Error adding remediation:', error);
    }
  };
  
  const updateRemediation = async (requirementId: string, remediation: Remediation) => {
    try {
      // BACKEND API CALL - COMMENTED OUT FOR NOW
      // Await API call here
      
      // For now, just update the state directly
      dispatch({ 
        type: 'UPDATE_REMEDIATION', 
        payload: { requirementId, remediation } 
      });
    } catch (error) {
      console.error('Error updating remediation:', error);
    }
  };
  
  const deleteRequirement = async (requirementId: string) => {
    try {
      // BACKEND API CALL - COMMENTED OUT FOR NOW
      // Await API call here
      
      // For now, just update the state directly
      dispatch({ 
        type: 'DELETE_REQUIREMENT', 
        payload: { requirementId } 
      });
    } catch (error) {
      console.error('Error deleting requirement:', error);
    }
  };
  
  return (
    <TraceabilityContext.Provider value={{ 
      state, 
      dispatch,
      addTestCase,
      deleteTestCase,
      addRemediation,
      updateRemediation,
      deleteRequirement,
      refreshMatrix
    }}>
      {children}
    </TraceabilityContext.Provider>
  );
};

// Hook for using the context
export const useTraceability = () => useContext(TraceabilityContext); 