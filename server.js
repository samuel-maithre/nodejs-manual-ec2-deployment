'use strict';

const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// '0.0.0.0' means listen on ALL network interfaces
// '127.0.0.1' (localhost) would mean ONLY local connections — Nginx couldn't reach it
const server = app.listen(PORT, HOST, () => {
  console.log(`[${new Date().toISOString()}] Server started`);
  console.log(`[INFO] Listening on ${HOST}:${PORT}`);
  console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown — allows in-flight requests to complete
process.on('SIGTERM', () => {
  console.log('[INFO] SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('[INFO] HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[INFO] SIGINT received (Ctrl+C)');
  process.exit(0);
});