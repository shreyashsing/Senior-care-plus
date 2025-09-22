import { supabase } from './supabase'

// Medical Report Types
export interface MedicalReport {
  id: string
  patient_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  report_type: string
  notes?: string
  upload_date: string
  created_at: string
}

// Admin Authentication Types
export interface AdminUser {
  id: string
  username: string
  email: string
  name: string
  role: 'admin' | 'super_admin' | 'manager'
  permissions: string[]
  last_login?: string
}

export interface AdminLoginData {
  username: string
  password: string
}

// Dashboard Statistics Types
export interface DashboardStats {
  totalPatients: number
  paidPatients: number
  renewalsDue: number
  totalAppointments: number
  totalServices: number
}

// Patient Types
export interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  phone_number?: string
  date_of_birth?: string
  sex?: string
  address?: any
  emergency_contact?: any
  emergency_name_relation?: string
  medical_conditions?: string[]
  medical_info?: any
  insurance_info?: any
  senior_care_id: string
  registration_date: string
  plan_id?: string
  care_plan_status?: 'active' | 'inactive' | 'pending' | 'expired'
  last_visit?: string
  next_appointment?: string
  created_at: string
  updated_at: string
  // Joined data
  care_plan_name?: string
  care_plan_tier?: string
  total_services?: number
  total_appointments?: number
  medical_reports?: MedicalReport[]
}

export interface PatientFilters {
  search?: string
  care_plan_status?: string
  age_range?: string
  has_conditions?: boolean
  registration_date?: string
}

export interface UpdatePatient {
  name?: string
  email?: string
  phone_number?: string
  date_of_birth?: string
  sex?: string
  address?: any
  emergency_contact?: any
  emergency_name_relation?: string
  medical_conditions?: string[]
  medical_info?: any
  insurance_info?: any
  plan_id?: string
}

export interface PartnerService {
  partner_name: string
  services_count: number
}

// Service Request Types
export interface ServiceRequest {
  id: string
  patient_id: string
  partner_id?: string
  service_type: string
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  description?: string
  scheduled_date?: string
  completed_date?: string
  notes?: string
  cost?: number
  created_at: string
  updated_at: string
  // Joined data
  patient_name?: string
  patient_senior_care_id?: string
  partner_name?: string
}

export interface CreateServiceRequest {
  patient_id: string
  partner_id?: string
  service_type: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  description?: string
  scheduled_date?: string
}

export interface UpdateServiceRequest {
  service_type?: string
  status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  partner_id?: string
  description?: string
  scheduled_date?: string
  completed_date?: string
  notes?: string
  cost?: number
}

// Appointment Types
export interface Appointment {
  id: string
  patient_id: string
  partner_id?: string
  service_type: string
  doctor_name?: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  patient_name?: string
  patient_senior_care_id?: string
  partner_name?: string
}

export interface CreateAppointment {
  patient_id: string
  partner_id?: string
  service_type: string
  doctor_name?: string
  appointment_date: string
  appointment_time: string
  notes?: string
}

export interface UpdateAppointment {
  service_type?: string
  doctor_name?: string
  appointment_date?: string
  appointment_time?: string
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
}

// Partner Types
export interface Partner {
  id: string
  name: string
  type: string
  location: string
  contact_phone?: string
  contact_email?: string
  services: string[]
  status: 'active' | 'inactive' | 'pending'
  joined_date: string
  address?: any
  created_at: string
  updated_at: string
}

export interface CreatePartner {
  name: string
  type: string
  location: string
  contact_phone?: string
  contact_email?: string
  services?: string[]
  address?: any
}

export interface UpdatePartner {
  name?: string
  type?: string
  location?: string
  contact_phone?: string
  contact_email?: string
  services?: string[]
  status?: 'active' | 'inactive' | 'pending'
  address?: any
}

// Filter Types
export interface ServiceRequestFilters {
  status?: string
  dateRange?: string
  partnerId?: string
  priority?: string
  startDate?: string
  endDate?: string
}

export interface AppointmentFilters {
  partnerId?: string
  dateRange?: string
  status?: string
  startDate?: string
  endDate?: string
}

// Admin Authentication Functions
export async function authenticateAdmin(loginData: AdminLoginData): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase.rpc('authenticate_admin', {
      username_input: loginData.username,
      password_input: loginData.password
    })

    if (error) {
      console.error('Admin authentication error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Admin authentication error:', error)
    return null
  }
}

// Dashboard Statistics Functions
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    console.log('🔍 Calling get_admin_dashboard_stats function...')
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats')

    console.log('📊 Dashboard stats response:', { data, error })

    if (error) {
      console.error('❌ Error fetching dashboard stats:', error)
      return null
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('⚠️ No data returned from dashboard stats function')
      return null
    }

    // The function returns an array with one object, so get the first item
    const statsData = data[0]
    
    // Ensure all properties exist and are numbers
    const stats = {
      totalPatients: statsData.totalPatients || 0,
      paidPatients: statsData.paidPatients || 0,
      renewalsDue: statsData.renewalsDue || 0,
      totalAppointments: statsData.totalAppointments || 0,
      totalServices: statsData.totalServices || 0
    }

    console.log('✅ Processed dashboard stats:', stats)
    return stats
  } catch (error) {
    console.error('💥 Exception in getDashboardStats:', error)
    return null
  }
}

