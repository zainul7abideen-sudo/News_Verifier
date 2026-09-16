const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/tickets
router.get('/', (req, res) => {
  const tickets = db.getTickets();
  return res.status(200).json({ success: true, data: tickets });
});

// POST /api/tickets/submit
router.post('/submit', (req, res) => {
  const { claimText, method, submittedBy } = req.body;
  if (!claimText) {
    return res.status(400).json({ success: false, message: 'Claim text is required.' });
  }
  const ticket = db.addTicket({
    claimText,
    method: method || 'text',
    submittedBy: submittedBy || 'anonymous_user'
  });
  return res.status(201).json({ success: true, data: ticket });
});

module.exports = router;
