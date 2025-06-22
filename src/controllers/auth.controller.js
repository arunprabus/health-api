import bcrypt from 'bcrypt';
import pool from '../utils/db.js';

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Begin transaction
        await pool.query('BEGIN');

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const userResult = await pool.query(
                'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
                [email, hashedPassword]
            );
            const userId = userResult.rows[0].id;

            // Create initial profile using same UUID as users.id
            await pool.query(
                'INSERT INTO profiles (id, name) VALUES ($1, $2)',
                [userId, email.split('@')[0]]  // Example: name = "john" if email is "john@example.com"
            );

            await pool.query('COMMIT');

            res.status(201).json({ message: 'Signup successful', user: userResult.rows[0] });
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Transaction error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            error: 'Authentication failed. Please check server logs for details.',
            message: error.message
        });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Simple token (userId for now, upgrade to JWT later)
        const token = user.id;
        
        res.json({ 
            message: 'Login successful', 
            user: { id: user.id, email: user.email },
            token: token
        });
    } catch (error) {
        next(error);
    }
};
