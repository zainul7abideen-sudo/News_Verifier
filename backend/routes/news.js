const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/news
router.get('/', (req, res) => {
  const { category, search } = req.query;
  const news = db.getNews(category, search);
  return res.status(200).json({ success: true, count: news.length, data: news });
});

// POST /api/news
router.post('/', (req, res) => {
  const { title, content, source, type, category, verdict, confidence, explanation, image } = req.body;
  if (!title || !content || !source) {
    return res.status(400).json({ success: false, message: 'Title, content, and source are required.' });
  }

  const item = db.addNews({
    title,
    content,
    source,
    type: type || 'News Channels',
    category: category || 'National',
    verdict: verdict || 'True',
    confidence: confidence || 95,
    explanation: explanation || 'Verified through official news source.',
    image: image || 'https://images.unsplash.com/photo-1545143333-11cb50c33b9c?auto=format&fit=crop&w=800&q=80'
  });

  return res.status(201).json({ success: true, data: item });
});

module.exports = router;
