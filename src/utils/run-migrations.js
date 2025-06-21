import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    console.log('Running database migrations...');

    try {
        // Read the migration file
        const migrationPath = path.join(__dirname, '../migrations/initial_tables.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        // Run the migration
        await pool.query(sql);

        console.log('✅ Database migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Export the function to be used in other files
export default runMigrations;

// Run migrations directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations().then(() => {
        console.log('Migration script completed, exiting...');
        process.exit(0);
    });
}
