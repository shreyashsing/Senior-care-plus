import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { 
  LoginFormData, 
  SignUpFormData, 
  ResetPasswordFormData,
  UpdatePasswordFormData,
  ProfileFormData,
  AuthError 
} from '../types/auth'

// Hook for login functionality
export function useLogin() {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const login = useCallback(async (formData: LoginFormData) => {
    try {
      setLoading(true)
      setError(null)

      const { user, error: authError } = await signIn(formData.email, formData.password)

      if (authError) {
        setError({
          message: authError.message,
          code: (authError as any).code || 'SIGNIN_ERROR'
        })
        return { success: false, user: null }
      }

      return { success: true, user }
    } catch (err) {
      const error = err as Error
      setError({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      })
      return { success: false, user: null }
    } finally {
      setLoading(false)
    }
  }, [signIn])

  return {
    login,
    loading,
    error,
    clearError: () => setError(null)
  }
}

// Hook for signup functionality
export function useSignup() {
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const signup = useCallback(async (formData: SignUpFormData) => {
    try {
      setLoading(true)
      setError(null)

      if (formData.password !== formData.confirmPassword) {
        setError({
          message: 'Passwords do not match',
          code: 'PASSWORD_MISMATCH'
        })
        return { success: false, user: null }
      }

      const { user, error: authError } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          phone: formData.phone
        }
      )

      if (authError) {
        setError({
          message: authError.message,
          code: (authError as any).code || 'SIGNUP_ERROR'
        })
        return { success: false, user: null }
      }

      return { success: true, user }
    } catch (err) {
      const error = err as Error
      setError({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      })
      return { success: false, user: null }
    } finally {
      setLoading(false)
    }
  }, [signUp])

  return {
    signup,
    loading,
    error,
    clearError: () => setError(null)
  }
}

// Hook for logout functionality
export function useLogout() {
  const { signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { error: authError } = await signOut()

      if (authError) {
        setError({
          message: authError.message,
          code: 'SIGNOUT_ERROR'
        })
        return { success: false }
      }

      return { success: true }
    } catch (err) {
      const error = err as Error
      setError({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [signOut])

  return {
    logout,
    loading,
    error,
    clearError: () => setError(null)
  }
}

// Hook for password reset functionality
export function usePasswordReset() {
  const { resetPassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)

  const requestReset = useCallback(async (formData: ResetPasswordFormData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const { error: authError } = await resetPassword(formData.email)

      if (authError) {
        setError({
          message: authError.message,
          code: 'RESET_ERROR'
        })
        return { success: false }
      }

      setSuccess(true)
      return { success: true }
    } catch (err) {
      const error = err as Error
      setError({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [resetPassword])

  return {
    requestReset,
    loading,
    error,
    success,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  }
}

// Hook for password update functionality
export function usePasswordUpdate() {
  const { updatePassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)

  const updateUserPassword = useCallback(async (formData: UpdatePasswordFormData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      if (formData.password !== formData.confirmPassword) {
        setError({
          message: 'Passwords do not match',
          code: 'PASSWORD_MISMATCH'
        })
        return { success: false }
      }

      const { error: authError } = await updatePassword(formData.password)

      if (authError) {
        setError({
          message: authError.message,
          code: 'UPDATE_PASSWORD_ERROR'
        })
        return { success: false }
      }

      setSuccess(true)
      return { success: true }
    } catch (err) {
      const error = err as Error
      setError({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [updatePassword])

  return {
    updateUserPassword,
    loading,
    error,
    success,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  }
}

// Hook for profile management
export function useProfile() {
  const { updateProfile, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)

  const updateUserProfile = useCallback(async (formData: ProfileFormData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const { error: authError } = await updateProfile({
        full_name: formData.fullName,
        phone: formData.phone,
        avatar_url: formData.avatarUrl
      })

      if (authError) {
        setError({
          message: authError.message,
          code: 'UPDATE_PROFILE_ERROR'
        })
        return { success: false }
      }

      setSuccess(true)
      return { success: true }
    } catch (err) {
      const error = err as Error
      setError({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [updateProfile])

  return {
    updateUserProfile,
    profile,
    loading,
    error,
    success,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  }
}

// Hook for email verification
export function useEmailVerification() {
  const { verifyEmail } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)

  const verifyUserEmail = useCallback(async (token: string) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const { error: authError } = await verifyEmail(token)

      if (authError) {
        setError({
          message: authError.message,
          code: 'VERIFICATION_ERROR'
        })
        return { success: false }
      }

      setSuccess(true)
      return { success: true }
    } catch (err) {
      const error = err as Error
      setError({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [verifyEmail])

  return {
    verifyUserEmail,
    loading,
    error,
    success,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(false)
  }
}