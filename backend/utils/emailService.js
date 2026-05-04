const nodemailer = require('nodemailer');

/**
 * Core email sender.
 * @param {object} options
 * @param {string} options.to        - Recipient email (defaults to ADMIN_EMAIL)
 * @param {string} options.subject   - Email subject
 * @param {string} [options.text]    - Plain text body
 * @param {string} [options.html]    - HTML body (takes priority over text)
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"D'NINJA Creative Studio" <${process.env.EMAIL_USER}>`,
    to: options.to || process.env.ADMIN_EMAIL,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

/* ─────────────────────────────────────────────
   ORDER ALERT — Rich HTML email to admin
───────────────────────────────────────────── */
const sendOrderAlert = async (order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:12px 15px; border-bottom:1px solid #1e1e2e;">${item.name}</td>
      <td style="padding:12px 15px; border-bottom:1px solid #1e1e2e; text-align:center;">x${item.quantity}</td>
      <td style="padding:12px 15px; border-bottom:1px solid #1e1e2e; text-align:right; font-weight:700; color:#fff;">&#8377;${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0; padding:0; background:#0a0a0f; font-family:'Segoe UI', Arial, sans-serif; color:#ccc;">
      <div style="max-width:620px; margin:40px auto; background:#111118; border:1px solid #222235; border-radius:16px; overflow:hidden;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#5f0fff,#ff3c6e); padding:40px 40px 30px;">
          <div style="font-size:2rem; font-weight:900; color:#fff; letter-spacing:3px;">D'NINJA</div>
          <div style="color:rgba(255,255,255,0.7); font-size:0.85rem; margin-top:5px; letter-spacing:2px; text-transform:uppercase;">New Mission Brief Received</div>
        </div>

        <!-- Body -->
        <div style="padding:40px;">
          <h2 style="color:#fff; font-size:1.5rem; margin:0 0 8px;">Order #${order._id.toString().slice(-6).toUpperCase()}</h2>
          <p style="color:#888; font-size:0.85rem; margin:0 0 30px;">${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>

          <!-- Customer Info -->
          <div style="background:#0a0a14; border:1px solid #1e1e2e; border-radius:12px; padding:25px; margin-bottom:25px;">
            <div style="font-size:0.75rem; color:#5f0fff; letter-spacing:2px; text-transform:uppercase; margin-bottom:15px;">Customer Details</div>
            <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
              <tr><td style="padding:6px 0; color:#888; width:130px;">Name</td><td style="padding:6px 0; color:#fff; font-weight:600;">${order.customerName}</td></tr>
              <tr><td style="padding:6px 0; color:#888;">Email</td><td style="padding:6px 0; color:#fff;">${order.customerEmail}</td></tr>
              <tr><td style="padding:6px 0; color:#888;">WhatsApp</td><td style="padding:6px 0; color:#fff;">${order.customerWhatsApp}</td></tr>
              <tr><td style="padding:6px 0; color:#888; vertical-align:top;">Address</td><td style="padding:6px 0; color:#fff;">${order.customerAddress}</td></tr>
            </table>
          </div>

          <!-- Items Table -->
          <div style="font-size:0.75rem; color:#5f0fff; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px;">Mission Scope</div>
          <table style="width:100%; border-collapse:collapse; font-size:0.9rem; background:#0a0a14; border:1px solid #1e1e2e; border-radius:12px; overflow:hidden;">
            <thead>
              <tr style="background:#1a1a2e;">
                <th style="padding:12px 15px; text-align:left; color:#888; font-weight:500; font-size:0.8rem; text-transform:uppercase;">Item</th>
                <th style="padding:12px 15px; text-align:center; color:#888; font-weight:500; font-size:0.8rem; text-transform:uppercase;">Qty</th>
                <th style="padding:12px 15px; text-align:right; color:#888; font-weight:500; font-size:0.8rem; text-transform:uppercase;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <!-- Financials -->
          <div style="background:#0a0a14; border:1px solid #1e1e2e; border-radius:12px; padding:25px; margin-top:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem;">
              <span style="color:#888;">Subtotal</span>
              <span>&#8377;${order.subtotal}</span>
            </div>
            ${order.coupon ? `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem;">
              <span style="color:#ff3c6e;">Coupon (${order.coupon})</span>
              <span style="color:#ff3c6e;">-&#8377;${order.discount}</span>
            </div>` : ''}
            <div style="border-top:1px solid #1e1e2e; padding-top:15px; margin-top:5px; display:flex; justify-content:space-between; font-size:1.1rem; font-weight:700;">
              <span style="color:#fff;">Total</span>
              <span style="color:#fff;">&#8377;${order.total}</span>
            </div>
          </div>

          <!-- Payment Action -->
          <div style="background:linear-gradient(135deg, rgba(95,15,255,0.15), rgba(255,60,110,0.1)); border:1px solid rgba(95,15,255,0.3); border-radius:12px; padding:25px; margin-top:25px; text-align:center;">
            <div style="font-size:0.75rem; color:#888; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px;">Action Required — Advance Payment</div>
            <div style="font-size:2rem; font-weight:900; color:#5f0fff; margin-bottom:5px;">&#8377;${order.advanceAmount}</div>
            <div style="font-size:0.8rem; color:#888;">60% advance due &nbsp;|&nbsp; Remaining &#8377;${order.remainingAmount} on delivery</div>
            <div style="margin-top:20px; padding:12px 20px; background:rgba(255,60,110,0.1); border:1px solid rgba(255,60,110,0.3); border-radius:8px; font-size:0.85rem; color:#ff3c6e;">
              📱 Contact customer on WhatsApp to confirm advance payment
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:20px 40px; border-top:1px solid #1e1e2e; text-align:center; font-size:0.75rem; color:#444;">
          D'NINJA Creative Studio &nbsp;•&nbsp; workdninja@gmail.com &nbsp;•&nbsp; Auto-generated alert
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🥷 NEW MISSION: Order #${order._id.toString().slice(-6).toUpperCase()} — ₹${order.total}`,
      html,
    });
    console.log('✅ Order alert email sent');
  } catch (error) {
    console.error('❌ Failed to send order alert email:', error.message);
  }
};

