import express from 'express';

const router = express.Router();

// S3 related routes placeholder
router.get('/presigned-url', (req, res) => {
    res.json({ message: 'S3 presigned URL endpoint' });
});

export default router;