export async function getServicesPerPartner(): Promise<PartnerService[]> {
  try {
    const { data, error } = await supabase.rpc('get_services_per_partner')

    if (error) {
      console.error('Error fetching services per partner:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching services per partner:', error)
    return []
  }
}

// Service Request Functions
export async function getServiceRequests(filters: ServiceRequestFilters = {}): Promise<ServiceRequest[]> {
  try {
    let query = supabase
      .from('service_requests')
      .select(`
        *,
        patients!service_requests_patient_id_fkey(name, senior_care_id),
        partners!service_requests_partner_id_fkey(name)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters.partnerId && filters.partnerId !== 'all') {
      query = query.eq('partner_id', filters.partnerId)
    }

    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority)
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching service requests:', error)
      return []
    }

    // Transform data to include joined fields
    return (data || []).map((request: any) => ({
      ...request,
      patient_name: request.patients?.name,
      patient_senior_care_id: request.patients?.senior_care_id,
      partner_name: request.partners?.name
    }))
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return []
  }
}

export async function createServiceRequest(requestData: CreateServiceRequest): Promise<ServiceRequest | null> {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .insert([requestData])
      .select()
      .single()

    if (error) {
      console.error('Error creating service request:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating service request:', error)
    return null
  }
}

export async function updateServiceRequest(id: string, updates: UpdateServiceRequest): Promise<ServiceRequest | null> {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating service request:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating service request:', error)
    return null
  }
}

// Appointment Functions
export async function getAppointments(filters: AppointmentFilters = {}): Promise<Appointment[]> {
  try {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        patients!appointments_patient_id_fkey(name, senior_care_id),
        partners!appointments_partner_id_fkey(name)
      `)
      .order('appointment_date', { ascending: false })

    // Apply filters
    if (filters.partnerId && filters.partnerId !== 'all') {
      query = query.eq('partner_id', filters.partnerId)
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters.startDate) {
      query = query.gte('appointment_date', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('appointment_date', filters.endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching appointments:', error)
      return []
    }

    // Transform data to include joined fields
    return (data || []).map((appointment: any) => ({
      ...appointment,
      patient_name: appointment.patients?.name,
      patient_senior_care_id: appointment.patients?.senior_care_id,
      partner_name: appointment.partners?.name
    }))
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
}

export async function createAppointment(appointmentData: CreateAppointment): Promise<Appointment | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating appointment:', error)
    return null
  }
}

export async function updateAppointment(id: string, updates: UpdateAppointment): Promise<Appointment | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating appointment:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating appointment:', error)
    return null
  }
}

