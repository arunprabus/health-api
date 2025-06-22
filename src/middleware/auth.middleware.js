import pool from '../utils/db.js';

/**
 * Middleware to verify if user exists
 * Later this can be expanded to verify JWT tokens
 */
export const authenticateUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authorization.split(' ')[1];
        
        // Simple token format: userId (in production, use JWT)
        const userId = token;

        const result = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        req.user = { id: userId };
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
