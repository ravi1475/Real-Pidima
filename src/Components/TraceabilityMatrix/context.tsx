import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { TraceabilityItem, TraceabilityAction, TestCaseDisplay, TraceabilityMapping } from '../../types/traceability';
import { httpService } from '../../Auth Services/UserService';
import { API } from '../../config/environment';

// Define the context state type
interface TraceabilityState {
  matrix: TraceabilityItem[];
  isLoading: boolean;
  error: string | null;
  mappings: TraceabilityMapping[];
}

// Initial state
const initialState: TraceabilityState = {
  matrix: [],
  isLoading: true,
  error: null,
  mappings: []
};

// Create the context
const TraceabilityContext = createContext<{
  state: TraceabilityState;
  dispatch: React.Dispatch<TraceabilityAction>;
  addTestCase: (requirementId: string, testCase: TestCaseDisplay) => Promise<void>;
  deleteTestCase: (requirementId: string, testCaseId: string) => Promise<void>;
  deleteRequirement: (requirementId: string) => Promise<void>;
  refreshMatrix: () => Promise<void>;
  fetchMappings: () => Promise<void>;
  createMapping: (mapping: TraceabilityMapping) => Promise<void>;
  deleteMapping: (id: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => {},
  addTestCase: async () => {},
  deleteTestCase: async () => {},
  deleteRequirement: async () => {},
  refreshMatrix: async () => {},
  fetchMappings: async () => {},
  createMapping: async () => {},
  deleteMapping: async () => {}
});

// Mock data for development - commented out to avoid unused variable warnings
/* 
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
    ]
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
    ]
  }
];
*/

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
      
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
      
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, matrix: action.payload, error: null };
      
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
      
    case 'FETCH_MAPPINGS_SUCCESS':
      return { ...state, mappings: action.payload };
      
    case 'ADD_MAPPING':
      return { ...state, mappings: [...state.mappings, action.payload] };
      
    case 'REMOVE_MAPPING':
      return {
        ...state,
        mappings: state.mappings.filter(mapping => mapping.id !== action.payload)
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
  
  // Fetch the traceability matrix data
  const fetchTraceabilityMatrix = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      // First, fetch all requirements
      const requirementsResponse = await httpService.get(API.PROJECT_REQUIREMENTS);
      
      // Create matrix items from requirements
      // In a real app, you would fetch test cases associated with each requirement
      const matrixItems: TraceabilityItem[] = requirementsResponse.map((req: any) => ({
        requirement: {
          req_id: req.id,
          content: req.description || '',
          classification: req.type || 'FUNCTIONAL',
          module: req.domain || 'General',
          // Add the additional fields that we use in our updated UI
          description: req.description,
          priority: req.priority,
          status: req.status
        },
        testCases: [] // Will be populated from the backend
      }));
      
      dispatch({ type: 'FETCH_SUCCESS', payload: matrixItems });
    } catch (error: any) {
      console.error('Error fetching traceability matrix:', error);
      dispatch({ type: 'FETCH_ERROR', payload: error.message || 'Failed to fetch traceability matrix' });
    }
  };
  
  // Load initial data
  useEffect(() => {
    fetchTraceabilityMatrix();
    fetchMappings();
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

  // Fetch all traceability mappings
  const fetchMappings = async () => {
    try {
      const mappings = await httpService.get(API.TRACEABILITY);
      dispatch({ type: 'FETCH_MAPPINGS_SUCCESS', payload: mappings });
    } catch (error: any) {
      console.error('Error fetching traceability mappings:', error);
      // You might want to dispatch an error action here
    }
  };

  // Create a new traceability mapping
  const createMapping = async (mapping: TraceabilityMapping) => {
    try {
      const newMapping = await httpService.post(API.TRACEABILITY, mapping);
      dispatch({ type: 'ADD_MAPPING', payload: newMapping });
    } catch (error: any) {
      console.error('Error creating traceability mapping:', error);
      throw error;
    }
  };

  // Delete a traceability mapping
  const deleteMapping = async (id: string) => {
    try {
      await httpService.delete(`${API.TRACEABILITY}/${id}`);
      dispatch({ type: 'REMOVE_MAPPING', payload: id });
    } catch (error: any) {
      console.error('Error deleting traceability mapping:', error);
      throw error;
    }
  };

  return (
    <TraceabilityContext.Provider value={{ 
      state, 
      dispatch,
      addTestCase,
      deleteTestCase,
      deleteRequirement,
      refreshMatrix: fetchTraceabilityMatrix,
      fetchMappings,
      createMapping,
      deleteMapping
    }}>
      {children}
    </TraceabilityContext.Provider>
  );
};

// Hook for using the context
export const useTraceability = () => useContext(TraceabilityContext); 