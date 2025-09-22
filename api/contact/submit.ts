import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const contactData = req.body;

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, and message are required' 
      });
    }

    // Initialize Supabase client with service key (server-side only)
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Insert contact form submission
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        ...contactData,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase contact insertion error:', error);
      return res.status(500).json({ 
        error: 'Failed to submit contact form. Please try again.' 
      });
    }

    // Log successful submission (remove in production)
    console.log('Contact form submitted successfully:', data.id);

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      contactId: data.id
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}