import express from 'express';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { authenticateCognito } from '../middleware/cognito.middleware.js';
import pool from '../utils/db.js';

const router = express.Router();
const s3Client = new S3Client({ region: process.env.S3_REGION });

// List user's files in S3
router.get('/files', authenticateCognito, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // List files in user's S3 folder
    const listParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: `${userId}/`
    };

    const command = new ListObjectsV2Command(listParams);
    const s3Response = await s3Client.send(command);
    
    // Get user's profile to check current pdf_url
    const profileResult = await pool.query(
      'SELECT pdf_url FROM profiles WHERE id = $1',
      [userId]
    );

    const files = s3Response.Contents?.map(file => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${file.Key}`,
      isActive: profileResult.rows[0]?.pdf_url?.includes(file.Key) || false
    })) || [];

    res.json({
      success: true,
      data: {
        files,
        totalFiles: files.length,
        currentFile: profileResult.rows[0]?.pdf_url || null
      }
    });
  } catch (error) {
    console.error('Error listing S3 files:', error);
    res.status(500).json({ success: false, error: 'Failed to list files' });
  }
});

// Verify S3 configuration
router.get('/verify', authenticateCognito, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Test S3 connection
    const listParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: `${userId}/`,
      MaxKeys: 1
    };

    await s3Client.send(new ListObjectsV2Command(listParams));
    
    res.json({
      success: true,
      message: 'S3 connection verified',
      config: {
        bucket: process.env.S3_BUCKET_NAME,
        region: process.env.S3_REGION,
        userFolder: `${userId}/`
      }
    });
  } catch (error) {
    console.error('S3 verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'S3 connection failed',
      details: error.message 
    });
  }
});

export default router;