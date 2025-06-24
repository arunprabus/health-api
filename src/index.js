import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Configure environment variables first, so they're available to all modules
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import s3Routes from './routes/s3.routes.js';
import documentRoutes from './routes/document.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import pool from './utils/db.js';
import runMigrations from './utils/run-migrations.js';
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use base path everywhere
const basePath = process.env.API_BASE_PATH || '/api';

// Add a simple health check endpoint
app.get(`${basePath}/health`, (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ✅ Register routes with basePath
app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/profile`, profileRoutes);
app.use(`${basePath}/upload`, uploadRoutes);
app.use(`${basePath}/s3`, s3Routes);
app.use(`${basePath}/document`, documentRoutes);

// ✅ Error handling middleware (should be after all routes)
app.use(errorHandler);

// ✅ Start server
const PORT = parseInt(process.env.PORT, 10) || 8080;

// Function to try starting the server with fallback ports
const startServer = (port) => {
    // Ensure port is a number
    const portNumber = parseInt(port, 10);

    if (isNaN(portNumber) || portNumber < 0 || portNumber >= 65536) {
        console.error(`Invalid port: ${port}. Using default port 3000.`);
        port = 3000;
    }

    try {
        const server = app.listen(portNumber, () => {
            console.log(`🚀 Server running on port ${portNumber} with basePath '${basePath}'`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                const nextPort = portNumber + 1;
                console.log(`⚠️ Port ${portNumber} is already in use, trying ${nextPort}...`);
                startServer(nextPort);
            } else {
                console.error('Server error:', error);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Test database connection and run migrations before starting server
async function initializeServer() {
    try {
        // Test database connection
        console.log('Testing database connection...');
        const client = await pool.connect();
        console.log('✅ Database connection successful!');
        client.release();

        // Run migrations
        await runMigrations();

        // Start the server
        startServer(PORT);
    } catch (error) {
        console.error('❌ Server initialization failed:', error);
        console.error('Please check your database connection and credentials.');
        process.exit(1);
    }
}

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    pool.end();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Server terminated gracefully...');
    pool.end();
    process.exit(0);
});

// Initialize server
initializeServer();
