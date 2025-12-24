const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendUserConfirmation = async (contactData) => {
  try {
    const { name, email } = contactData;

    const msg = {
      to: email,
      from: process.env.ADMIN_EMAIL,
      subject: 'Thank You for Contacting Us',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Thank You, ${name}!</h2>
          <hr style="border: none; border-top: 1px solid #ddd;">
          
          <div style="margin: 20px 0;">
            <p>Hi ${name},</p>
            <p>We have received your message and appreciate you taking the time to contact us. We will review your message and get back to you as soon as possible.</p>
            <p>In the meantime, if you have any questions, feel free to reach out to us again.</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Best regards,<br/>
            The Team
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log('User confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
    return false;
  }
};

const sendAdminNotification = async (contactData) => {
  try {
    const { name, email, phone, subject, message } = contactData;

    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL,
      subject: `New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">New Contact Message Received</h2>
          <hr style="border: none; border-top: 1px solid #ddd;">
          
          <div style="margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd;">
          
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; word-wrap: break-word;">${message}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Sent on ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log('Admin notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
};

module.exports = { sendUserConfirmation, sendAdminNotification };
