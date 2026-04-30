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

  const itemDetails = order.items.map(item => `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
  
  const message = `
    New Order Received! 🥷
    
    Order ID: ${order._id}
    Customer: ${order.customerName || 'N/A'}
    Email: ${order.customerEmail || 'N/A'}
    
    Items:
    ${itemDetails}
    
    Total: ₹${order.total}
    Coupon: ${order.coupon || 'None'}
  `;

  try {
    await sendEmail({
      subject: `New Order Alert: ${order._id}`,
      message: message
    });
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
