import { supabase } from './supabase'

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

// Create a single patient record with family relationship support
export const createPatient = async (patientData: any): Promise<string> => {
  try {
    console.log('🔍 CreatePatient received data:', JSON.stringify(patientData, null, 2));
    
    // Validate required fields
    if (!patientData.name || patientData.name.trim() === '') {
      throw new Error('Patient name is required and cannot be empty');
    }
    
    // Generate unique SeniorCare ID
    const seniorCareId = await generateSeniorCareId()
    
    // Upload documents if they exist
    const documents: any = {}
    
    console.log('🔍 Checking for file uploads...');
    
    // Upload files to storage before creating patient record
    if (patientData.photo) {
      console.log('📸 Uploading photo...');
      try {
        documents.photo_url = await uploadDocument(patientData.photo, 'photos', seniorCareId);
        console.log('✅ Photo uploaded:', documents.photo_url);
      } catch (error) {
        console.error('❌ Photo upload failed:', error);
      }
    }
    
    if (patientData.dischargeCard) {
      console.log('📄 Uploading discharge card...');
      try {
        documents.discharge_card_url = await uploadDocument(patientData.dischargeCard, 'discharge-cards', seniorCareId);
        console.log('✅ Discharge card uploaded:', documents.discharge_card_url);
      } catch (error) {
        console.error('❌ Discharge card upload failed:', error);
      }
    }
    
    if (patientData.prescription) {
      console.log('💊 Uploading prescription...');
      try {
        documents.prescription_url = await uploadDocument(patientData.prescription, 'prescriptions', seniorCareId);
        console.log('✅ Prescription uploaded:', documents.prescription_url);
      } catch (error) {
        console.error('❌ Prescription upload failed:', error);
      }
    }
    
    if (patientData.surgeryDocuments) {
      console.log('🏥 Uploading surgery documents...');
      try {
        documents.surgery_documents_url = await uploadDocument(patientData.surgeryDocuments, 'surgery-docs', seniorCareId);
        console.log('✅ Surgery documents uploaded:', documents.surgery_documents_url);
      } catch (error) {
        console.error('❌ Surgery documents upload failed:', error);
      }
    }
    
    if (patientData.policyCard) {
      console.log('🏛️ Uploading policy card...');
      try {
        documents.policy_card_url = await uploadDocument(patientData.policyCard, 'policy-cards', seniorCareId);
        console.log('✅ Policy card uploaded:', documents.policy_card_url);
      } catch (error) {
        console.error('❌ Policy card upload failed:', error);
      }
    }
    
    console.log('📁 All documents processed. Document URLs:', documents);
    
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
      plan_id: patientData.planId,
      // New multi-member fields
      member_type: patientData.memberType || 'primary',
      primary_member_id: patientData.primaryMemberId || null,
      family_group_id: patientData.familyGroupId || null
    }

    console.log('🔍 Inserting patient record:', JSON.stringify(patientRecord, null, 2));

    // Insert patient record
    const { data, error } = await supabase
      .from('patients')
      .insert(patientRecord)
      .select()

    if (error) {
      console.error('❌ Database insertion error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('Failed to create patient record')
    }

    const newPatient = data[0]
    console.log('✅ Patient created successfully:', newPatient.id, newPatient.senior_care_id)

    return newPatient.id
  } catch (error) {
    console.error('❌ Error creating patient:', error)
    throw error
  }
}

// Create multiple patients as a family group (primary + co-members)
export const createFamilyMembers = async (membersData: any[]): Promise<string[]> => {
  try {
    console.log('🔍 Creating family group with', membersData.length, 'members');
    
    if (membersData.length === 0) {
      throw new Error('No member data provided');
    }

    // Generate a shared family group ID
    const familyGroupId = crypto.randomUUID();
    console.log('🔍 Generated family group ID:', familyGroupId);

    const patientIds: string[] = [];
    let primaryMemberId: string | null = null;

    // Create each member
    for (let i = 0; i < membersData.length; i++) {
      const memberData = membersData[i];
      const memberType = i === 0 ? 'primary' : 'co-member';
      
      console.log(`🔍 Creating ${memberType} member:`, memberData.name);

      // Prepare member data with family relationships
      const memberWithFamily = {
        ...memberData,
        memberType,
        familyGroupId,
        primaryMemberId: memberType === 'co-member' ? primaryMemberId : null,
        planId: memberData.planId // Shared plan ID for all family members
      };

      // Create the patient
      const patientId = await createPatient(memberWithFamily);
      patientIds.push(patientId);

      // Store primary member ID for co-members
      if (memberType === 'primary') {
        primaryMemberId = patientId;
      }

      console.log(`✅ Created ${memberType} with ID:`, patientId);
    }

    // Now update co-members with the correct primary member ID
    if (primaryMemberId && patientIds.length > 1) {
      console.log('🔍 Linking co-members to primary member:', primaryMemberId);
      
      // Update all co-members to link them to the primary member
      for (let i = 1; i < patientIds.length; i++) {
        const { error: updateError } = await supabase
          .from('patients')
          .update({
            primary_member_id: primaryMemberId,
            family_group_id: familyGroupId
          })
          .eq('id', patientIds[i]);

        if (updateError) {
          console.error('❌ Error linking co-member:', updateError);
          throw new Error(`Failed to link co-member: ${updateError.message}`);
        }
      }

      // Also update the primary member's family_group_id
      const { error: primaryUpdateError } = await supabase
        .from('patients')
        .update({
          family_group_id: familyGroupId
        })
        .eq('id', primaryMemberId);

      if (primaryUpdateError) {
        console.error('❌ Error updating primary member:', primaryUpdateError);
        throw new Error(`Failed to update primary member: ${primaryUpdateError.message}`);
      }

      console.log('✅ Successfully linked all family members');
    }

    console.log('✅ Family group created successfully. Patient IDs:', patientIds);
    return patientIds;

  } catch (error) {
    console.error('❌ Error creating family members:', error);
    throw error;
  }
}

