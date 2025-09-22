// Alternative ContactService for testing RLS issues
// Replace the existing ContactService temporarily to test

import { supabase } from './supabase'

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
}

export interface CreateContact {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export class ContactServiceDebug {
  
  // Simple create contact with debugging
  static async createContact(contactData: CreateContact): Promise<Contact> {
    console.log('🔍 ContactService Debug - Starting createContact...')
    console.log('📝 Contact data:', contactData)
    
    try {
      console.log('🔌 Supabase client:', supabase)
      
      // Test 1: Try the simplest possible insert
      console.log('🧪 Test 1: Simple insert without select...')
      const { error: insertError } = await supabase
        .from('contacts')
        .insert(contactData)
      
      if (insertError) {
        console.error('❌ Insert failed:', insertError)
        throw new Error(`Insert failed: ${insertError.message}`)
      }
      
      console.log('✅ Insert succeeded!')
      
      // Test 2: Try to get the inserted record
      console.log('🧪 Test 2: Fetching inserted record...')
      const { data, error: selectError } = await supabase
        .from('contacts')
        .select('*')
        .eq('email', contactData.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (selectError) {
        console.error('❌ Select failed:', selectError)
        // Return a mock object if select fails but insert worked
        return {
          id: 'temp-id',
          ...contactData,
          status: 'new' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      
      console.log('✅ Successfully created and fetched contact:', data)
      return data
      
    } catch (error) {
      console.error('💥 ContactService Debug Error:', error)
      throw error
    }
  }

  // Test method to check if we can read from contacts table
  static async testRead(): Promise<boolean> {
    try {
      console.log('🧪 Testing read access...')
      const { data, error } = await supabase
        .from('contacts')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('❌ Read test failed:', error)
        return false
      }
      
      console.log('✅ Read test passed:', data)
      return true
    } catch (error) {
      console.error('💥 Read test error:', error)
      return false
    }
  }

  // Test method to check RLS policies
  static async testRLS(): Promise<void> {
    try {
      console.log('🛡️ Testing RLS policies...')
      
      // Test insert
      const testData = {
        name: 'RLS Test',
        email: `test-${Date.now()}@example.com`,
        phone: '555-0000',
        subject: 'RLS Test',
        message: 'Testing RLS policies'
      }
      
      const { data, error } = await supabase
        .from('contacts')
        .insert(testData)
        .select()
        .single()
      
      if (error) {
        console.error('❌ RLS Test failed:', error)
      } else {
        console.log('✅ RLS Test passed:', data)
        
        // Clean up test data
        await supabase
          .from('contacts')
          .delete()
          .eq('id', data.id)
      }
      
    } catch (error) {
      console.error('💥 RLS Test error:', error)
    }
  }
}

// Export for debugging
export default ContactServiceDebug