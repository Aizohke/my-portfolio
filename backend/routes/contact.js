const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Rate limit contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please try again in an hour.' }
});

// Build transporter once — uses Gmail App Password
// Requires these env vars in Render:
//   EMAIL_USER = your_gmail@gmail.com
//   EMAIL_PASS = your_16_character_app_password  (NOT your real Gmail password)
//   EMAIL_TO   = where to receive messages (can be same as EMAIL_USER)
const createTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,          // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,  // required on many cloud hosting providers
  },
});

// POST /api/contact
router.post('/', contactLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Check env vars are actually set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Contact form error: EMAIL_USER or EMAIL_PASS not set in environment variables');
    return res.status(500).json({
      success: false,
      message: 'Email service not configured. Please contact me directly.',
    });
  }

  const { name, email, subject, message } = req.body;
  const sendTo = process.env.EMAIL_TO || process.env.EMAIL_USER;

  try {
    const transporter = createTransporter();

    // Verify connection before attempting to send
    await transporter.verify();

    // Email to Isaac
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: sendTo,
      replyTo: email,
      subject: `Portfolio: ${subject || 'New Message'} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C0392B; border-bottom: 2px solid #C0392B; padding-bottom: 10px;">
            New Portfolio Contact
          </h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <strong>Message:</strong>
            <p style="margin-top: 8px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color:#888;font-size:12px;margin-top:20px;">
            Sent from isaacmathenge.netlify.app contact form
          </p>
        </div>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Isaac Mathenge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for reaching out — Isaac Mathenge',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C0392B;">Hello ${name},</h2>
          <p>Thank you for your message! I've received it and will get back to you as soon as possible.</p>
          <p>In the meantime, feel free to explore more of my work on the portfolio.</p>
          <br>
          <p>Best regards,<br><strong>Isaac Mathenge</strong></p>
          <p style="color: #888; font-size: 12px;">Mechanical Engineering Student | Full-Stack Developer | TUK Nairobi</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    // Log the real error on the server so you can see it in Render logs
    console.error('Contact form email error:', err.message);
    res.status(500).json({
      success: false,
      // Return a helpful message — common causes listed
      message: err.message.includes('Invalid login')
        ? 'Email authentication failed. Check EMAIL_USER and EMAIL_PASS in Render environment variables.'
        : err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')
        ? 'Cannot connect to email server. Check EMAIL_USER and EMAIL_PASS are set in Render.'
        : 'Failed to send message. Please email me directly.',
    });
  }
});

module.exports = router;
