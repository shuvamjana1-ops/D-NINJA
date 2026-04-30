const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"D'NINJA Creative Studio" <${process.env.EMAIL_USER}>`,
    to: options.to || process.env.ADMIN_EMAIL,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

const sendOrderAlert = async (order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const itemsHtml = order.items.map(item => `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <strong>${item.name}</strong> (x${item.quantity}) - ₹${item.price * item.quantity}
        </div>
    `).join('');

    const mailOptions = {
      from: `"D'NINJA Systems" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🥷 NEW MISSION: Order #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2 style="color: #5f0fff;">New Brief Received!</h2>
            <p>A customer has submitted a new creative mission. Here are the details:</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <strong>Customer:</strong> ${order.customerName}<br>
                <strong>Email:</strong> ${order.customerEmail}<br>
                <strong>WhatsApp:</strong> ${order.customerWhatsApp}<br>
                <strong>Address:</strong> ${order.customerAddress}
            </div>

            <h3 style="margin-top: 25px;">Mission Scope (Items):</h3>
            ${itemsHtml}

            <div style="margin-top: 20px; border-top: 2px solid #5f0fff; padding-top: 15px;">
                <strong>Order Total:</strong> ₹${order.total}<br>
                <strong style="color: #ff3c6e;">Advance Due (60%): ₹${order.advanceAmount}</strong><br>
                <strong>Remaining (40%): ₹${order.remainingAmount}</strong>
            </div>

            <p style="margin-top: 30px; font-size: 0.9rem; color: #666;">
                <i>Action Required: Connect with the customer via WhatsApp/Email to confirm advance payment.</i>
            </p>
        </div>
      `,
    };

  try {
    await sendEmail(mailOptions);
    console.log('✅ Order alert email sent');
  } catch (error) {
    console.error('❌ Failed to send order alert email:', error.message);
  }
};

const sendInquiryAlert = async (inquiry) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const message = `
    New Contact Inquiry Received! 📩
    
    From: ${inquiry.name} (${inquiry.email})
    Subject: ${inquiry.subject || 'No Subject'}
    
    Message:
    ${inquiry.message}
  `;

  try {
    await sendEmail({
      subject: `New Inquiry from ${inquiry.name}`,
      message: message
    });
    console.log('✅ Inquiry alert email sent');
  } catch (error) {
    console.error('❌ Failed to send inquiry alert email:', error.message);
  }
};

module.exports = {
  sendOrderAlert,
  sendInquiryAlert
};
