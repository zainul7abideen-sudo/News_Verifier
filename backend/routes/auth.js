const express = require('express');
const router = express.Router();
const db = require('../database/db');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  const data = db.read();
  const user = data.users.find(u => (u.username === userId || u.email === userId) && u.password === password);
  if (user) {
    return res.status(200).json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token: `jwt_mock_${Date.now()}_${user.id}`
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Username, email, and password required.' });
  }
  const data = db.read();
  const newUser = {
    id: `usr-${Date.now()}`,
    username,
    email,
    password,
    role: 'user'
  };
  data.users.push(newUser);
  db.write(data);
  return res.status(201).json({
    success: true,
    user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
    token: `jwt_mock_${Date.now()}_${newUser.id}`
  });
});

module.exports = router;
