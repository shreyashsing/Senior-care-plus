import { supabase } from './supabase'

// Ensure patient context is set for RLS
const ensurePatientContext = async (patientId: string) => {
  try {
    // Get patient details to set context
    const { data: patient, error } = await supabase
      .from('patients')
      .select('phone_number, senior_care_id')
      .eq('id', patientId)
      .single()

    if (error || !patient) {
      console.error('Patient lookup error:', error)
      throw new Error('Patient not found')
    }

    console.log('Setting patient context:', {
      patientId,
      phone: patient.phone_number,
      seniorCareId: patient.senior_care_id
    })

    // Set patient context for RLS
    const { data: contextResult, error: contextError } = await supabase.rpc('set_current_patient', {
      phone: patient.phone_number,
      senior_care_id: patient.senior_care_id
    })

    if (contextError) {
      console.error('Context setting error:', contextError)
      throw new Error(`Failed to set patient context: ${contextError.message}`)
    }

    console.log('Context set successfully:', contextResult)

    // Debug: Check if context was set properly
    const { data: debugResult, error: debugError } = await supabase.rpc('debug_current_session')
    console.log('Current session debug:', debugResult, debugError)

    return patient
  } catch (error) {
    console.error('Error setting patient context:', error)
    throw error
  }
}

// Generate unique SeniorCare ID
export const generateSeniorCareId = async (): Promise<string> => {
  let isUnique = false
  let seniorCareId = ''
  
  while (!isUnique) {
    // Generate ID format: SC + current year + 6 digit random number
    const year = new Date().getFullYear()
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    seniorCareId = `SC${year}${randomNum}`
    
    // Check if this ID already exists
    const { data, error } = await supabase
      .from('patients')
      .select('senior_care_id')
      .eq('senior_care_id', seniorCareId)
      .single()
    
    if (error && error.code === 'PGRST116') {
      // No matching rows found, ID is unique
      isUnique = true
    } else if (error) {
      // Other error occurred
      throw new Error('Error checking SeniorCare ID uniqueness')
    }
    // If data exists, ID is not unique, continue loop
  }
  
  return seniorCareId
}

// Upload file to Supabase Storage
export const uploadDocument = async (
  file: File,
  folder: string,
  patientId: string
): Promise<string> => {
  try {
    // Ensure patient context is set before storage operation
    await ensurePatientContext(patientId)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${patientId}_${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    console.log('Uploading file:', { filePath, fileSize: file.size, fileType: file.type })

    const { data, error } = await supabase.storage
      .from('patient-documents')
      .upload(filePath, file)

    if (error) {
      console.error('Storage upload error:', error)
      throw new Error(`Error uploading file: ${error.message}`)
    }

    console.log('File uploaded successfully:', data)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('patient-documents')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadDocument:', error)
    throw error
  }
}

// Create patient record in Supabase
export const createPatient = async (patientData: any): Promise<string> => {
  try {
    // Generate unique SeniorCare ID
    const seniorCareId = await generateSeniorCareId()
    
    // Upload documents if they exist
    const documents: any = {}
    
    if (patientData.photo) {
      documents.photo_url = await uploadDocument(patientData.photo, 'photos', seniorCareId)
    }
    if (patientData.dischargeCard) {
      documents.discharge_card_url = await uploadDocument(patientData.dischargeCard, 'discharge-cards', seniorCareId)
    }
    if (patientData.prescription) {
      documents.prescription_url = await uploadDocument(patientData.prescription, 'prescriptions', seniorCareId)
    }
    if (patientData.surgeryDocuments) {
      documents.surgery_documents_url = await uploadDocument(patientData.surgeryDocuments, 'surgery-docs', seniorCareId)
    }
    if (patientData.policyCard) {
      documents.policy_card_url = await uploadDocument(patientData.policyCard, 'policy-cards', seniorCareId)
    }

    // Prepare patient data for insertion
    const patientRecord = {
      senior_care_id: seniorCareId,
      name: patientData.name,
      date_of_birth: patientData.dateOfBirth,
      sex: patientData.sex,
      phone_number: patientData.selfCellNumber,
      emergency_contact: patientData.emergencyContactNo,
      emergency_name_relation: patientData.emergencyNameAndRelation,
      email: patientData.emailId || null,
      address: {
        house_no: patientData.houseNo,
        building_name: patientData.buildingName,
        landmark: patientData.landmark,
        city: patientData.city,
        district: patientData.district,
        pin_code: patientData.pinCode
      },
      medical_info: {
        diet_preference: patientData.dietPreference,
        tobacco_type: patientData.tobaccoType,
        tobacco_years: patientData.tobaccoYears,
        alcohol_frequency: patientData.alcoholFrequency,
        medicine_allergy: patientData.medicineAllergy,
        food_allergy: patientData.foodAllergy,
        other_allergy: patientData.otherAllergy,
        hospital_admission: patientData.hospitalAdmission,
        surgery: patientData.surgery,
        past_conditions: patientData.pastConditions,
        other_past_condition: patientData.otherPastCondition,
        current_condition: patientData.currentCondition,
        current_medication: patientData.currentMedication,
        hospital_name: patientData.hospitalName,
        doctor_name: patientData.doctorName,
        doctor_contact: patientData.doctorContact
      },
      insurance_info: {
        has_insurance: patientData.hasInsurance,
        insurance_company: patientData.insuranceCompany,
        tpa_name: patientData.tpaName,
        policy_number: patientData.policyNumber,
        amount_covered: patientData.amountCovered,
        room_entitled: patientData.roomEntitled
      },
      documents: documents,
      plan_id: patientData.planId
    }

    // Insert patient record
    const { data, error } = await supabase
      .from('patients')
      .insert([patientRecord])
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating patient: ${error.message}`)
    }

    return seniorCareId
  } catch (error) {
    console.error('Error in createPatient:', error)
    throw error
  }
}

// Create care plan
export const createCarePlan = async (planType: 'single' | 'couple', duration: string, price: number): Promise<string> => {
  const { data, error } = await supabase
    .from('care_plans')
    .insert([{
      plan_type: planType,
      duration: duration,
      price: price
    }])
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating care plan: ${error.message}`)
  }

  return data.id
}

