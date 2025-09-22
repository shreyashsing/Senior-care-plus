import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow both GET and POST for diagnostics
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: {
        SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Missing',
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'Set' : 'Missing',
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing',
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Missing',
      },
      razorpay: {
        key_id: process.env.RAZORPAY_KEY_ID || 'Not set',
        api_endpoint: 'https://api.razorpay.com/v1/orders'
      },
      request: {
        method: req.method,
        headers: Object.keys(req.headers),
        body: req.method === 'POST' ? req.body : 'N/A'
      }
    };

    // Test Razorpay API connectivity
    try {
      const testResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`
        },
        body: JSON.stringify({
          amount: 100, // 1 rupee in paisa
          currency: 'INR',
          receipt: 'test_receipt_' + Date.now()
        })
      });

      diagnostics.razorpay.connectivity = {
        status: testResponse.status,
        ok: testResponse.ok,
        statusText: testResponse.statusText
      };

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        diagnostics.razorpay.error = errorText;
      }
    } catch (error: any) {
      diagnostics.razorpay.connectivity = {
        error: error?.message || 'Unknown error'
      };
    }

    res.status(200).json({
      success: true,
      diagnostics
    });

  } catch (error: any) {
    console.error('Diagnostics error:', error);
    res.status(500).json({ 
      error: 'Diagnostics failed',
      message: error?.message || 'Unknown error'
    });
  }
}
