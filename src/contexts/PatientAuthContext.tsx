import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentSession, PatientSessionData, clearPatientSession, PatientAuthData } from '../lib/patientAuth'

interface PatientAuthContextType {
  patient: PatientSessionData | null
  loading: boolean
  login: (patientData: PatientAuthData) => void
  logout: () => void
  isAuthenticated: boolean
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined)

export function PatientAuthProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = useState<PatientSessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = () => {
      const existingSession = getCurrentSession()
      if (existingSession) {
        // Convert PatientAuthData to PatientSessionData
        const sessionData: PatientSessionData = {
          id: existingSession.patientId,
          seniorCareId: existingSession.seniorCareId,
          name: existingSession.name,
          phone: existingSession.phoneNumber,
          email: '', // Basic data, will be enriched when needed
          dateOfBirth: '',
          isCouple: false,
          spouseName: '',
          emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
          }
        }
        setPatient(sessionData)
      }
      setLoading(false)
    }

    checkSession()
  }, [])

  const login = (patientData: PatientAuthData) => {
    // Convert PatientAuthData to PatientSessionData
    const sessionData: PatientSessionData = {
      id: patientData.patientId,
      seniorCareId: patientData.seniorCareId,
      name: patientData.name,
      phone: patientData.phoneNumber,
      email: '', // Will be filled from profile data
      dateOfBirth: '', // Will be filled from profile data
      isCouple: false, // Will be filled from profile data
      spouseName: '', // Will be filled from profile data
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    }
    setPatient(sessionData)
  }

  const logout = () => {
    clearPatientSession()
    setPatient(null)
  }

  const isAuthenticated = !!patient

  return (
    <PatientAuthContext.Provider
      value={{
        patient,
        loading,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </PatientAuthContext.Provider>
  )
}

export function usePatientAuth() {
  const context = useContext(PatientAuthContext)
  if (context === undefined) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider')
  }
  return context
}