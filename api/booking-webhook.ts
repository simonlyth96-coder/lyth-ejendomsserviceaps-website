import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const bookingData = req.body;
    
    // Log the booking for debugging
    console.log('Booking received:', bookingData);

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      
      await resend.emails.send({
        from: 'Lyth Ejendomsservice <bookings@lythejendomsservice.dk>',
        to: 'lythejendomsservice@gmail.com',
        subject: `Ny booking: ${bookingData.service} - ${bookingData.date}`,
        html: `
          <h2>Ny booking modtaget</h2>
          <p><strong>Service:</strong> ${bookingData.service}</p>
          <p><strong>Kunde:</strong> ${bookingData.name}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          <p><strong>Telefon:</strong> ${bookingData.phone}</p>
          <p><strong>Dato:</strong> ${bookingData.date}</p>
          <p><strong>Tidspunkt:</strong> ${bookingData.timeSlot}</p>
          <p><strong>Besked:</strong> ${bookingData.message || 'Ingen besked'}</p>
        `
      });
    }

    // Also forward to n8n webhook if configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (n8nWebhookUrl) {
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    }

    // Return success
    return res.status(200).json({ 
      success: true, 
      message: 'Booking received successfully' 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process booking' 
    });
  }
}
