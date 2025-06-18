import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF files only
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// POST /api/upload - Upload file to S3
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    const fileId = uuidv4();
    const fileName = `${fileId}-${req.file.originalname}`;
    const bucketName = process.env.S3_BUCKET || 'health-app-uploads';

    // For development, simulate S3 upload
    if (process.env.NODE_ENV === 'development') {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockS3Url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
      
      return res.json({
        success: true,
        data: {
          fileId,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          url: mockS3Url,
          uploadedAt: new Date().toISOString()
        },
        message: 'File uploaded successfully (simulated)'
      });
    }

    // Production S3 upload
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'private'
    };

    const result = await s3.upload(uploadParams).promise();

    res.json({
      success: true,
      data: {
        fileId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        url: result.Location,
        uploadedAt: new Date().toISOString()
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({
        success: false,
        error: 'Only PDF files are allowed'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload file'
    });
  }
});

export default router;