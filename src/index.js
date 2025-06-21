const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./utils/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const healthRoutes = require('./routes/health.routes');
/** @type {import('express').Router} */
const profileRoutes = require('./routes/profile.js'); // Use `.js` if needed on Windows

const basePath = process.env.API_BASE_PATH || '/api';
app.use(`${basePath}/health`, healthRoutes);
app.use(`${basePath}/profiles`, profileRoutes);

app.get(`${basePath}/test-db`, async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).send('DB Error');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
