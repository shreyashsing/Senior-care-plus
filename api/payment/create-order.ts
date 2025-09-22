import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

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

    // Generate unique receipt ID
    const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create Razorpay order using their API
    const razorpayOrderData = {
      amount: amount * 100, // Razorpay expects amount in paisa (smallest currency unit)
      currency: 'INR',
      receipt: receiptId,
      notes: {
        plan_type: planType,
        plan_duration: duration,
        patient_count: patientData.length
      }
    };

    // Create order with Razorpay
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`
      },
      body: JSON.stringify(razorpayOrderData)
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error('Razorpay API error:', errorData);
      return res.status(500).json({ error: 'Failed to create Razorpay order' });
    }

    const razorpayOrder = await razorpayResponse.json();
    
    // Create order data for our database
    const orderData = {
      order_id: razorpayOrder.id, // Use Razorpay's order ID
      receipt: receiptId,
      amount: amount, // Store in rupees for our records
      currency: 'INR',
      status: 'created',
      plan_type: planType,
      plan_duration: duration,
      created_at: new Date().toISOString(),
      patient_data: patientData,
      razorpay_order_id: razorpayOrder.id
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
      order: {
        ...data,
        razorpay_order_id: razorpayOrder.id
      },
      razorpay_key: process.env.RAZORPAY_KEY_ID // Safe to send public key
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}