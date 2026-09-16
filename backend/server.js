const express = require('express');
const cors = require('cors');
const path = require('path');

const factCheckRoutes = require('./routes/factCheck');
const newsRoutes = require('./routes/news');
const ticketsRoutes = require('./routes/tickets');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const studentsRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/students', studentsRoutes);
app.use('/api/factcheck', factCheckRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'SRA AI Fact-Checking Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve frontend build if present
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Error handling fallback
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error occurred.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 SRA Fact-Checking API Server is running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📰 News Endpoint: http://localhost:${PORT}/api/news`);
    console.log(`🔍 Verify Endpoint: http://localhost:${PORT}/api/factcheck/verify`);
    console.log(`====================================================`);
  });
}

module.exports = app;
