import pool from '../utils/db.js';

/**
 * Middleware to verify if user exists
 * Later this can be expanded to verify JWT tokens
 */
export const authenticateUser = async (req, res, next) => {
    try {
        // For now, we'll just check if the user ID is valid
        // In a real app, you would verify a JWT token here
        const { userId } = req.headers;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const result = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        // Store user info in request object for later use
        req.user = { id: userId };
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
