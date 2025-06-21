import pool from './db.js';

async function runMigrations() {
    console.log('Running database migrations...');

    try {
        // Create extension for UUID generation
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                                                 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                )
        `);

        // Create profiles table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS profiles (
                                                    id SERIAL PRIMARY KEY,
                                                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255),
                blood_group VARCHAR(10),
                insurance_provider VARCHAR(255),
                insurance_number VARCHAR(255),
                pdf_url TEXT,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id)
                )
        `);

        // Create function to update timestamps
        await pool.query(`
            CREATE OR REPLACE FUNCTION trigger_set_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create triggers (idempotent pattern)
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_users'
                ) THEN
                    CREATE TRIGGER set_timestamp_users
                    BEFORE UPDATE ON users
                    FOR EACH ROW
                    EXECUTE PROCEDURE trigger_set_timestamp();
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_profiles'
                ) THEN
                    CREATE TRIGGER set_timestamp_profiles
                    BEFORE UPDATE ON profiles
                    FOR EACH ROW
                    EXECUTE PROCEDURE trigger_set_timestamp();
                END IF;
            END
            $$;
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
