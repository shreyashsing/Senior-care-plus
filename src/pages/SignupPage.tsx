import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

export function SignupPage() {
  // Redirect to the new registration page
  return <Navigate to="/register" replace />
}