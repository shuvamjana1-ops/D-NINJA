const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
require('dotenv').config();

const { connectDB, disconnectDB } = require('./config/db');
const { errorHandler, notFound }  = require('./middleware/errorMiddleware');
const { sanitizeInputs }          = require('./middleware/sanitize');
const { globalLimiter }           = require('./middleware/rateLimiter');
const { consoleLogger, fileLogger } = require('./utils/logger');

// ── Route imports ──────────────────────────────────
const orderRoutes   = require('./routes/orderRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

// ── App init ───────────────────────────────────────
const app = express();

// ── Database ───────────────────────────────────────
connectDB();

// ── CORS ───────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, file://)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error(`CORS policy: Origin "${origin}" is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// ── Core Middleware ────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight for all routes
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(sanitizeInputs);
app.use(consoleLogger);
app.use(fileLogger);
app.use(globalLimiter);

// ── Health Check ───────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: "D'NINJA API",
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// ── Root ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: "D'NINJA API is running 🥷",
    version: '2.0.0',
    endpoints: {
      health:   'GET  /api/health',
      orders:   'POST /api/orders',
      contact:  'POST /api/contact',
    },
  });
});

// ── API Routes ─────────────────────────────────────
app.use('/api/orders',  orderRoutes);
app.use('/api/contact', inquiryRoutes);

// ── Error Handling ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Server Start ───────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 D'NINJA API v2.0.0`);
  console.log(`   Mode:    ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port:    ${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health\n`);
});

// ── Graceful Shutdown ──────────────────────────────
const gracefulShutdown = async (signal) => {
  console.log(`\n⚡ ${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    console.log('🔒 HTTP server closed.');
    await disconnectDB();
    console.log('✅ Shutdown complete. Goodbye.\n');
    process.exit(0);
  });

  // Force-exit if graceful shutdown stalls after 10s
  setTimeout(() => {
    console.error('❌ Graceful shutdown timed out. Force exiting.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app; // for testing
