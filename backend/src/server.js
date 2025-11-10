require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://fincra-wisdom.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parser for JWT tokens
app.use(morgan('dev')); // Logging

// API Routes
const circleRoutes = require('./routes/circleRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const aiRoutes = require('./routes/aiRoutes');
console.log('✅ AI Routes loaded:', typeof aiRoutes, aiRoutes.stack ? 'HAS ROUTES' : 'NO ROUTES');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Fincra Knowledge Hub API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Use routes
app.use('/api/circles', circleRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ai', aiRoutes);
console.log('✅ Auth Routes registered at /api/auth');
console.log('✅ AI Routes registered at /api/ai');

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Fincra Knowledge Hub API',
    version: '1.0.0',
    description: 'Single Source of Truth for Fincra Documentation',
    endpoints: {
      circles: '/api/circles',
      departments: '/api/departments',
      auth: '/api/auth',
      documents: '/api/documents',
      categories: '/api/categories',
      ai: '/api/ai',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Fincra Knowledge Hub API Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth Endpoint: http://localhost:${PORT}/api/auth`);
  console.log('═══════════════════════════════════════════════════════════');
});

module.exports = app;