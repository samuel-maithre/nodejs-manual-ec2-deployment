'use strict';

const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', require('./routes/health'));

app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Node.js app deployed on EC2',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname()
  });
});

// 404 handler — must be after all routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler — must have 4 params for Express to recognize it
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;