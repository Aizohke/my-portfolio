const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Rate limit — 10 attempts per hour
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Too many messages sent. Please try again in an hour.' }
});

// Build transporter from env vars
const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT) || 465;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact/test-email  — diagnose SMTP in browser
// https://your-render-app.onrender.com/api/contact/test-email
// ─────────────────────────────────────────────────────────────────────────────
router.get('/test-email', async (req, res) => {
  const diagnosis = {
    EMAIL_HOST: process.env.EMAIL_HOST || '❌ NOT SET',
    EMAIL_PORT: process.env.EMAIL_PORT || '❌ NOT SET',
    EMAIL_USER: process.env.EMAIL_USER ? `✅ SET (${process.env.EMAIL_USER})` : '❌ NOT SET',
    EMAIL_PASS: process.env.EMAIL_PASS ? `✅ SET (length: ${process.env.EMAIL_PASS.length})` : '❌ NOT SET',
    EMAIL_TO:   process.env.EMAIL_TO   ? `✅ SET (${process.env.EMAIL_TO})`   : '⚠️ NOT SET',
  };

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ success: false, problem: 'EMAIL_USER or EMAIL_PASS missing', diagnosis });
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"Portfolio Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: '✅ Portfolio Email Test — It Works!',
      html: '<p>Your contact form email is working correctly on Render.</p>',
    });
    res.json({ success: true, message: '✅ SMTP verified and test email sent! Check your inbox.', diagnosis });
  } catch (err) {
    res.status(500).json({
      success: false,
      problem: err.message,
      diagnosis,
      hint: err.message.includes('Invalid login') || err.message.includes('Username and Password')
        ? 'Wrong App Password — regenerate at myaccount.google.com → Security → App Passwords'
        : err.message.includes('ECONNREFUSED') ? 'Port blocked — change EMAIL_PORT to 465'
        : err.message.includes('ETIMEDOUT') || err.message.includes('timeout') ? 'Timeout — change EMAIL_PORT to 465'
        : 'See problem field above',
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact  — contact form submission
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', contactLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      message: 'Email not configured on server. Visit /api/contact/test-email to diagnose.',
    });
  }

  const { name, email, subject, message } = req.body;
  const sendTo = process.env.EMAIL_TO || process.env.EMAIL_USER;

  try {
    const transporter = createTransporter();
    await transporter.verify();

    // Email to Isaac
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: sendTo,
      replyTo: email,
      subject: `Portfolio: ${subject || 'New Message'} — from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#C0392B;border-bottom:2px solid #C0392B;padding-bottom:10px;">New Portfolio Contact</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin-top:10px;">
            <strong>Message:</strong>
            <p style="margin-top:8px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Isaac Mathenge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for reaching out — Isaac Mathenge',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#C0392B;">Hello ${name},</h2>
          <p>Thank you for your message! I've received it and will get back to you as soon as possible.</p>
          <p>Best regards,<br><strong>Isaac Mathenge</strong></p>
          <p style="color:#888;font-size:12px;">Mechanical Engineering Student | Full-Stack Developer | TUK Nairobi</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Contact email error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message.includes('Invalid login') || err.message.includes('Username and Password')
        ? 'Email authentication failed — check App Password in Render env vars.'
        : err.message.includes('ECONNREFUSED') || err.message.includes('timeout') || err.message.includes('ETIMEDOUT')
        ? 'Cannot connect to email server — change EMAIL_PORT to 465 in Render.'
        : `Email error: ${err.message}`,
    });
  }
});

module.exports = router;
