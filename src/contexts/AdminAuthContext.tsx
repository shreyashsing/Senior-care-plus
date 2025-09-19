import React, { createContext, useContext, useState, useEffect } from 'react'
import { authenticateAdmin, AdminUser, AdminLoginData } from '../lib/adminService'

interface AdminAuthContextType {
  admin: AdminUser | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if admin is already logged in on component mount
  useEffect(() => {
    const checkAuth = () => {
      const savedAdmin = localStorage.getItem('adminAuth')
      if (savedAdmin) {
        try {
          const adminData = JSON.parse(savedAdmin)
          setAdmin(adminData)
        } catch (error) {
          console.error('Error parsing saved admin auth:', error)
          localStorage.removeItem('adminAuth')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const loginData: AdminLoginData = { username, password }
      const adminUser = await authenticateAdmin(loginData)

      if (adminUser) {
        setAdmin(adminUser)
        localStorage.setItem('adminAuth', JSON.stringify(adminUser))
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('adminAuth')
  }

  const value = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
    isLoading
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}