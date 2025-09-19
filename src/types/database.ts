export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          senior_care_id: string
          name: string
          date_of_birth: string
          sex: string
          phone_number: string
          emergency_contact: string
          emergency_name_relation: string
          email: string | null
          address: {
            house_no: string
            building_name: string
            landmark: string
            city: string
            district: string
            pin_code: string
          } | null
          medical_info: {
            diet_preference: string
            tobacco_type: string
            tobacco_years: string
            alcohol_frequency: string
            medicine_allergy: string
            food_allergy: string
            other_allergy: string
            hospital_admission: string
            surgery: string
            past_conditions: string[]
            other_past_condition: string
            current_condition: string
            current_medication: string
            hospital_name: string
            doctor_name: string
            doctor_contact: string
          } | null
          insurance_info: {
            has_insurance: string
            insurance_company: string
            tpa_name: string
            policy_number: string
            amount_covered: string
            room_entitled: string
          } | null
          documents: {
            photo_url: string | null
            discharge_card_url: string | null
            prescription_url: string | null
            surgery_documents_url: string | null
            policy_card_url: string | null
          } | null
          plan_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          senior_care_id: string
          name: string
          date_of_birth: string
          sex: string
          phone_number: string
          emergency_contact: string
          emergency_name_relation: string
          email?: string | null
          address?: any | null
          medical_info?: any | null
          insurance_info?: any | null
          documents?: any | null
          plan_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          senior_care_id?: string
          name?: string
          date_of_birth?: string
          sex?: string
          phone_number?: string
          emergency_contact?: string
          emergency_name_relation?: string
          email?: string | null
          address?: any | null
          medical_info?: any | null
          insurance_info?: any | null
          documents?: any | null
          plan_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'user' | 'admin' | 'care_manager'
          subscription_status: 'inactive' | 'active' | 'cancelled' | 'past_due'
          subscription_plan: string | null
          onboarding_completed: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | 'care_manager'
          subscription_status?: 'inactive' | 'active' | 'cancelled' | 'past_due'
          subscription_plan?: string | null
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | 'care_manager'
          subscription_status?: 'inactive' | 'active' | 'cancelled' | 'past_due'
          subscription_plan?: string | null
          onboarding_completed?: boolean
        }
      }
      care_plans: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          plan_type: 'single' | 'couple'
          duration: number
          price: number
          status: 'active' | 'inactive' | 'cancelled'
          start_date: string
          end_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          plan_type: 'single' | 'couple'
          duration: number
          price: number
          status?: 'active' | 'inactive' | 'cancelled'
          start_date: string
          end_date: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          plan_type?: 'single' | 'couple'
          duration?: number
          price?: number
          status?: 'active' | 'inactive' | 'cancelled'
          start_date?: string
          end_date?: string
        }
      }
      care_sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          care_plan_id: string
          session_type: 'consultation' | 'emergency' | 'follow_up' | 'monitoring'
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date: string
          notes: string | null
          care_manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          care_plan_id: string
          session_type: 'consultation' | 'emergency' | 'follow_up' | 'monitoring'
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date: string
          notes?: string | null
          care_manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          care_plan_id?: string
          session_type?: 'consultation' | 'emergency' | 'follow_up' | 'monitoring'
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date?: string
          notes?: string | null
          care_manager_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin' | 'care_manager'
      subscription_status: 'inactive' | 'active' | 'cancelled' | 'past_due'
      plan_type: 'single' | 'couple'
      session_status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
      session_type: 'consultation' | 'emergency' | 'follow_up' | 'monitoring'
    }
  }
}