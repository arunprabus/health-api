// routes/profiles.routes.js
import express from 'express';
import pool from '../utils/db.js';
import { authenticateCognito } from '../middleware/cognito.middleware.js';
import { validateProfile } from '../middleware/validation.js';

const router = express.Router();

// 🔐 Require Cognito authentication for all profile routes
router.use(authenticateCognito);

// ✅ POST /api/profile - Create profile for new user
router.post('/', validateProfile, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, blood_group, insurance_provider, insurance_number, pdf_url } = req.body;

        const result = await pool.query(
            `INSERT INTO profiles (id, name, blood_group, insurance_provider, insurance_number, pdf_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, name, blood_group, insurance_provider, insurance_number, pdf_url]
        );

        res.status(201).json({ success: true, message: 'Profile created successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error creating profile:', error);
        if (error.code === '23505') { // Duplicate key error
            res.status(400).json({ success: false, error: 'Profile already exists' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to create profile' });
        }
    }
});

// ✅ GET /api/profile - Get logged-in user's profile
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching own profile:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
});

// ✅ PUT /api/profile - Update logged-in user's profile
router.put('/', validateProfile, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, blood_group, insurance_provider, insurance_number, pdf_url } = req.body;

        const result = await pool.query(
            `UPDATE profiles
       SET name = $1,
           blood_group = $2,
           insurance_provider = $3,
           insurance_number = $4,
           pdf_url = $5
       WHERE id = $6
       RETURNING *`,
            [name, blood_group, insurance_provider, insurance_number, pdf_url, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
});

export default router;