/* ─────────────────────────────────────────────
   INQUIRY ALERT — Rich HTML email to admin
───────────────────────────────────────────── */
const sendInquiryAlert = async (inquiry) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0; padding:0; background:#0a0a0f; font-family:'Segoe UI', Arial, sans-serif; color:#ccc;">
      <div style="max-width:620px; margin:40px auto; background:#111118; border:1px solid #222235; border-radius:16px; overflow:hidden;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#ff3c6e,#5f0fff); padding:40px 40px 30px;">
          <div style="font-size:2rem; font-weight:900; color:#fff; letter-spacing:3px;">D'NINJA</div>
          <div style="color:rgba(255,255,255,0.7); font-size:0.85rem; margin-top:5px; letter-spacing:2px; text-transform:uppercase;">New Contact Inquiry</div>
        </div>

        <!-- Body -->
        <div style="padding:40px;">
          <h2 style="color:#fff; font-size:1.4rem; margin:0 0 5px;">Message from ${inquiry.name}</h2>
          <p style="color:#888; font-size:0.85rem; margin:0 0 30px;">${new Date(inquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>

          <!-- Sender Info -->
          <div style="background:#0a0a14; border:1px solid #1e1e2e; border-radius:12px; padding:25px; margin-bottom:25px;">
            <div style="font-size:0.75rem; color:#ff3c6e; letter-spacing:2px; text-transform:uppercase; margin-bottom:15px;">Sender Details</div>
            <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
              <tr><td style="padding:6px 0; color:#888; width:100px;">Name</td><td style="padding:6px 0; color:#fff; font-weight:600;">${inquiry.name}</td></tr>
              <tr><td style="padding:6px 0; color:#888;">Email</td><td style="padding:6px 0; color:#fff;">${inquiry.email}</td></tr>
              <tr><td style="padding:6px 0; color:#888;">Subject</td><td style="padding:6px 0; color:#fff;">${inquiry.subject || '—'}</td></tr>
            </table>
          </div>

          <!-- Message -->
          <div style="font-size:0.75rem; color:#ff3c6e; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px;">Message</div>
          <div style="background:#0a0a14; border:1px solid #1e1e2e; border-left:3px solid #ff3c6e; border-radius:12px; padding:25px; font-size:0.95rem; line-height:1.7; color:#ddd; white-space:pre-wrap;">${inquiry.message}</div>

          <!-- Reply CTA -->
          <div style="margin-top:25px; text-align:center;">
            <a href="mailto:${inquiry.email}?subject=Re: ${inquiry.subject || 'Your inquiry at D\'NINJA'}" 
               style="display:inline-block; padding:14px 32px; background:#ff3c6e; color:#fff; text-decoration:none; border-radius:8px; font-weight:700; font-size:0.9rem; letter-spacing:1px;">
              Reply to ${inquiry.name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:20px 40px; border-top:1px solid #1e1e2e; text-align:center; font-size:0.75rem; color:#444;">
          D'NINJA Creative Studio &nbsp;•&nbsp; workdninja@gmail.com &nbsp;•&nbsp; Auto-generated alert
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Inquiry from ${inquiry.name} — "${inquiry.subject || 'No Subject'}"`,
      html,
    });
    console.log('✅ Inquiry alert email sent');
  } catch (error) {
    console.error('❌ Failed to send inquiry alert email:', error.message);
  }
};

/* ─────────────────────────────────────────────
   ORDER CONFIRMATION — Sent to the customer
───────────────────────────────────────────── */
const sendOrderConfirmation = async (order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:10px 15px; border-bottom:1px solid #1e1e2e; color:#ccc;">${item.name}</td>
      <td style="padding:10px 15px; border-bottom:1px solid #1e1e2e; text-align:center; color:#ccc;">x${item.quantity}</td>
      <td style="padding:10px 15px; border-bottom:1px solid #1e1e2e; text-align:right; font-weight:700; color:#fff;">&#8377;${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0; padding:0; background:#0a0a0f; font-family:'Segoe UI', Arial, sans-serif; color:#ccc;">
      <div style="max-width:620px; margin:40px auto; background:#111118; border:1px solid #222235; border-radius:16px; overflow:hidden;">
        <div style="background:linear-gradient(135deg,#5f0fff,#ff3c6e); padding:40px 40px 30px;">
          <div style="font-size:2rem; font-weight:900; color:#fff; letter-spacing:3px;">D'NINJA</div>
          <div style="color:rgba(255,255,255,0.7); font-size:0.85rem; margin-top:5px; letter-spacing:2px; text-transform:uppercase;">Mission Confirmed ✓</div>
        </div>
        <div style="padding:40px;">
          <h2 style="color:#fff; font-size:1.5rem; margin:0 0 8px;">Hey ${order.customerName}, you're in! 🥷</h2>
          <p style="color:#888; margin:0 0 30px; line-height:1.6;">Your creative mission has been received. Here's a summary of your order:</p>

          <div style="background:#0a0a14; border:1px solid #1e1e2e; border-radius:12px; padding:15px; margin-bottom:20px;">
            <div style="font-size:0.75rem; color:#5f0fff; letter-spacing:2px; text-transform:uppercase; padding:10px 10px 15px;">Your Items</div>
            <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
              <thead><tr style="background:#1a1a2e;">
                <th style="padding:10px 15px; text-align:left; color:#888; font-weight:500; font-size:0.8rem;">Item</th>
                <th style="padding:10px 15px; text-align:center; color:#888; font-weight:500; font-size:0.8rem;">Qty</th>
                <th style="padding:10px 15px; text-align:right; color:#888; font-weight:500; font-size:0.8rem;">Price</th>
              </tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>
          </div>

          <div style="background:#0a0a14; border:1px solid #1e1e2e; border-radius:12px; padding:20px; margin-bottom:20px; font-size:0.9rem;">
            ${order.coupon ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#888;">Coupon (${order.coupon})</span><span style="color:#ff3c6e;">-&#8377;${order.discount}</span></div>` : ''}
            <div style="display:flex;justify-content:space-between;font-size:1.1rem;font-weight:700;border-top:1px solid #1e1e2e;padding-top:12px;"><span style="color:#fff;">Total</span><span style="color:#fff;">&#8377;${order.total}</span></div>
          </div>

          <div style="background:rgba(95,15,255,0.1); border:1px solid rgba(95,15,255,0.3); border-radius:12px; padding:25px; text-align:center;">
            <div style="font-size:0.8rem; color:#888; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px;">Next Step — Security Deposit</div>
            <div style="font-size:2.5rem; font-weight:900; color:#5f0fff; margin-bottom:5px;">&#8377;${order.advanceAmount}</div>
            <div style="font-size:0.85rem; color:#888; margin-bottom:20px;">60% advance to kick off your design sprint</div>
            <div style="background:#5f0fff; color:#fff; padding:12px 24px; border-radius:8px; font-family:monospace; font-weight:700; display:inline-block; letter-spacing:2px;">UPI: shuvamjana@fam</div>
            <p style="font-size:0.75rem; color:#ff3c6e; margin-top:15px; letter-spacing:1px;">SEND PAYMENT SCREENSHOT ON WHATSAPP FOR IMMEDIATE ACTIVATION</p>
          </div>

          <p style="margin-top:30px; color:#888; font-size:0.85rem; line-height:1.6;">
            Order Reference: <span style="font-family:monospace; color:#5f0fff;">#${order._id.toString().slice(-6).toUpperCase()}</span><br>
            We'll be in touch shortly. Stay sharp. 🥷
          </p>
        </div>
        <div style="padding:20px 40px; border-top:1px solid #1e1e2e; text-align:center; font-size:0.75rem; color:#444;">
          D'NINJA Creative Studio &nbsp;•&nbsp; workdninja@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: order.customerEmail,
      subject: `🥷 Mission Confirmed — Order #${order._id.toString().slice(-6).toUpperCase()} | D'NINJA`,
      html,
    });
    console.log('✅ Order confirmation email sent to customer');
  } catch (error) {
    console.error('❌ Failed to send order confirmation to customer:', error.message);
  }
};

module.exports = { sendEmail, sendOrderAlert, sendOrderConfirmation, sendInquiryAlert };
