import pool from './db.js';

async function runMigrations() {
    console.log('Running database migrations...');

    try {
        // Create extension for UUID generation
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Drop all existing tables and constraints to start fresh
        await pool.query(`
            DROP TABLE IF EXISTS profiles CASCADE;
            DROP SCHEMA IF EXISTS public CASCADE;
            CREATE SCHEMA public;
            GRANT ALL ON SCHEMA public TO postgres;
            GRANT ALL ON SCHEMA public TO public;
        `);

        // Create profiles table with NO foreign key constraints
        await pool.query(`
            CREATE TABLE profiles (
                id UUID PRIMARY KEY,
                name VARCHAR(255),
                blood_group VARCHAR(10),
                insurance_provider VARCHAR(255),
                insurance_number VARCHAR(255),
                pdf_url TEXT,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Database migrations completed successfully!');
    } catch (error) {
        console.error('❌ Error running migrations:', error);
        throw error;
    }
}

// Run directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations().then(() => {
        console.log('🏁 Migration script completed, exiting...');
        process.exit(0);
    });
}

export default runMigrations;