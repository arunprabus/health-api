import pool from '../utils/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure upload directory
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload a health document file
export async function uploadFile(req, res) {
    try {
        // Note: In a real implementation, you would use a middleware like multer
        // to handle file uploads. This is a simplified example.
        if (!req.file) {
            // For demo purposes, we'll accept the simulated file info in the request body
            const { profileId, fileName, fileUrl } = req.body;

            if (!profileId) {
                return res.status(400).json({ error: 'Profile ID is required' });
            }

            // Check if profile exists
            const profileResult = await pool.query('SELECT id FROM profiles WHERE user_id = $1', [profileId]);
            if (profileResult.rows.length === 0) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            // Update profile with file URL
            await pool.query(
                'UPDATE profiles SET pdf_url = $1 WHERE user_id = $2',
                [fileUrl || 'https://example.com/placeholder.pdf', profileId]
            );

            return res.status(201).json({
                message: 'File info recorded successfully',
                fileUrl: fileUrl || 'https://example.com/placeholder.pdf'
            });
        }

        // In a real app with multer middleware:
        const { profileId } = req.body;
        if (!profileId) {
            return res.status(400).json({ error: 'Profile ID is required' });
        }

        // Check if profile exists
        const profileResult = await pool.query('SELECT id FROM profiles WHERE user_id = $1', [profileId]);
        if (profileResult.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // For this example, we'll simulate a successful upload
        const fileUrl = `https://example.com/uploads/${req.file.filename || 'document.pdf'}`;

        // Update profile with file URL
        await pool.query(
            'UPDATE profiles SET pdf_url = $1 WHERE user_id = $2',
            [fileUrl, profileId]
        );

        res.status(201).json({
            message: 'File uploaded successfully',
            fileUrl
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
}

// Get file information
export async function getFile(req, res) {
    try {
        const { fileId } = req.params;

        // In a real app, you would query your database or storage service
        // to get file information

        res.json({
            id: fileId,
            name: 'health_document.pdf',
            url: `https://example.com/uploads/${fileId}.pdf`,
            uploadedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ error: 'Failed to fetch file information' });
    }
}

// Delete a file
export async function deleteFile(req, res) {
    try {
        const { fileId } = req.params;
        const { profileId } = req.body;

        if (!profileId) {
            return res.status(400).json({ error: 'Profile ID is required' });
        }

        // In a real app, you would:
        // 1. Delete the file from your storage service
        // 2. Update the profile to remove the file reference

        // Update profile to remove file URL
        await pool.query(
            'UPDATE profiles SET pdf_url = NULL WHERE user_id = $1',
            [profileId]
        );

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
}