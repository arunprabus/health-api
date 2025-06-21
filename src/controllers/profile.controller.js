import pool from '../utils/db.js';

// Get all profiles
export async function getProfiles(req, res) {
    try {
        const result = await pool.query(`
            SELECT p.*, u.email as user_email 
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
}

// Get profile by user ID
export async function getProfileById(req, res) {
    try {
        const { id } = req.params; // This is the user's UUID
        const result = await pool.query(`
            SELECT p.*, u.email as user_email 
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
}

// Create new profile (should rarely be needed as profiles are created with users)
export async function createProfile(req, res) {
    try {
        const { user_id, name, blood_group, insurance_provider, insurance_number, pdf_url } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Check if the user exists
        const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if profile already exists for this user
        const profileExists = await pool.query('SELECT id FROM profiles WHERE user_id = $1', [user_id]);
        if (profileExists.rows.length > 0) {
            return res.status(400).json({ error: 'Profile already exists for this user' });
        }

        const result = await pool.query(
            'INSERT INTO profiles (user_id, name, blood_group, insurance_provider, insurance_number, pdf_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [user_id, name, blood_group, insurance_provider, insurance_number, pdf_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Failed to create profile', message: error.message });
    }
}

// Update profile
export async function updateProfile(req, res) {
    try {
        const { id } = req.params; // This is the user's UUID
        const { name, blood_group, insurance_provider, insurance_number, pdf_url } = req.body;

        // Check if profile exists for this user
        const profileExists = await pool.query('SELECT id FROM profiles WHERE user_id = $1', [id]);
        if (profileExists.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found for this user' });
        }

        const result = await pool.query(
            `UPDATE profiles 
             SET name = COALESCE($1, name), 
                 blood_group = COALESCE($2, blood_group), 
                 insurance_provider = COALESCE($3, insurance_provider), 
                 insurance_number = COALESCE($4, insurance_number), 
                 pdf_url = COALESCE($5, pdf_url) 
             WHERE user_id = $6 
             RETURNING *`,
            [name, blood_group, insurance_provider, insurance_number, pdf_url, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile', message: error.message });
    }
}

// Delete profile
export async function deleteProfile(req, res) {
    try {
        const { id } = req.params; // This is the user's UUID

        // Check if profile exists
        const profileExists = await pool.query('SELECT id FROM profiles WHERE user_id = $1', [id]);
        if (profileExists.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        await pool.query('DELETE FROM profiles WHERE user_id = $1', [id]);

        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'Failed to delete profile', message: error.message });
    }
}