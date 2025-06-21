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

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, hashedPassword]
        );

        res.status(201).json({ message: 'Signup successful', user: result.rows[0] });
    } catch (error) {
        next(error);
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

        // Generate JWT (we'll improve this later)
        res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    } catch (error) {
        next(error);
    }
};
