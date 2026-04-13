/**
 * ConciergeAI SMS Notification Service
 * Used for high-priority alerts (Emergency bookings)
 * To integrate with a real provider: 
 * 1. Install 'twilio' or 'vonage'
 * 2. Add API keys to .env
 * 3. Update the sendSms function below
 */

export async function sendSms(to: string, message: string) {
  console.log(`[SMS Service] Sending to ${to}: ${message}`);
  
  // Example Twilio integration structure:
  /*
  const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    return { success: true, sid: result.sid };
  } catch (err) {
    console.error("SMS Failed:", err);
    return { success: false, error: err.message };
  }
  */

  // For now, we simulate success
  return { success: true, simulated: true };
}

export async function sendEmergencyAlert(merchantPhone: string, companyName: string, serviceName: string) {
  const message = `⚡ [ConciergeAI] EMERGENCY BOOKING: ${companyName}, you have a new urgent request for '${serviceName}'. Please check your dashboard immediately.`;
  return sendSms(merchantPhone, message);
}
