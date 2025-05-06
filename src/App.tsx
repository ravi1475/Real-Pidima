import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SignIn from './Auth Services/SignIn'
import UserProfile from './Auth Services/UserService'
import AdminDashboard from './Auth Services/AdminService'
import Layout from './Layout/Layout'
import { initializeDarkMode, isDarkModeEnabled, applyDarkMode } from './utils/themeUtils'
import './App.css'
import Dashboard from './Components/Page'
import Requirements from './Components/Requirements'
import TestSpecs from './Components/TestSpecs'
import TraceabilityMatrix from './Components/TraceabilityMatrix/TraceabilityMatrix'
import ImportExportPage from './Pages/ImportExportPage'
import RegisterUser from './Pages/RegisterUser'
import OrganizationCreation from './Pages/OrganizationCreation'
import AccountPage from './Pages/AccountPage'
// Placeholder components for routes

// const Requirements = () => <div className="p-6">Requirements Page</div>
// const TestSpecs = () => <div className="p-6">Test Specifications Page</div>
// const TraceabilityMatrix = () => <div className="p-6">Traceability Matrix Page</div>
// const ImportExport = () => <div className="p-6">Import/Export Page</div>
const Terms = () => <div className="p-6">Terms of Service Page</div>
const Licenses = () => <div className="p-6">Privacy Policy Page</div>
const Help = () => <div className="p-6">Help Page</div>
const Contact = () => <div className="p-6">Contact Support Page</div>

// Auth guard component
const ProtectedRoute = ({ children, requiredRole = null }: { children: React.ReactElement, requiredRole?: string | null }) => {
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  
  if (!authToken) {
    return <Navigate to="/auth/signin" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeEnabled());
  
  // Initialize and set up theme (ensuring light theme is properly set)
  useEffect(() => {
    // Force light theme if no preference is explicitly set
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
      applyDarkMode(false);
    } else {
      // Initialize with existing preferences
      initializeDarkMode();
    }
    
    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      setIsDarkMode(e.detail.isDarkMode);
      
      // Apply appropriate class to the entire document
      if (e.detail.isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
      }
    };
    
    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);
  
  return (
    <Router>
      <div className={isDarkMode ? 'dark' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth">
            <Route path="signin" element={<SignIn />} />
            {/* Add other auth routes here (signup, forgot-password, etc.) */}
          </Route>
          
          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            {/* User Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/sys-requirements" element={
              <ProtectedRoute>
                <Requirements />
              </ProtectedRoute>
            } />
            <Route path="/sys-tests" element={
              <ProtectedRoute>
                <TestSpecs />
              </ProtectedRoute>
            } />
            <Route path="/traceability-matrix" element={
              <ProtectedRoute>
                <TraceabilityMatrix />
              </ProtectedRoute>
            } />
            <Route path="/import-export" element={
              <ProtectedRoute>
                <ImportExportPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Secondary Routes */}
            <Route path="/registeruser" element={
              <ProtectedRoute>
                <RegisterUser />
              </ProtectedRoute>
            } />
            <Route path="/originationcreation" element={
              <ProtectedRoute>
                <OrganizationCreation />
              </ProtectedRoute>
            } />
            <Route path="/terms" element={<Terms />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/auth/signin" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