// Medical Reports Functions
export const uploadMedicalReport = async (
  file: File,
  patientId: string,
  reportType: string,
  notes?: string
): Promise<any> => {
  try {
    // Ensure patient context is set
    await ensurePatientContext(patientId)
    
    // Upload file to storage
    const fileUrl = await uploadDocument(file, 'medical-reports', patientId)
    
    // Save record to database
    const { data, error } = await supabase
      .from('medical_reports')
      .insert([{
        patient_id: patientId,
        file_name: file.name,
        file_path: fileUrl,
        file_size: file.size,
        file_type: file.type,
        report_type: reportType,
        notes: notes || null
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Error saving medical report: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error uploading medical report:', error)
    throw error
  }
}

export const getMedicalReports = async (patientId: string): Promise<any[]> => {
  try {
    // Ensure patient context is set
    await ensurePatientContext(patientId)
    
    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('patient_id', patientId)
      .order('upload_date', { ascending: false })

    if (error) {
      throw new Error(`Error fetching medical reports: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching medical reports:', error)
    throw error
  }
}

export const deleteMedicalReport = async (reportId: string): Promise<void> => {
  try {
    // Get the report first to find the patient_id
    const { data: report, error: fetchError } = await supabase
      .from('medical_reports')
      .select('patient_id')
      .eq('id', reportId)
      .single()

    if (fetchError || !report) {
      throw new Error('Report not found')
    }

    // Ensure patient context is set
    await ensurePatientContext(report.patient_id)
    
    const { error } = await supabase
      .from('medical_reports')
      .delete()
      .eq('id', reportId)

    if (error) {
      throw new Error(`Error deleting medical report: ${error.message}`)
    }
  } catch (error) {
    console.error('Error deleting medical report:', error)
    throw error
  }
}

// Appointments Functions
export const bookAppointment = async (appointmentData: {
  patientId: string
  serviceType: string
  appointmentDate: string
  appointmentTime: string
  notes?: string
}): Promise<any> => {
  try {
    console.log('Booking appointment with data:', appointmentData)
    
    // Ensure patient context is set for RLS
    await ensurePatientContext(appointmentData.patientId)
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        patient_id: appointmentData.patientId,
        service_type: appointmentData.serviceType,
        appointment_date: appointmentData.appointmentDate,
        appointment_time: appointmentData.appointmentTime,
        notes: appointmentData.notes || null,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      throw new Error(`Error booking appointment: ${error.message}`)
    }

    console.log('Appointment booked successfully:', data)
    return data
  } catch (error) {
    console.error('Error booking appointment:', error)
    throw error
  }
}

export const getUpcomingAppointments = async (patientId: string): Promise<any[]> => {
  try {
    // Ensure patient context is set
    await ensurePatientContext(patientId)
    
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .gte('appointment_date', today)
      .in('status', ['pending', 'scheduled', 'confirmed'])
      .order('appointment_date', { ascending: true })

    if (error) {
      throw new Error(`Error fetching appointments: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching appointments:', error)
    throw error
  }
}

export const cancelAppointment = async (appointmentId: string): Promise<void> => {
  try {
    // Get the appointment first to find the patient_id
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('patient_id')
      .eq('id', appointmentId)
      .single()

    if (fetchError || !appointment) {
      throw new Error('Appointment not found')
    }

    // Ensure patient context is set
    await ensurePatientContext(appointment.patient_id)
    
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)

    if (error) {
      throw new Error(`Error cancelling appointment: ${error.message}`)
    }
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    throw error
  }
}