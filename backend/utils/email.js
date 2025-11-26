import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter = null;

const getTransporter = () => {
  if (!transporter && process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('✅ Email transporter initialized');
  }
  return transporter;
};

export const sendBookingConfirmation = async ({ email, name, eventTitle, bookingCode, numberOfTickets, totalAmount }) => {
  const emailTransporter = getTransporter();
  
  if (!emailTransporter) {
    console.log(`Email not configured. Would have sent booking confirmation to: ${email}`);
    return; // Silently skip if email not configured
  }

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'EventHub'} <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Booking Confirmed - ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .booking-code { font-size: 24px; font-weight: bold; color: #0284c7; text-align: center; padding: 15px; background: #eff6ff; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for booking with EventHub! Your booking for <strong>${eventTitle}</strong> has been confirmed.</p>
            
            <div class="booking-code">
              Booking Code: ${bookingCode}
            </div>
            
            <div class="booking-details">
              <h3 style="margin-top: 0; color: #0284c7;">Booking Details</h3>
              <div class="detail-row">
                <span>Event:</span>
                <strong>${eventTitle}</strong>
              </div>
              <div class="detail-row">
                <span>Number of Tickets:</span>
                <strong>${numberOfTickets}</strong>
              </div>
              <div class="detail-row">
                <span>Total Amount:</span>
                <strong>₹${totalAmount}</strong>
              </div>
              <div class="detail-row">
                <span>Booking Code:</span>
                <strong>${bookingCode}</strong>
              </div>
            </div>
            
            <p>Please keep this booking code safe. You'll need to present it at the event venue.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/my-bookings" 
                 style="background: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View My Bookings
              </a>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please contact us at support@eventhub.com</p>
              <p>&copy; ${new Date().getFullYear()} EventHub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send booking confirmation email:', error.message);
    // Don't throw error - email failure shouldn't break the booking flow
  }
};

export const sendEventReminder = async ({ email, name, eventTitle, eventDate }) => {
  const emailTransporter = getTransporter();
  
  if (!emailTransporter) {
    console.log(`Email not configured. Would have sent event reminder to: ${email}`);
    return;
  }

  // Implementation for event reminder emails
  console.log(`Sending event reminder to ${email} for ${eventTitle}`);
};