// Create care plan for the family
export const createCarePlan = async (
  planType: string,
  duration: string,
  price: number,
  patientIds: string[]
): Promise<string> => {
  try {
    console.log('🔍 Creating care plan:', { planType, duration, price, patientCount: patientIds.length });

    // Map plan types to proper names and tiers
    const planMapping = {
      'basic': { name: 'Basic Care Plan', tier: 'Basic' },
      'advance': { name: 'Advance Care Plan', tier: 'Advance' },
      'premium': { name: 'Premium Care Plan', tier: 'Premium' }
    };

    const planInfo = planMapping[planType as keyof typeof planMapping] || planMapping.basic;

    // Calculate proper end date by adding months
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(duration));
    
    const carePlanData = {
      plan_type: 'multi-member', // Changed from 'family' to match database constraint
      name: planInfo.name,
      tier: planInfo.tier,
      duration: duration,
      price: price,
      cost_per_month: price,
      status: 'active',
      services: ['health_monitoring', 'emergency_assistance', 'family_care', 'multi_member_support'],
      end_date: endDate.toISOString().split('T')[0]
    };

    console.log('🔍 Care plan data:', carePlanData);

    // Create care plan
    const { data: planData, error: planError } = await supabase
      .from('care_plans')
      .insert(carePlanData)
      .select()
      .single();

    if (planError) {
      console.error('❌ Care plan creation error:', planError);
      throw new Error(`Failed to create care plan: ${planError.message}`);
    }

    const planId = planData.id;
    console.log('✅ Care plan created with ID:', planId);

    // Update all patients with the care plan ID
    const { error: updateError } = await supabase
      .from('patients')
      .update({ plan_id: planId })
      .in('id', patientIds);

    if (updateError) {
      console.error('❌ Error linking patients to care plan:', updateError);
      throw new Error(`Failed to link patients to care plan: ${updateError.message}`);
    }

    console.log('✅ All patients linked to care plan successfully');
    return planId;

  } catch (error) {
    console.error('❌ Error creating care plan:', error);
    throw error;
  }
}

// Patient authentication with family context
export const authenticatePatient = async (
  identifier: string, // phone or senior care id
  dateOfBirth: string
): Promise<{
  id: string;
  seniorCareId: string;
  name: string;
  phoneNumber: string;
  memberType: string;
  primaryMemberName?: string;
  familyMembersCount: number;
}> => {
  try {
    console.log('🔍 Authenticating patient:', { identifier, dateOfBirth });

    // Use the enhanced authentication function that includes family context
    const { data, error } = await supabase.rpc('authenticate_patient_with_family', {
      identifier,
      dob: dateOfBirth
    });

    if (error) {
      console.error('❌ Authentication error:', error);
      throw new Error('Invalid credentials');
    }

    if (!data || data.length === 0) {
      throw new Error('Invalid credentials');
    }

    const authResult = data[0];
    console.log('✅ Authentication successful:', authResult);

    return {
      id: authResult.patient_id,
      seniorCareId: authResult.senior_care_id,
      name: authResult.name,
      phoneNumber: authResult.phone_number,
      memberType: authResult.member_type,
      primaryMemberName: authResult.primary_member_name,
      familyMembersCount: authResult.family_members_count
    };

  } catch (error) {
    console.error('❌ Authentication error:', error);
    throw error;
  }
}

// Get family members for a patient
export const getFamilyMembers = async (patientId: string) => {
  try {
    console.log('🔍 Getting family members for patient:', patientId);

    const { data, error } = await supabase.rpc('get_family_members', {
      patient_id: patientId
    });

    if (error) {
      console.error('❌ Error getting family members:', error);
      throw new Error(`Failed to get family members: ${error.message}`);
    }

    console.log('✅ Family members retrieved:', data);
    return data || [];

  } catch (error) {
    console.error('❌ Error in getFamilyMembers:', error);
    throw error;
  }
}

// Get patient dashboard info with family context
export const getPatientDashboardInfo = async (patientId: string) => {
  try {
    console.log('🔍 Getting dashboard info for patient:', patientId);

    const { data, error } = await supabase.rpc('get_patient_dashboard_info', {
      patient_id: patientId
    });

    if (error) {
      console.error('❌ Error getting dashboard info:', error);
      throw new Error(`Failed to get dashboard info: ${error.message}`);
    }

    console.log('✅ Dashboard info retrieved:', data);
    return data?.[0] || null;

  } catch (error) {
    console.error('❌ Error in getPatientDashboardInfo:', error);
    throw error;
  }
}