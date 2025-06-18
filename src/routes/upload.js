import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from '../data/dynamodb.js';

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
const s3Client = new S3Client({
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
    const bucketName = process.env.S3_BUCKET;

    if (!bucketName) {
      throw new Error('S3_BUCKET environment variable not set');
    }

    // For development, simulate S3 upload
    if (process.env.NODE_ENV === 'development') {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockS3Url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
      
      // Save upload record to DynamoDB
      const uploadData = {
        id: fileId,
        profile_id: req.body.profile_id || 'anonymous',
        original_filename: req.file.originalname,
        stored_filename: fileName,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        s3_url: mockS3Url,
        upload_status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await FileUploadService.createFileUpload(uploadData);
      
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
      ServerSideEncryption: 'AES256'
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;

    // Save upload record to DynamoDB
    const uploadData = {
      id: fileId,
      profile_id: req.body.profile_id || 'anonymous',
      original_filename: req.file.originalname,
      stored_filename: fileName,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      s3_url: s3Url,
      upload_status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FileUploadService.createFileUpload(uploadData);

    res.json({
      success: true,
      data: {
        fileId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        url: s3Url,
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

// GET /api/upload/:profileId - Get uploads for a profile
router.get('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const uploads = await FileUploadService.getUploadsByProfileId(profileId);

    res.json({
      success: true,
      data: uploads,
      count: uploads.length
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve uploads'
    });
  }
});

export default router;