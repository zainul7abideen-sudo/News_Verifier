const express = require('express');
const router = express.Router();
const factChecker = require('../engine/factChecker');
const db = require('../database/db');

// POST /api/factcheck/verify
router.post('/verify', async (req, res) => {
  try {
    const { text, method, url, source } = req.body;
    const result = await factChecker.verifyClaim({ text, method, url, source });
    db.addVerification(result);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/factcheck/history
router.get('/history', (req, res) => {
  const data = db.read();
  return res.status(200).json({ success: true, data: data.verifications || [] });
});

module.exports = router;
