import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AdminProfile {
  id: string
  username: string
  full_name: string
  role: 'admin' | 'super_admin' | 'manager'
  permissions: string[]
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

interface AdminAuthContextType {
  user: User | null
  adminProfile: AdminProfile | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if admin is already logged in and fetch admin profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current user session
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser(user)
          
          // Fetch admin profile
          const { data: profile, error } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('id', user.id)  // Using id instead of user_id based on your schema
            .single()

          if (profile && !error) {
            setAdminProfile(profile)
          } else {
            console.warn('Admin profile not found for user:', user.id)
            // User exists but no admin profile - logout
            await supabase.auth.signOut()
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          
          // Fetch admin profile
          const { data: profile } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('id', session.user.id)  // Using id instead of user_id
            .single()

          if (profile) {
            setAdminProfile(profile)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setAdminProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔍 Starting login process for username:', username)
      
      // First, get email by username using the database function from your schema
      console.log('🔍 Calling get_email_by_username function...')
      const { data: emailData, error: emailError } = await supabase
        .rpc('get_email_by_username', { admin_username: username })

      console.log('📧 Email lookup result:', { emailData, emailError })

      if (emailError) {
        console.error('❌ Error getting email by username:', emailError)
        return false
      }

      if (!emailData) {
        console.error('❌ No email found for username:', username)
        return false
      }

      const email = emailData as string
      console.log('✅ Found email for username:', email)

      // Now authenticate with email and password
      console.log('🔐 Attempting authentication with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('🔐 Authentication result:', { data: data?.user?.id, error })

      if (error) {
        console.error('❌ Authentication error:', error)
        return false
      }

      if (data.user) {
        console.log('✅ User authenticated successfully, ID:', data.user.id)
        
        // Check if user has admin profile
        console.log('👤 Fetching admin profile...')
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        console.log('👤 Admin profile result:', { profile, profileError })

        if (profileError || !profile) {
          console.error('❌ User is not an admin:', profileError)
          await supabase.auth.signOut()
          return false
        }

        // Update last login using the database function from your schema
        console.log('⏰ Updating last login...')
        const { error: loginUpdateError } = await supabase.rpc('update_admin_last_login', { 
          admin_user_id: data.user.id 
        })

        if (loginUpdateError) {
          console.warn('⚠️ Could not update last login:', loginUpdateError)
        }

        console.log('✅ Admin login successful!')
        setUser(data.user)
        setAdminProfile(profile)
        return true
      }

      console.error('❌ No user data returned')
      return false
    } catch (error) {
      console.error('❌ Login error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setAdminProfile(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    adminProfile,
    login,
    logout,
    isAuthenticated: !!user && !!adminProfile,
    isLoading,
    isAdmin: !!adminProfile
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