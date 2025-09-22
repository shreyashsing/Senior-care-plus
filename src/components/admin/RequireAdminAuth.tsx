import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

interface RequireAdminAuthProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export function RequireAdminAuth({ children, requiredPermissions = [] }: RequireAdminAuthProps) {
  const { adminProfile, isAuthenticated, isLoading } = useAdminAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to admin login page with return URL
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if admin has required permissions
  if (requiredPermissions.length > 0 && adminProfile) {
    const hasPermission = requiredPermissions.every(permission => 
      adminProfile.permissions.includes(permission)
    )

    if (!hasPermission) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

// Higher-order component for permission checking
export function withAdminAuth<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermissions: string[] = []
) {
  return function ProtectedComponent(props: T) {
    return (
      <RequireAdminAuth requiredPermissions={requiredPermissions}>
        <Component {...props} />
      </RequireAdminAuth>
    )
  }
}