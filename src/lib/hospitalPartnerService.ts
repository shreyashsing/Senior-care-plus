import { supabase } from './supabase'

// Service options for partners
export const SERVICE_OPTIONS = [
  'OPD',
  'IPD', 
  '2nd consultation',
  'Home Service',
  'Online',
  'Offline',
  'Ambulance',
  'Air Ambulance',
  'Clinic',
  'Medicine Delivery',
  'ICU @ Home',
  'Diagnostics'
] as const

export const CATEGORY_OPTIONS = [
  'Hospital',
  'Eye', 
  'Dental',
  'Physiotherapy',
  'Yoga',
  'Meditation',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology'
] as const

// Service with discount interface
export interface ServiceWithDiscount {
  service: string
  discount: number
}

// Hospital Partner interface
export interface HospitalPartner {
  id: string
  name: string
  category: string
  services: ServiceWithDiscount[]
  free_services: boolean
  address: string
  city: string
  pincode: string
  pincodes_served: string[]
  contact_person_name: string
  contact_person_phone: string
  contact_person_email: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

// Create hospital partner input interface
export interface CreateHospitalPartner {
  name: string
  category: string
  services: ServiceWithDiscount[]
  free_services: boolean
  address: string
  city: string
  pincode: string
  pincodes_served: string[]
  contact_person_name: string
  contact_person_phone: string
  contact_person_email: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

// Update hospital partner input interface
export interface UpdateHospitalPartner extends Partial<CreateHospitalPartner> {
  status?: 'active' | 'inactive' | 'pending'
}

// Filters for hospital partners
export interface HospitalPartnerFilters {
  category?: string
  city?: string
  status?: string
  search?: string
  services?: string[]
}

// Hospital Partner Service Class
export class HospitalPartnerService {
  
  // Helper methods for data parsing
  private static parseServices(services: any): ServiceWithDiscount[] {
    if (!services) return []
    if (Array.isArray(services)) return services
    if (typeof services === 'string') {
      try {
        const parsed = JSON.parse(services)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.warn('Failed to parse services JSON:', services)
        return []
      }
    }
    return []
  }

  private static parsePincodes(pincodes: any): string[] {
    if (!pincodes) return []
    if (Array.isArray(pincodes)) return pincodes
    if (typeof pincodes === 'string') {
      try {
        const parsed = JSON.parse(pincodes)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.warn('Failed to parse pincodes JSON:', pincodes)
        return []
      }
    }
    return []
  }

  // Get simplified hospital partners for public display (only name, category, services)
  static async getPublicHospitalPartners(): Promise<{
    id: string;
    name: string;
    category: string;
    services: ServiceWithDiscount[];
  }[]> {
    try {
      console.log('HospitalPartnerService: Getting public hospital partners...')
      
      const { data, error } = await supabase
        .from('hospital_partners')
        .select('id, name, category, services')
        .eq('status', 'active')
        .order('name', { ascending: true })

      console.log('HospitalPartnerService: Query result - data:', data, 'error:', error)

      if (error) {
        console.error('Error fetching public hospital partners:', error)
        throw new Error(`Failed to fetch hospital partners: ${error.message}`)
      }

      // Parse services field if it's a string
      const parsedData = (data || []).map(partner => ({
        ...partner,
        services: this.parseServices(partner.services)
      }))

      console.log('HospitalPartnerService: Returning parsed public data:', parsedData)
      return parsedData
    } catch (error) {
      console.error('Error in getPublicHospitalPartners:', error)
      throw error
    }
  }

