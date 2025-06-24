import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { authenticateCognito } from '../middleware/cognito.middleware.js';
import pool from '../utils/db.js';

const router = express.Router();

// Configure S3 client
const s3Client = new S3Client({
    region: process.env.S3_REGION || process.env.AWS_REGION
});

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow common document types
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'));
        }
    }
});

// Upload file endpoint - accepts any field name
router.post('/', authenticateCognito, (req, res, next) => {
    const uploadHandler = upload.any(); // Accept any field name
    
    uploadHandler(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, error: 'File too large. Maximum size is 10MB.' });
            }
            return res.status(400).json({ success: false, error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        // Get the first uploaded file regardless of field name
        const file = req.files?.[0];
        
        if (!file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        const userId = req.user.id;
        const fileName = `${userId}/document.${file.originalname.split('.').pop()}`; // Use fixed name

        // Check existing file and delete it before uploading new one
        const existingProfile = await pool.query(
            'SELECT pdf_url FROM profiles WHERE id = $1',
            [userId]
        );
        
        if (existingProfile.rows.length > 0 && existingProfile.rows[0].pdf_url) {
            const oldUrl = existingProfile.rows[0].pdf_url;
            console.log('📋 Found existing file URL:', oldUrl);
            
            // Extract S3 key from URL
            const urlParts = oldUrl.split('.amazonaws.com/');
            if (urlParts.length > 1) {
                const oldKey = urlParts[1];
                console.log('🗑️ Deleting old S3 file:', oldKey);
                
                try {
                    await s3Client.send(new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: oldKey
                    }));
                    console.log('✅ Old file deleted successfully');
                } catch (deleteError) {
                    console.warn('⚠️ Could not delete old file:', deleteError.message);
                }
            }
        } else {
            console.log('📝 No existing file found for user');
        }

        // Upload to S3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ServerSideEncryption: 'AES256'
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // Generate S3 URL
        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`;

        // Update existing profile with file URL (don't create new profile)
        const result = await pool.query(
            `UPDATE profiles SET pdf_url = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING *`,
            [fileUrl, userId]
        );

        console.log('✅ File uploaded successfully:', fileName);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found. Please create a profile first.',
                fileUrl: fileUrl
            });
        }
        
        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileUrl: fileUrl,
                fileName: file.originalname,
                fileSize: file.size,
                profile: result.rows[0]
            }
        });

    } catch (error) {
        console.error('Upload error details:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        
        // Return specific error messages
        if (error.code === 'NoSuchBucket') {
            return res.status(500).json({ success: false, error: 'S3 bucket not found. Check S3_BUCKET_NAME.' });
        }
        if (error.code === 'AccessDenied') {
            return res.status(500).json({ success: false, error: 'S3 access denied. Check AWS credentials.' });
        }
        if (error.code === '23505') {
            return res.status(500).json({ success: false, error: 'Database constraint error.' });
        }
        
        res.status(500).json({ 
            success: false, 
            error: 'Upload failed. Please try again.',
            details: error.message 
        });
    }
});

// Debug endpoint to test S3 connection
router.get('/test', authenticateCognito, async (req, res) => {
    try {
        console.log('Testing S3 configuration...');
        console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);
        console.log('S3_REGION:', process.env.S3_REGION);
        console.log('AWS_REGION:', process.env.AWS_REGION);
        console.log('User ID:', req.user.id);
        
        res.json({
            success: true,
            config: {
                bucket: process.env.S3_BUCKET_NAME,
                region: process.env.S3_REGION || process.env.AWS_REGION,
                userId: req.user.id
            }
        });
    } catch (error) {
        console.error('Test error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;