import express from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { authenticateCognito } from '../middleware/cognito.middleware.js';
import pool from '../utils/db.js';

const router = express.Router();
const s3Client = new S3Client({ region: process.env.S3_REGION });

// Get signed URL for user's document
router.get('/view', authenticateCognito, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Document view request for user:', userId);
    
    // Get user's document URL from database
    const result = await pool.query('SELECT pdf_url FROM profiles WHERE id = $1', [userId]);
    console.log('Database result:', result.rows);
    
    if (!result.rows[0]?.pdf_url) {
      console.log('No document found for user');
      return res.status(404).json({ success: false, error: 'No document found' });
    }

    // Extract S3 key from URL
    const fileUrl = result.rows[0].pdf_url;
    console.log('File URL:', fileUrl);
    const key = fileUrl.split('.amazonaws.com/')[1];
    console.log('S3 Key:', key);
    
    if (!key) {
      console.log('Invalid document URL format');
      return res.status(400).json({ success: false, error: 'Invalid document URL' });
    }

    // Generate signed URL (valid for 1 hour)
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    });

    console.log('Generating signed URL for bucket:', process.env.S3_BUCKET_NAME, 'key:', key);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Signed URL generated successfully');

    res.json({
      success: true,
      data: {
        signedUrl,
        originalUrl: fileUrl,
        expiresIn: 3600
      }
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate document URL: ' + error.message });
  }
});

export default router;