// Partner Functions
export async function getPartners(): Promise<Partner[]> {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching partners:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

export async function createPartner(partnerData: CreatePartner): Promise<Partner | null> {
  try {
    const { data, error } = await supabase
      .from('partners')
      .insert([partnerData])
      .select()
      .single()

    if (error) {
      console.error('Error creating partner:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating partner:', error)
    return null
  }
}

export async function updatePartner(id: string, updates: UpdatePartner): Promise<Partner | null> {
  try {
    const { data, error } = await supabase
      .from('partners')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating partner:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating partner:', error)
    return null
  }
}

// Utility function to get date range filters
export function getDateRangeFilter(range: string): { startDate?: string; endDate?: string } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (range) {
    case 'today':
      return {
        startDate: today.toISOString(),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      }
    case 'week':
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      return {
        startDate: weekAgo.toISOString(),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      }
    case 'month':
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      return {
        startDate: monthAgo.toISOString(),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      }
    default:
      return {}
  }
}

// Patient Management Functions
export async function getPatients(filters: PatientFilters = {}): Promise<Patient[]> {
  try {
    let query = supabase
      .from('patients')
      .select(`
        *,
        care_plans!patients_plan_id_fkey(name, tier, status)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,senior_care_id.ilike.%${filters.search}%`)
    }

    if (filters.care_plan_status) {
      query = query.eq('care_plans.status', filters.care_plan_status)
    }

    if (filters.has_conditions) {
      query = query.not('medical_conditions', 'is', null)
    }

    if (filters.registration_date) {
      const dateFilter = getDateRangeFilter(filters.registration_date)
      if (dateFilter.startDate) {
        query = query.gte('registration_date', dateFilter.startDate)
      }
      if (dateFilter.endDate) {
        query = query.lte('registration_date', dateFilter.endDate)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching patients:', error)
      return []
    }

    console.log('Raw patient data from database:', data?.[0]) // Debug log to see actual data structure

    // Transform data and add computed fields (safely without appointment queries)
    const patients = (data || []).map(patient => {
      console.log('Patient address data:', patient.address) // Debug log for address
      console.log('Patient medical_info data:', patient.medical_info) // Debug log for medical_info
      console.log('Patient insurance_info data:', patient.insurance_info) // Debug log for insurance_info
      
      return {
        ...patient,
        phone: patient.phone_number, // Map phone_number to phone for compatibility
        care_plan_name: patient.care_plans?.name,
        care_plan_tier: patient.care_plans?.tier,
        care_plan_status: patient.care_plans?.status,
        total_services: 0, // Will be calculated if service_requests exists
        total_appointments: 0, // Set to 0 to avoid appointment queries
        last_visit: undefined,
        next_appointment: undefined
      }
    })

    // Safely get service counts only (avoid appointment table queries)
    for (const patient of patients) {
      try {
        // Only try to get service count, skip appointments to avoid 406 errors
        const { count } = await supabase
          .from('service_requests')
          .select('*', { count: 'exact', head: true })
          .eq('patient_id', patient.id)
        
        patient.total_services = count || 0
      } catch (error) {
        // If service_requests table doesn't exist, just leave as 0
        patient.total_services = 0
      }
    }

    return patients
  } catch (error) {
    console.error('Error fetching patients:', error)
    return []
  }
}

export async function getPatient(id: string): Promise<Patient | null> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        care_plans!patients_plan_id_fkey(name, tier, status, services, cost_per_month)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching patient:', error)
      return null
    }

    if (!data) return null

    // Debug logs for single patient data
    console.log('Single patient raw data:', data)
    console.log('Single patient address:', data.address)
    console.log('Single patient medical_info:', data.medical_info)
    console.log('Single patient insurance_info:', data.insurance_info)

    // Get service count safely (avoid appointment queries that cause 406)
    let serviceCount = 0
    try {
      const { count } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', data.id)
      serviceCount = count || 0
    } catch (error) {
      serviceCount = 0
    }

    return {
      ...data,
      phone: data.phone_number, // Map phone_number to phone for compatibility
      care_plan_name: data.care_plans?.name,
      care_plan_tier: data.care_plans?.tier,
      care_plan_status: data.care_plans?.status,
      total_services: serviceCount,
      total_appointments: 0, // Set to 0 to avoid appointment queries
      last_visit: undefined,
      next_appointment: undefined
    }
  } catch (error) {
    console.error('Error fetching patient:', error)
    return null
  }
}

export async function updatePatient(id: string, updates: UpdatePatient): Promise<Patient | null> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        care_plans!patients_plan_id_fkey(name, tier, status)
      `)
      .single()

    if (error) {
      console.error('Error updating patient:', error)
      return null
    }

    return {
      ...data,
      phone: data.phone_number, // Map phone_number to phone for compatibility
      care_plan_name: data.care_plans?.name,
      care_plan_tier: data.care_plans?.tier,
      care_plan_status: data.care_plans?.status,
    }
  } catch (error) {
    console.error('Error updating patient:', error)
    return null
  }
}

// Removed problematic helper functions that were causing 406 errors
// These functions tried to access appointments table which may not exist
// or have RLS policy issues. Simplified patient management for now.

// Helper functions for patient stats - Restored with proper error handling
async function getPatientServiceCount(patientId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('service_requests')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientId)

    if (error) {
      console.error('Error fetching patient service count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error fetching patient service count:', error)
    return 0
  }
}

async function getPatientAppointmentCount(patientId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientId)

    if (error) {
      // If appointments table doesn't exist, return 0
      return 0
    }

    return count || 0
  } catch (error) {
    // If appointments table doesn't exist, return 0
    return 0
  }
}

async function getPatientLastVisit(patientId: string): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_date')
      .eq('patient_id', patientId)
      .eq('status', 'completed')
      .order('appointment_date', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return undefined
    }

    return data.appointment_date
  } catch (error) {
    return undefined
  }
}

async function getPatientNextAppointment(patientId: string): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_date')
      .eq('patient_id', patientId)
      .in('status', ['pending', 'confirmed'])
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .order('appointment_date', { ascending: true })
      .limit(1)
      .single()

    if (error || !data) {
      return undefined
    }

    return data.appointment_date
  } catch (error) {
    return undefined
  }
}

// Medical Reports Functions
export async function getPatientMedicalReports(patientId: string): Promise<MedicalReport[]> {
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('patient_id', patientId)
      .order('upload_date', { ascending: false })

    if (error) {
      console.error('Error fetching patient medical reports:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching patient medical reports:', error)
    return []
  }
}

export async function downloadMedicalReport(filePath: string): Promise<string> {
  try {
    // If the filePath is already a full URL (which it is from uploadDocument), 
    // we can return it directly since files are stored with public access
    if (filePath.startsWith('https://') || filePath.startsWith('http://')) {
      console.log('Using direct public URL for download:', filePath)
      return filePath
    }
    
    // If it's a relative path, create the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('patient-documents')
      .getPublicUrl(filePath)

    console.log('Created public URL for download:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Error creating download URL:', error)
    throw error
  }
}