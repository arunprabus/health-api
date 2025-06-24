import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health Dashboard API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;