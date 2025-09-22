import { supabase } from '@/lib/supabase'

// Sample partner data to add
const samplePartners = [
  {
    name: 'Apollo Hospital',
    category: 'Hospital',
    services: [
      { service: 'OPD', discount: 10 },
      { service: 'IPD', discount: 15 },
      { service: 'Diagnostics', discount: 20 }
    ],
    free_services: false,
    address: '123 Medical Street, Health City',
    city: 'Mumbai',
    pincode: '400001',
    pincodes_served: ['400001', '400002', '400003'],
    contact_person_name: 'Dr. Sharma',
    contact_person_phone: '9876543210',
    contact_person_email: 'sharma@apollo.com',
    status: 'active'
  },
  {
    name: 'Fortis Healthcare',
    category: 'Hospital',
    services: [
      { service: 'OPD', discount: 12 },
      { service: 'Cardiology', discount: 18 },
      { service: 'Home Service', discount: 25 }
    ],
    free_services: true,
    address: '456 Care Avenue, Medical District',
    city: 'Delhi',
    pincode: '110001',
    pincodes_served: ['110001', '110002'],
    contact_person_name: 'Dr. Patel',
    contact_person_phone: '9876543211',
    contact_person_email: 'patel@fortis.com',
    status: 'active'
  },
  {
    name: 'Max Hospital',
    category: 'Hospital',
    services: [
      { service: 'OPD', discount: 8 },
      { service: 'Emergency', discount: 5 },
      { service: 'ICU @ Home', discount: 30 }
    ],
    free_services: false,
    address: '789 Health Boulevard',
    city: 'Bangalore',
    pincode: '560001',
    pincodes_served: ['560001', '560002', '560003'],
    contact_person_name: 'Dr. Kumar',
    contact_person_phone: '9876543212',
    contact_person_email: 'kumar@max.com',
    status: 'active'
  }
]

export async function addSamplePartners() {
  try {
    console.log('🏥 Adding sample partners to database...')
    
    const { data, error } = await supabase
      .from('hospital_partners')
      .insert(samplePartners)
      .select()

    if (error) {
      console.error('❌ Error adding sample partners:', error)
      throw error
    }

    console.log('✅ Sample partners added successfully:', data)
    return data
  } catch (error) {
    console.error('❌ Failed to add sample partners:', error)
    throw error
  }
}