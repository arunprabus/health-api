const db = require('../services/db.service');

exports.createProfile = async (req, res) => {
    try {
        const { name, age, blood_group, insurance_number } = req.body;
        const result = await db.query(
            `INSERT INTO profiles (name, age, blood_group, insurance_number)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, age, blood_group, insurance_number]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
