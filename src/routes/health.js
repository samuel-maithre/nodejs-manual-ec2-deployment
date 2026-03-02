'use strict';

const router = require('express').Router();
const os = require('os');

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),      // seconds since Node start
    memory: process.memoryUsage(), // heap stats in bytes
    load: os.loadavg(),            // 1, 5, 15 min CPU load averages
    pid: process.pid
  });
});

module.exports = router;