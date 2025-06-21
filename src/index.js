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

app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/files', fileRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});