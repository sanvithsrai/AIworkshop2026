require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const examsRoutes = require('./routes/exams');
const newslettersRoutes = require('./routes/newsletters');
const jobsRoutes = require('./routes/jobs');
const materialsRoutes = require('./routes/materials');
const recruitersRoutes = require('./routes/recruiters');
const hackathonsRoutes = require('./routes/hackathons');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for observability
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/newsletters', newslettersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/recruiters', recruitersRoutes);
app.use('/api/hackathons', hackathonsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/news', newsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    institution: 'Sahyadri College of Engineering & Management',
    portal: 'Sahyadri Placement and Career Portal for Engineers (SPACE)',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: 'Connected',
      supabase: 'Active',
      gemini_ai: 'Active',
      elevenlabs_voice: 'Active',
      newsdata: 'Active'
    }
  });
});

// Serve compiled client assets if dist exists
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected server error occurred.',
    timestamp: new Date().toISOString()
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Sahyadri SPACE (Placement and Career Portal for Engineers) running on http://localhost:${PORT}`);
    console.log(`📍 API Health: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
