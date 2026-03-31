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

  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject || 'New Message'} — from ${name}`,
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
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Thanks for reaching out — Isaac Mathenge",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C0392B;">Hello ${name},</h2>
          <p>Thank you for your message! I've received it and will get back to you as soon as possible.</p>
          <p>In the meantime, feel free to explore more of my work on the portfolio.</p>
          <br>
          <p>Best regards,<br><strong>Isaac Mathenge</strong></p>
          <p style="color: #888; font-size: 12px;">Mechanical Engineering Student | Full-Stack Developer</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;
