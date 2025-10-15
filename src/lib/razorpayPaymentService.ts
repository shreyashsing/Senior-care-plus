import { supabase } from './supabase'
import { createFamilyMembers, createCarePlan } from './multiMemberPatientService'

// Types
interface PaymentOrder {
  id?: string
  order_id: string
  receipt?: string
  amount: number
  currency: string
  status: string
  plan_type?: string
  patient_data?: any
  created_at?: string
  razorpay_key?: string
}

// Razorpay types
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id?: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// Declare Razorpay constructor for browser
declare global {
  interface Window {
    Razorpay: any
  }
}

// Patient data interface for payment
export interface PaymentPatientData {
  planType: string
  fullName: string
  email: string
  phone: string
  patientData: any[]
}

export class RazorpayPaymentService {
  // Create payment order via API endpoint
  static async createOrder(amount: number, planType: string, duration: string, patientData: any[]): Promise<PaymentOrder> {
    try {
      console.log('🚀 Creating payment order...', { amount, planType, duration, patientData })
      
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planType,
          duration,
          patientData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to create payment order');
      }

      console.log('✅ Payment order created successfully:', result.order)
      console.log('🎯 Payment order created:', {
        amount: result.order.amount,
        currency: result.order.currency,
        order_id: result.order.razorpay_order_id || result.order.order_id,
        razorpay_key: result.razorpay_key
      })
      
      return {
        id: result.order.id,
        order_id: result.order.razorpay_order_id || result.order.order_id, // Use Razorpay order ID
        amount: result.order.amount,
        currency: result.order.currency,
        status: result.order.status,
        razorpay_key: result.razorpay_key
      } as PaymentOrder;

    } catch (error) {
      console.error('❌ Error creating payment order:', error)
      throw error
    }
  }

  // Initialize Razorpay payment
  static async initializePayment(
    order: PaymentOrder,
    paymentPatientData: PaymentPatientData,
    onSuccess?: (patientIds?: string[]) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    try {
      await this.loadRazorpayScript()
      
      console.log('🎯 Initializing payment with Razorpay...', {
        key: order.razorpay_key,
        amount: order.amount * 100,
        currency: order.currency,
        order_id: order.order_id
      })

      const options: RazorpayOptions = {
        key: order.razorpay_key || '',
        amount: order.amount * 100, // Convert to paisa for Razorpay
        currency: order.currency,
        name: 'SeniorCare+',
        description: `${paymentPatientData.planType} Plan Payment`,
        order_id: order.order_id, // This should now be the Razorpay order ID
        handler: async (response: RazorpayResponse) => {
          try {
            await this.verifyPayment(response, order.order_id)
            
            let patientIds: string[] = []
            let patientData: any[] = []
            
            if (paymentPatientData.patientData?.length > 0) {
              console.log('🔍 Payment handler - patientData array:', JSON.stringify(paymentPatientData.patientData, null, 2));
              
              // Create all family members (primary + co-members) at once
              try {
                console.log('🔍 Creating family group with', paymentPatientData.patientData.length, 'members');
                const familyResult = await createFamilyMembers(paymentPatientData.patientData);
                patientIds = familyResult.patientIds;
                patientData = familyResult.patientData;
                console.log('✅ All family members created. Patient IDs:', patientIds);
                console.log('✅ Patient data for E-cards:', patientData);
              } catch (patientError) {
                console.error('❌ Error creating family members:', patientError);
                throw patientError; // Re-throw to trigger error callback
              }
              
              if (patientIds.length > 0) {
                // Extract plan details from order or payment data
                const planType = paymentPatientData.planType; // Should be 'basic', 'advance', or 'premium'
                const duration = '12'; // Default duration, should get from order metadata
                const planPrice = order.amount; // Payment amount
                
                console.log('🔍 Creating care plan:', { planType, duration, planPrice });
                
                await createCarePlan(
                  planType,
                  duration,
                  planPrice,
                  patientIds
                );
                
                console.log('✅ Care plan created and linked to all family members');
              }
            }

            console.log('🎯 Calling onSuccess with patient data');
            try {
              // Pass the complete patient data for E-card generation
              onSuccess?.(patientData || [])
              console.log('✅ onSuccess callback executed successfully')
            } catch (callbackError) {
              console.error('❌ Error in onSuccess callback:', callbackError)
            }
          } catch (error) {
            onError?.(error)
          }
        },
        prefill: {
          name: paymentPatientData.fullName,
          email: paymentPatientData.email,
          contact: paymentPatientData.phone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            onError?.(new Error('Payment cancelled by user'))
          }
        }
      }

      const rzp = new window.Razorpay(options)
      console.log('🎯 Payment initialization complete')
      rzp.open()

    } catch (error) {
      onError?.(error)
    }
  }

  // Verify payment via API endpoint
  private static async verifyPayment(response: RazorpayResponse, orderId: string): Promise<void> {
    const verifyResponse = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        order_id: orderId // This is the Razorpay order ID
      })
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error || 'Payment verification failed');
    }

    const result = await verifyResponse.json();
    
    if (!result.success) {
      throw new Error('Payment verification failed');
    }
  }

  // Load Razorpay script dynamically
  private static async loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
      document.head.appendChild(script)
    })
  }

  static async getPaymentHistory(limit = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('payment_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error in getPaymentHistory:', error)
      throw error
    }
  }

  static async getPaymentByOrderId(orderId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('payment_orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error in getPaymentByOrderId:', error)
      throw error
    }
  }
}

export type { PaymentOrder }