import { supabase } from './supabase'

// Contact Types
export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  services?: string[]
  city?: string
  preferred_contact_time?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed' | 'in_progress' | 'resolved'
  created_at: string
  updated_at?: string
}

// Contact Filter Types
export interface ContactFilters {
  status?: Contact['status']
  subject?: string
  search?: string
  limit?: number
  offset?: number
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface CreateContact {
  name: string
  email: string
  phone?: string
  message: string
  services?: string[]
  city?: string
  preferred_contact_time?: string
}

export class ContactService {
  
  // Create new contact via API endpoint (secure)
  static async createContact(contactData: CreateContact): Promise<Contact> {
    try {
      console.log('Creating contact with data:', contactData)
      
      // Use API endpoint for secure contact submission
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit contact form');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to submit contact form');
      }

      console.log('✅ Contact submitted successfully via API:', result.contactId)
      
      // Return a mock contact object since we get the ID from API
      return {
        id: result.contactId,
        ...contactData,
        status: 'new',
        created_at: new Date().toISOString()
      } as Contact;

    } catch (error) {
      console.error('❌ Error creating contact:', error)
      throw error
    }
  }

  // Get all contacts with filters (requires authentication)
  static async getContacts(filters?: ContactFilters): Promise<Contact[]> {
    try {
      console.log('Fetching contacts with filters:', filters)
      
      let query = supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        if (filters.subject) {
          query = query.eq('subject', filters.subject)
        }
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,message.ilike.%${filters.search}%`)
        }
        if (filters.limit) {
          query = query.limit(filters.limit)
        }
        if (filters.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
        }
      }

      // Default limit if no filters provided
      if (!filters?.limit) {
        query = query.limit(50)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching contacts:', error)
        throw error
      }

      console.log(`Found ${data?.length || 0} contacts`)
      return data || []

    } catch (error) {
      console.error('Error in getContacts:', error)
      throw error
    }
  }

  // Get contact by ID
  static async getContactById(id: string): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Contact not found
        }
        throw error
      }

      return data

    } catch (error) {
      console.error('Error in getContactById:', error)
      throw error
    }
  }

  // Update contact status
  static async updateContactStatus(id: string, status: Contact['status']): Promise<Contact> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data

    } catch (error) {
      console.error('Error updating contact status:', error)
      throw error
    }
  }

  // Delete contact
  static async deleteContact(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

    } catch (error) {
      console.error('Error deleting contact:', error)
      throw error
    }
  }

  // Test Supabase connection
  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Supabase connection...')
      
      // Check auth status
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log('Auth status:', { user: user?.id || 'anonymous', error: authError })
      
      // Try a simple query
      const { data, error } = await supabase
        .from('contacts')
        .select('count')
        .limit(1)

      if (error) {
        console.error('Connection test failed:', error)
        return false
      }

      console.log('Connection test successful:', data)
      return true
      
    } catch (error) {
      console.error('Error testing connection:', error)
      return false
    }
  }

  // Get contact statistics (alias for getContactStats)
  static async getContactStatistics(): Promise<{
    total: number
    byStatus: Record<Contact['status'], number>
    recent: number
  }> {
    return this.getContactStats()
  }

  // Get contact statistics
  static async getContactStats(): Promise<{
    total: number
    byStatus: Record<Contact['status'], number>
    recent: number
  }> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('status, created_at')

      if (error) {
        throw error
      }

      const stats = {
        total: data?.length || 0,
        byStatus: {
          new: 0,
          contacted: 0,
          qualified: 0,
          converted: 0,
          closed: 0,
          in_progress: 0,
          resolved: 0
        } as Record<Contact['status'], number>,
        recent: 0
      }

      if (data) {
        // Count by status
        data.forEach(contact => {
          if (contact.status in stats.byStatus) {
            stats.byStatus[contact.status as Contact['status']]++
          }
        })

        // Count recent (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        stats.recent = data.filter(contact => 
          new Date(contact.created_at) > sevenDaysAgo
        ).length
      }

      return stats

    } catch (error) {
      console.error('Error getting contact stats:', error)
      throw error
    }
  }
}

export default ContactService