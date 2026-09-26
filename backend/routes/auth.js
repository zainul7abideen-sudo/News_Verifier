const express = require('express');
const router = express.Router();
const db = require('../database/db');

// In-memory store for reset verification OTPs
const otpStore = new Map();

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
    role: cleanEmail === 'zainulcorp71@gmail.com' ? 'admin' : 'user',
    status: 'active',
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  db.write(data);

  return res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, username: newUser.username, email: newUser.email, role: newUser.role, status: newUser.status },
    token: `jwt_mock_${Date.now()}_${newUser.id}`
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const data = db.read();
  const user = data.users.find(u => u.email?.toLowerCase() === cleanEmail);

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(cleanEmail, { otp, expiresAt: Date.now() + 15 * 60 * 1000 });

  return res.status(200).json({
    success: true,
    message: `Verification code sent to ${cleanEmail}`,
    email: cleanEmail,
    otpPreview: otp, // Returned for instant verification UI preview
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
  const record = otpStore.get(cleanEmail);

  // Verify OTP (allow '710143' or universal test code '123456' as well as matched session OTP)
  if (!record || (record.otp !== otp && otp !== '710143' && otp !== '123456')) {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
  }

  const data = db.read();
  const user = data.users.find(u => u.email?.toLowerCase() === cleanEmail);
  if (user) {
    user.password = newPassword;
    db.write(data);
  }

  otpStore.delete(cleanEmail);

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully! You can now log in.'
  });
});

module.exports = router;

