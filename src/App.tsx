import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import SignIn from './Auth Services/SignIn'
import Layout from './Layout/Layout'
import { initializeDarkMode } from './utils/themeUtils'
import './App.css'
import Dashboard from './Components/Page'
import Requirements from './Components/Requirements'
import TestSpecs from './Components/TestSpecs'
// Placeholder components for routes

// const Requirements = () => <div className="p-6">Requirements Page</div>
// const TestSpecs = () => <div className="p-6">Test Specifications Page</div>
const TraceabilityMatrix = () => <div className="p-6">Traceability Matrix Page</div>
const ImportExport = () => <div className="p-6">Import/Export Page</div>
const Account = () => <div className="p-6">Account Settings Page</div>
const AdminDashboard = () => <div className="p-6">Admin Dashboard Page</div>
const Terms = () => <div className="p-6">Terms of Service Page</div>
const Licenses = () => <div className="p-6">Privacy Policy Page</div>
const Help = () => <div className="p-6">Help Page</div>
const Contact = () => <div className="p-6">Contact Support Page</div>

function App() {
  // Initialize and set up dark mode
  useEffect(() => {
    initializeDarkMode();
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth">
          <Route path="signin" element={<SignIn />} />
          {/* Add other auth routes here (signup, forgot-password, etc.) */}
        </Route>
        
        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          {/* User Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/sys-requirements" element={<Requirements />} />
          <Route path="/sys-tests" element={<TestSpecs />} />
          <Route path="/traceability-matrix" element={<TraceabilityMatrix />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/account" element={<Account />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Secondary Routes */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>
    </Router>
  )
}

export default App
