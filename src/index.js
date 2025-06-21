import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import fileRoutes from './routes/file.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use base path everywhere
const basePath = process.env.API_BASE_PATH || '/api';

// ✅ Register routes with basePath
app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/profiles`, profileRoutes);
app.use(`${basePath}/files`, fileRoutes);

// ✅ Error handling middleware (should be after all routes)
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} with basePath '${basePath}'`);
});
