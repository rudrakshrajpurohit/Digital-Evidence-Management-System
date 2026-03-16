import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import LoadingSpinner from '../utils/LoadingSpinner'
import { ShieldOff } from 'lucide-react'

const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
      <ShieldOff className="w-8 h-8 text-red-400" />
    </div>
    <h2 className="text-xl font-bold text-white">Access Denied</h2>
    <p className="text-gray-400 text-sm">You don't have permission to view this page.</p>
  </div>
)

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, hasRole } = useAuth()

  if (loading) {
    return <LoadingSpinner fullscreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <AccessDenied />
  }

  return children
}

export default ProtectedRoute
