import { supabase } from './supabase'
import { createPatient, createCarePlan } from './patientService'

// Types
interface PaymentOrder {
  id?: string
  order_id: string
  receipt: string
  amount: number
  currency: string
  status: string
  plan_type: string
  patient_data: any
  created_at: string
}

// Razorpay types
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id?: string // Optional for test mode
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

export class RazorpayService {
  private static readonly RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID
  private static readonly RAZORPAY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET

  // Create payment order in Supabase
  static async createOrder(amount: number, planType: string, duration: string, patientData: any[]): Promise<PaymentOrder> {
    try {
      console.log('🚀 Creating payment order...', { amount, planType, duration, patientData })
      
      // Generate unique order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('📝 Generated order ID:', orderId)
      
      // Create order data
      const orderData = {
        order_id: orderId,
        receipt: orderId,
        amount: amount,
        currency: 'INR',
        status: 'created',
        plan_type: planType,
        patient_data: {
          fullName: patientData[0]?.name || 'Unknown',
          email: patientData[0]?.emailId || '',
          phone: patientData[0]?.selfCellNumber || '',
          duration: duration, // Store duration in patient_data
          patientData
        },
        created_at: new Date().toISOString()
      }

      console.log('📝 Saving order to database...')

      // Save to database
      const { data, error } = await supabase
        .from('payment_orders')
        .insert({
          order_id: orderId,
          amount,
          currency: 'INR',
          plan_type: planType,
          patient_data: {
            fullName: patientData[0]?.name || 'Unknown',
            email: patientData[0]?.emailId || '',
            phone: patientData[0]?.selfCellNumber || '',
            duration: duration, // Store duration in patient_data
            patientData
          },
          receipt: orderId,
          status: 'created'
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error saving order to database:', error)
        throw error
      }

      console.log('✅ Order saved to database:', data)

      // Return order data (we'll save to DB after successful payment)
      const order: PaymentOrder = {
        id: orderId,
        order_id: orderId,
        receipt: orderId,
        amount: amount,
        currency: 'INR',
        status: 'created',
        plan_type: planType,
        patient_data: orderData.patient_data,
        created_at: new Date().toISOString()
      }

      console.log('✅ Payment order prepared:', order.order_id)
      return order
    } catch (error) {
      console.error('❌ Error in createOrder:', error)
      throw error
    }
  }

  // Initialize Razorpay payment
  static async initializePayment(
    order: PaymentOrder,
    paymentPatientData: PaymentPatientData,
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
  ): Promise<void> {
    try {
      console.log('🔄 Initializing Razorpay payment for order:', order.order_id)
      
      // Check if environment variables are set
      if (!this.RAZORPAY_KEY) {
        throw new Error('Razorpay key not configured. Please check environment variables.')
      }

      // Check if Razorpay is available (loaded from HTML)
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not found. Please refresh the page and try again.')
      }

      console.log('💳 Razorpay SDK is available')

      const options: RazorpayOptions = {
        key: this.RAZORPAY_KEY,
        amount: order.amount * 100, // Razorpay expects amount in paisa
        currency: order.currency,
        name: 'Peace of Mind Concierge',
        description: `Healthcare Plan - ${order.plan_type}`,
        // Don't include order_id for test mode - it causes 400 errors
        // order_id: order.order_id,
        handler: async (response: RazorpayResponse) => {
          try {
            console.log('✅ Payment successful:', response)
            
            // Update order status to paid
            await this.updateOrderStatus(order.order_id, 'paid', response)
            
            // Create patient accounts after successful payment
            const registrationData = await this.createPatientAfterPayment(order, paymentPatientData)
            
            // Call success callback
            onSuccess({ ...response, registrationData })
          } catch (error) {
            console.error('❌ Error handling payment success:', error)
            onFailure(error)
          }
        },
        prefill: {
          name: order.patient_data.fullName,
          email: order.patient_data.email,
          contact: order.patient_data.phone
        },
        theme: {
          color: '#059669' // Emerald color
        },
        modal: {
          ondismiss: () => {
            console.log('💔 Payment cancelled by user')
            onFailure(new Error('Payment cancelled by user'))
          }
        }
      }

      console.log('🎯 Creating Razorpay instance with options:', {
        ...options,
        key: `${options.key.substring(0, 8)}...`
      })

      // Create and open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      
      console.log('🚀 Opening Razorpay checkout...')
      razorpay.open()

    } catch (error) {
      console.error('❌ Error initializing payment:', error)
      onFailure(error)
    }
  }

  // Update payment order status
  static async updateOrderStatus(
    orderId: string, 
    status: string, 
    paymentResponse?: RazorpayResponse
  ): Promise<void> {
    try {
      console.log(`📝 Updating order ${orderId} status to:`, status)
      
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (paymentResponse) {
        updateData.razorpay_payment_id = paymentResponse.razorpay_payment_id
        updateData.razorpay_signature = paymentResponse.razorpay_signature
        if (status === 'paid') {
          updateData.completed_at = new Date().toISOString()
        }
      }

      console.log('📤 Updating with data:', updateData)

      const { error } = await supabase
        .from('payment_orders')
        .update(updateData)
        .eq('order_id', orderId)

      if (error) {
        console.error('❌ Error updating order status:', error)
        throw error
      }

      console.log('✅ Order status updated successfully')
    } catch (error) {
      console.error('❌ Error in updateOrderStatus:', error)
      throw error
    }
  }

  // Create patient after successful payment
  static async createPatientAfterPayment(
    order: PaymentOrder,
    paymentPatientData: PaymentPatientData
  ): Promise<any> {
    try {
      console.log('👤 Creating patient after successful payment...')
      
      const patientData = order.patient_data.patientData[0]
      
      // Create care plan first based on the plan type
      const planType = order.plan_type as 'single' | 'couple'
      const duration = order.patient_data.duration // Extract duration from patient_data
      
      const createdCarePlanId = await createCarePlan(planType, duration, order.amount)
      console.log('✅ Care plan created:', createdCarePlanId)

      // Add plan ID to patient data
      const patientDataWithPlan = {
        ...patientData,
        planId: createdCarePlanId
      }
      
      // Create the patient with plan ID
      const createdPatientId = await createPatient(patientDataWithPlan)
      
      if (!createdPatientId) {
        throw new Error('Failed to create patient')
      }

      console.log('✅ Patient created with plan ID:', createdPatientId)

      // Return data in the format expected by RegistrationSuccessPage
      return {
        patients: [{
          seniorCareId: createdPatientId,
          name: patientData.name,
          dateOfBirth: patientData.dateOfBirth,
          sex: patientData.sex,
          phoneNumber: patientData.phoneNumber
        }],
        planType: planType,
        duration: duration,
        price: Number(order.amount) || 0, // Ensure price is a number
        patientId: createdPatientId,
        carePlanId: createdCarePlanId,
        orderDetails: order
      }
    } catch (error) {
      console.error('❌ Error creating patient after payment:', error)
      throw error
    }
  }

  // Helper function to get plan services
  private static getPlanServices(planType: string): string[] {
    const baseServices = [
      '24/7 Emergency Support',
      'Health Monitoring',
      'Care Coordination',
      'Medical Assistance'
    ]

    switch (planType) {
      case 'single':
        return baseServices
      case 'couple':
        return [...baseServices, 'Couple Health Plans', 'Joint Activities']
      case 'family':
        return [...baseServices, 'Family Care Plans', 'Multi-member Support', 'Family Health Tracking']
      default:
        return baseServices
    }
  }
}