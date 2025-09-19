import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { 
  AuthContextType, 
  AuthState, 
  AuthUser, 
  AuthSession, 
  UserProfile,
  UserProfileInsert,
  UserProfileUpdate 
} from '../types/auth'
import type { AuthChangeEvent } from '@supabase/supabase-js'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false
  })

  // Initialize auth state
  const initialize = useCallback(async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        setState((prev: AuthState) => ({ ...prev, loading: false, initialized: true }))
        return
      }

      if (session?.user) {
        // Fetch user profile
        const profile = await fetchUserProfile(session.user.id)
        setState({
          user: session.user,
          session,
          profile,
          loading: false,
          initialized: true
        })
      } else {
        setState((prev: AuthState) => ({ 
          ...prev, 
          user: null, 
          session: null, 
          profile: null, 
          loading: false, 
          initialized: true 
        }))
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      setState((prev: AuthState) => ({ ...prev, loading: false, initialized: true }))
    }
  }, [])

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching profile:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }, [])

  // Create or update user profile
  const upsertUserProfile = useCallback(async (
    user: AuthUser, 
    additionalData?: Partial<UserProfileInsert>
  ): Promise<UserProfile | null> => {
    try {
      const profileData: UserProfileInsert = {
        id: user.id,
        email: user.email || '',
        full_name: additionalData?.full_name || user.user_metadata?.full_name || null,
        phone: additionalData?.phone || user.user_metadata?.phone || null,
        avatar_url: additionalData?.avatar_url || user.user_metadata?.avatar_url || null,
        role: additionalData?.role || 'user',
        updated_at: new Date().toISOString(),
        ...additionalData
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single()

      if (error) {
        console.error('Error upserting profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error upserting profile:', error)
      return null
    }
  }, [])

  // Sign up new user
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    userData?: Partial<UserProfileInsert>
  ) => {
    try {
      setState((prev: AuthState) => ({ ...prev, loading: true }))

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            phone: userData?.phone || ''
          }
        }
      })

      if (error) {
        setState((prev: AuthState) => ({ ...prev, loading: false }))
        return { user: null, error }
      }

      if (data.user) {
        // Create user profile
        const profile = await upsertUserProfile(data.user, userData)
        setState({
          user: data.user,
          session: data.session,
          profile,
          loading: false,
          initialized: true
        })
      }

      return { user: data.user, error: null }
    } catch (error) {
      setState((prev: AuthState) => ({ ...prev, loading: false }))
      return { user: null, error: error as Error }
    }
  }, [upsertUserProfile])

  // Sign in existing user
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState((prev: AuthState) => ({ ...prev, loading: true }))

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setState((prev: AuthState) => ({ ...prev, loading: false }))
        return { user: null, error }
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id)
        setState({
          user: data.user,
          session: data.session,
          profile,
          loading: false,
          initialized: true
        })
      }

      return { user: data.user, error: null }
    } catch (error) {
      setState((prev: AuthState) => ({ ...prev, loading: false }))
      return { user: null, error: error as Error }
    }
  }, [fetchUserProfile])

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      setState((prev: AuthState) => ({ ...prev, loading: true }))

      const { error } = await supabase.auth.signOut()

      setState({
        user: null,
        session: null,
        profile: null,
        loading: false,
        initialized: true
      })

      return { error }
    } catch (error) {
      setState((prev: AuthState) => ({ ...prev, loading: false }))
      return { error: error as Error }
    }
  }, [])

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }, [])

  // Update password
  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }, [])

  // Update user profile
  const updateProfile = useCallback(async (updates: UserProfileUpdate) => {
    try {
      if (!state.user) {
        return { error: new Error('No user logged in') }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id)

      if (error) {
        return { error }
      }

      // Refetch profile
      const updatedProfile = await fetchUserProfile(state.user.id)
      setState((prev: AuthState) => ({ ...prev, profile: updatedProfile }))

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }, [state.user, fetchUserProfile])

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        return { session: null, error }
      }

      if (data.session) {
        setState((prev: AuthState) => ({
          ...prev,
          session: data.session,
          user: data.session.user
        }))
      }

      return { session: data.session, error: null }
    } catch (error) {
      return { session: null, error: error as Error }
    }
  }, [])

  // Verify email
  const verifyEmail = useCallback(async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }, [])

  // Set up auth state change listener
  useEffect(() => {
    initialize()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: AuthSession | null) => {
        console.log('Auth state changed:', event, session)

        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setState({
            user: session.user,
            session,
            profile,
            loading: false,
            initialized: true
          })
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            initialized: true
          })
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setState((prev: AuthState) => ({
            ...prev,
            session,
            user: session.user
          }))
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [initialize, fetchUserProfile])

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshSession,
    verifyEmail
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}