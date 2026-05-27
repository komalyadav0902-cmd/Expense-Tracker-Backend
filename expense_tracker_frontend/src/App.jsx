import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddEditExpense from './pages/AddEditExpense'
import Analytics from './pages/Analytics'
import Navbar from './components/Navbar'

// ProtectedRoute: if user is not logged in (no token), redirect to /login
// This is a custom component that wraps any page we want to protect
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}

function App() {
  return (
    <>
      <Routes>
        {/* Public routes - anyone can access */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - only logged in users */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/expenses/add" element={
          <ProtectedRoute>
            <Navbar />
            <AddEditExpense />
          </ProtectedRoute>
        } />

        <Route path="/expenses/edit/:id" element={
          <ProtectedRoute>
            <Navbar />
            <AddEditExpense />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute>
            <Navbar />
            <Analytics />
          </ProtectedRoute>
        } />

        {/* Default: redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  )
}

export default App