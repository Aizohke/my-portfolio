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

const createTransporter = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact/test-email
// Visit this in your browser to diagnose exactly what is wrong:
//   https://your-render-app.onrender.com/api/contact/test-email
// It will show you the exact SMTP error and which env vars are set/missing.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/test-email', async (req, res) => {
  const diagnosis = {
    EMAIL_HOST:  process.env.EMAIL_HOST  || '❌ NOT SET (will use smtp.gmail.com)',
    EMAIL_PORT:  process.env.EMAIL_PORT  || '❌ NOT SET (will use 587)',
    EMAIL_USER:  process.env.EMAIL_USER  ? `✅ SET (${process.env.EMAIL_USER})` : '❌ NOT SET',
    EMAIL_PASS:  process.env.EMAIL_PASS  ? `✅ SET (length: ${process.env.EMAIL_PASS.length})` : '❌ NOT SET',
    EMAIL_TO:    process.env.EMAIL_TO    ? `✅ SET (${process.env.EMAIL_TO})`   : '⚠️  NOT SET (will fall back to EMAIL_USER)',
  };

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      problem: 'EMAIL_USER or EMAIL_PASS is missing from Render environment variables.',
      diagnosis,
    });
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();

    // Also send a real test email to confirm end-to-end delivery
    await transporter.sendMail({
      from: `"Portfolio Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: '✅ Portfolio Email Test — It Works!',
      html: '<p>Your contact form email is working correctly on Render.</p>',
    });

    res.json({
      success: true,
      message: '✅ SMTP connection verified AND test email sent! Check your inbox.',
      diagnosis,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      problem: err.message,
      diagnosis,
      hint: err.message.includes('Invalid login') || err.message.includes('Username and Password')
        ? 'Your App Password is wrong. Make sure you generated a Gmail App Password (not your real password). Go to: myaccount.google.com → Security → App Passwords'
        : err.message.includes('ECONNREFUSED')
        ? 'Cannot reach smtp.gmail.com — Render may be blocking outbound port 587. Try EMAIL_PORT=465 with secure=true.'
        : err.message.includes('ETIMEDOUT')
        ? 'Connection timed out — try changing EMAIL_PORT to 465 in Render env vars.'
        : 'Unknown error — see problem field above.',
    });
  }
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

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      message: 'Email not configured. Visit /api/contact/test-email to diagnose.',
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
    console.error('Contact form email error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message.includes('Invalid login') || err.message.includes('Username and Password')
        ? 'Email authentication failed — invalid App Password.'
        : err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')
        ? 'Cannot connect to email server. Try changing EMAIL_PORT to 465.'
        : `Email error: ${err.message}`,
    });
  }
});

module.exports = router;


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
