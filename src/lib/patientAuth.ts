import { supabase } from './supabase'

export interface PatientAuthData {
  patientId: string
  seniorCareId: string
  name: string
  phoneNumber: string
  authToken: string
}

export interface PatientLoginCredentials {
  identifier: string // phone number or senior care id
  dateOfBirth: string
}

// Authenticate patient using phone/senior_care_id + DOB
export const authenticatePatient = async (credentials: PatientLoginCredentials): Promise<PatientAuthData> => {
  try {
    const { data, error } = await supabase.rpc('authenticate_patient', {
      identifier: credentials.identifier,
      dob: credentials.dateOfBirth
    })

    if (error) {
      throw new Error(error.message || 'Authentication failed')
    }

    if (!data || data.length === 0) {
      throw new Error('Invalid credentials')
    }

    const authData = data[0]
    
    // Set current patient context for RLS
    await supabase.rpc('set_current_patient', {
      phone: authData.phone_number,
      senior_care_id: authData.senior_care_id
    })

    return {
      patientId: authData.patient_id,
      seniorCareId: authData.senior_care_id,
      name: authData.name,
      phoneNumber: authData.phone_number,
      authToken: authData.auth_token
    }
  } catch (error) {
    console.error('Authentication error:', error)
    throw new Error('Invalid credentials. Please check your Senior Care ID/Phone Number and Date of Birth.')
  }
}

// Get patient profile
export const getPatientProfile = async (patientId: string) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        care_plans (
          plan_type,
          duration,
          price
        )
      `)
      .eq('id', patientId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Get family members if this patient is part of a family group
    let familyMembers = []
    if (data.family_group_id) {
      const { data: familyData, error: familyError } = await supabase
        .from('patients')
        .select(`
          id,
          senior_care_id,
          name,
          member_type,
          date_of_birth,
          sex,
          phone_number,
          email
        `)
        .eq('family_group_id', data.family_group_id)
        .neq('id', patientId) // Exclude current patient
        .order('member_type', { ascending: true }) // Primary first, then co-members

      if (!familyError && familyData) {
        familyMembers = familyData
      }
    }

    return {
      ...data,
      family_members: familyMembers
    }
  } catch (error) {
    console.error('Error fetching patient profile:', error)
    throw error
  }
}

// Update patient profile
export const updatePatientProfile = async (patientId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', patientId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error updating patient profile:', error)
    throw error
  }
}

// Patient session management
export const setPatientSession = (authData: PatientAuthData) => {
  localStorage.setItem('patient_session', JSON.stringify(authData))
}

export const getPatientSession = (): PatientAuthData | null => {
  try {
    const session = localStorage.getItem('patient_session')
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

// Alias for compatibility with PatientAuthContext
export const getCurrentSession = getPatientSession

// Enhanced session data for context
export interface PatientSessionData {
  id: string
  seniorCareId: string
  name: string
  phone: string
  email?: string
  dateOfBirth: string
  isCouple: boolean
  spouseName?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

export const clearPatientSession = () => {
  localStorage.removeItem('patient_session')
}

// Validate if current session is still valid
export const validatePatientSession = async (): Promise<boolean> => {
  const session = getPatientSession()
  if (!session) return false

  try {
    // Try to fetch patient data to validate session
    await getPatientProfile(session.patientId)
    return true
  } catch {
    clearPatientSession()
    return false
  }
}