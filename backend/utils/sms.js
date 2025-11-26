import twilio from 'twilio';

// Initialize Twilio client
let twilioClient = null;

const getTwilioClient = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      console.log('✅ Twilio initialized successfully');
    } catch (error) {
      console.error('❌ Twilio initialization failed:', error.message);
    }
  }
  return twilioClient;
};

export const sendBookingSMS = async ({ phone, name, eventTitle, bookingCode }) => {
  const client = getTwilioClient();
  
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`SMS not configured. Would have sent booking confirmation to: ${phone}`);
    return;
  }

  // Format phone number to E.164 format (+919876543210)
  let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits
  if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
    formattedPhone = '91' + formattedPhone; // Add India country code
  }
  formattedPhone = '+' + formattedPhone;

  const message = `Hi ${name}! Your booking for "${eventTitle}" is confirmed. Booking Code: ${bookingCode}. Show this at the venue. - EventHub`;

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });
    console.log(`✅ SMS sent to ${formattedPhone}`);
  } catch (error) {
    console.error('❌ Failed to send SMS:', error.message);
    // Don't throw - SMS failure shouldn't break booking
  }
};

export const sendEventReminder = async ({ phone, name, eventTitle, eventDate }) => {
  const client = getTwilioClient();
  
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`SMS not configured. Would have sent event reminder to: ${phone}`);
    return;
  }

  let formattedPhone = phone.replace(/\D/g, '');
  if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
    formattedPhone = '91' + formattedPhone;
  }
  formattedPhone = '+' + formattedPhone;

  const message = `Reminder: "${eventTitle}" is on ${eventDate}. Don't forget to bring your booking code! - EventHub`;

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });
    console.log(`✅ Event reminder SMS sent to ${formattedPhone}`);
  } catch (error) {
    console.error('❌ Failed to send reminder SMS:', error.message);
  }
};
