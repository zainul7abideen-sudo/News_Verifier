const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/analytics
router.get('/', (req, res) => {
  const stats = db.getAnalytics();
  return res.status(200).json({ success: true, data: stats });
});

module.exports = router;