  // Get all hospital partners with optional filters
  static async getHospitalPartners(filters?: HospitalPartnerFilters): Promise<HospitalPartner[]> {
    try {
      console.log('HospitalPartnerService: Starting getHospitalPartners with filters:', filters)
      
      let query = supabase
        .from('hospital_partners')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters?.city) {
        query = query.eq('city', filters.city)
      }
      
      if (filters?.status) {
        console.log('Applying status filter:', filters.status)
        query = query.eq('status', filters.status)
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,contact_person_name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`)
      }

      console.log('HospitalPartnerService: Executing query...')
      const { data, error } = await query

      console.log('HospitalPartnerService: Query result - data:', data, 'error:', error)

      if (error) {
        console.error('Error fetching hospital partners:', error)
        throw new Error(`Failed to fetch hospital partners: ${error.message}`)
      }

      // Parse services field if it's a string
      const parsedData = (data || []).map(partner => ({
        ...partner,
        services: this.parseServices(partner.services),
        pincodes_served: this.parsePincodes(partner.pincodes_served)
      }))

      console.log('HospitalPartnerService: Returning parsed data:', parsedData)
      return parsedData
    } catch (error) {
      console.error('Error in getHospitalPartners:', error)
      throw error
    }
  }

  // Get hospital partner by ID
  static async getHospitalPartnerById(id: string): Promise<HospitalPartner | null> {
    try {
      const { data, error } = await supabase
        .from('hospital_partners')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Partner not found
        }
        console.error('Error fetching hospital partner:', error)
        throw new Error(`Failed to fetch hospital partner: ${error.message}`)
      }

      // Parse services field if it's a string
      const parsedData = {
        ...data,
        services: this.parseServices(data.services),
        pincodes_served: this.parsePincodes(data.pincodes_served)
      }

      return parsedData
    } catch (error) {
      console.error('Error in getHospitalPartnerById:', error)
      throw error
    }
  }

  // Create new hospital partner
  static async createHospitalPartner(partnerData: CreateHospitalPartner): Promise<HospitalPartner> {
    try {
      console.log('HospitalPartnerService: Creating partner with data:', partnerData)
      
      const insertData = {
        ...partnerData,
        services: JSON.stringify(partnerData.services),
        pincodes_served: partnerData.pincodes_served, // Send as array directly
        status: 'active'
      }
      
      console.log('HospitalPartnerService: Insert data:', insertData)
      
      const { data, error } = await supabase
        .from('hospital_partners')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error creating hospital partner:', error)
        throw new Error(`Failed to create hospital partner: ${error.message}`)
      }

      // Parse services field if it's a string
      const parsedData = {
        ...data,
        services: this.parseServices(data.services),
        pincodes_served: this.parsePincodes(data.pincodes_served)
      }

      return parsedData
    } catch (error) {
      console.error('Error in createHospitalPartner:', error)
      throw error
    }
  }

  // Update hospital partner
  static async updateHospitalPartner(id: string, updateData: UpdateHospitalPartner): Promise<HospitalPartner> {
    try {
      const dataToUpdate: any = { ...updateData }
      
      // Convert services and pincodes to proper format
      if (updateData.services) {
        dataToUpdate.services = JSON.stringify(updateData.services)
      }
      if (updateData.pincodes_served) {
        dataToUpdate.pincodes_served = updateData.pincodes_served // Send as array directly
      }

      const { data, error } = await supabase
        .from('hospital_partners')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating hospital partner:', error)
        throw new Error(`Failed to update hospital partner: ${error.message}`)
      }

      // Parse services field if it's a string
      const parsedData = {
        ...data,
        services: this.parseServices(data.services),
        pincodes_served: this.parsePincodes(data.pincodes_served)
      }

      return parsedData
    } catch (error) {
      console.error('Error in updateHospitalPartner:', error)
      throw error
    }
  }

  // Delete hospital partner
  static async deleteHospitalPartner(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('hospital_partners')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting hospital partner:', error)
        throw new Error(`Failed to delete hospital partner: ${error.message}`)
      }
    } catch (error) {
      console.error('Error in deleteHospitalPartner:', error)
      throw error
    }
  }

  // Get partners by category
  static async getPartnersByCategory(category: string): Promise<HospitalPartner[]> {
    return this.getHospitalPartners({ category, status: 'active' })
  }

  // Get partners by city
  static async getPartnersByCity(city: string): Promise<HospitalPartner[]> {
    return this.getHospitalPartners({ city, status: 'active' })
  }

  // Get partners statistics
  static async getPartnersStatistics(): Promise<{
    total: number
    active: number
    inactive: number
    pending: number
    byCategory: Record<string, number>
    byCity: Record<string, number>
  }> {
    try {
      const partners = await this.getHospitalPartners()
      
      const stats = {
        total: partners.length,
        active: partners.filter(p => p.status === 'active').length,
        inactive: partners.filter(p => p.status === 'inactive').length,
        pending: partners.filter(p => p.status === 'pending').length,
        byCategory: {} as Record<string, number>,
        byCity: {} as Record<string, number>
      }

      partners.forEach(partner => {
        stats.byCity[partner.city] = (stats.byCity[partner.city] || 0) + 1
        stats.byCategory[partner.category] = (stats.byCategory[partner.category] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('Error in getPartnersStatistics:', error)
      throw error
    }
  }

  // Toggle partner status (active/inactive)
  static async togglePartnerStatus(id: string): Promise<void> {
    try {
      // First get the current partner to check its status
      const { data: partner, error: fetchError } = await supabase
        .from('hospital_partners')
        .select('status')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching partner status:', fetchError)
        throw new Error(`Failed to fetch partner status: ${fetchError.message}`)
      }

      // Toggle status between active and inactive
      const newStatus = partner.status === 'active' ? 'inactive' : 'active'

      const { error } = await supabase
        .from('hospital_partners')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        console.error('Error toggling partner status:', error)
        throw new Error(`Failed to toggle partner status: ${error.message}`)
      }
    } catch (error) {
      console.error('Error in togglePartnerStatus:', error)
      throw error
    }
  }

  // Get unique cities from all partners
  static async getUniqueCities(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('hospital_partners')
        .select('city')

      if (error) {
        console.error('Error fetching cities:', error)
        throw new Error(`Failed to fetch cities: ${error.message}`)
      }

      // Extract unique cities and sort them
      const uniqueCities = [...new Set(data.map(partner => partner.city))]
        .filter(city => city && city.trim()) // Remove empty/null cities
        .sort()

      return uniqueCities
    } catch (error) {
      console.error('Error in getUniqueCities:', error)
      throw error
    }
  }
}

export default HospitalPartnerService