const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { sendOtpEmail, SENDER_EMAIL } = require('../services/mailer');

// In-memory store for reset verification OTPs
const otpStore = new Map();

// POST /api/auth/send-otp (Dynamic OTP for registration, forgot-password, or email verification)
router.post('/send-otp', async (req, res) => {
  const { email, purpose, userName } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  // Generate brand new 6-digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(`${cleanEmail}_${purpose || 'general'}`, {
    otp,
    email: cleanEmail,
    purpose: purpose || 'general',
    expiresAt,
    createdAt: Date.now()
  });

  // Attempt sending via Nodemailer / SMTP
  const mailResult = await sendOtpEmail(cleanEmail, otp, purpose || 'Verification', userName);

  return res.status(200).json({
    success: true,
    message: `Verification code sent to ${cleanEmail} from ${SENDER_EMAIL}`,
    email: cleanEmail,
    sender: SENDER_EMAIL,
    otpPreview: otp,
    expiresAt,
    mailDispatched: mailResult.success
  });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { email, otp, purpose } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const sessionKey = `${cleanEmail}_${purpose || 'general'}`;
  const record = otpStore.get(sessionKey);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No active OTP session found. Please request a new code.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(sessionKey);
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new code.' });
  }

  if (record.otp !== otp.trim()) {
    return res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
  }

  otpStore.delete(sessionKey);
  return res.status(200).json({ success: true, message: 'OTP verified successfully!' });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ success: false, message: 'Identifier and password are required.' });
  }

  const cleanId = userId.trim().toLowerCase();
  const data = db.read();
  const user = data.users.find(u => 
    (u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId) && 
    u.password === password
  );

  if (user) {
    return res.status(200).json({
      success: true,
      user: { id: user.id, name: user.name || user.username, username: user.username, email: user.email, role: user.role, status: user.status || 'active' },
      token: `jwt_mock_${Date.now()}_${user.id}`
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials. Check username/email or password.' });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, email, password, name, mobile } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Username, email, and password required.' });
  }
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase();

  const data = db.read();
  const existing = data.users.find(u => u.email?.toLowerCase() === cleanEmail || u.username?.toLowerCase() === cleanUsername);
  if (existing) {
    return res.status(400).json({ success: false, message: 'User with this email or username already exists.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || username,
    username: cleanUsername,
    email: cleanEmail,
    password,
    mobile: mobile || '',
    role: 'user',
    status: 'active',
    verified: true,
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  db.write(data);

  return res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, username: newUser.username, email: newUser.email, role: newUser.role, status: newUser.status, verified: newUser.verified },
    token: `jwt_mock_${Date.now()}_${newUser.id}`
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const data = db.read();
  const user = data.users.find(u => u.email?.toLowerCase() === cleanEmail);

  // Generate 6-digit dynamic random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(`${cleanEmail}_forgot_password`, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

  await sendOtpEmail(cleanEmail, otp, 'forgot_password', user ? user.name : '');

  return res.status(200).json({
    success: true,
    message: `Verification code sent to ${cleanEmail} from ${SENDER_EMAIL}`,
    email: cleanEmail,
    sender: SENDER_EMAIL,
    otpPreview: otp,
    userExists: Boolean(user)
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, verification code (OTP), and new password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const sessionKey = `${cleanEmail}_forgot_password`;
  const record = otpStore.get(sessionKey);

  if (!record || record.otp !== otp.trim()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
  }

  const data = db.read();
  const user = data.users.find(u => u.email?.toLowerCase() === cleanEmail);
  if (user) {
    user.password = newPassword;
    db.write(data);
  }

  otpStore.delete(sessionKey);

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully! You can now log in.'
  });
});

module.exports = router;


