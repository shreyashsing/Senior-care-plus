import type { User, Session } from '@supabase/supabase-js'
import type { Database } from './database'

export type AuthUser = User

export type AuthSession = Session

export type UserProfile = Database['public']['Tables']['profiles']['Row']

export type UserProfileInsert = Database['public']['Tables']['profiles']['Insert']

export type UserProfileUpdate = Database['public']['Tables']['profiles']['Update']

export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, userData?: Partial<UserProfileInsert>) => Promise<{ user: AuthUser | null; error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
  updateProfile: (updates: UserProfileUpdate) => Promise<{ error: Error | null }>
  refreshSession: () => Promise<{ session: AuthSession | null; error: Error | null }>
  verifyEmail: (token: string) => Promise<{ error: Error | null }>
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone?: string
  terms: boolean
}

export interface ResetPasswordFormData {
  email: string
}

export interface UpdatePasswordFormData {
  password: string
  confirmPassword: string
}

export interface ProfileFormData {
  fullName: string
  phone: string
  avatarUrl?: string
}

export type AuthError = {
  message: string
  status?: number
  code?: string
}

export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'

export interface AuthEvent {
  type: AuthEventType
  session: AuthSession | null
  user: AuthUser | null
}