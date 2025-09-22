import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, planType, duration, patientData } = req.body;

    if (!amount || !planType || !duration || !patientData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Supabase client with service key (server-side only)
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order data
    const orderData = {
      order_id: orderId,
      receipt: orderId,
      amount: amount,
      currency: 'INR',
      status: 'created',
      plan_type: planType,
      plan_duration: duration,
      created_at: new Date().toISOString(),
      patient_data: patientData
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('payment_orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create payment order' });
    }

    // Return success response
    res.status(200).json({
      success: true,
      order: data,
      razorpay_key: process.env.RAZORPAY_KEY_ID // Safe to send public key
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}