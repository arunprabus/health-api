// src/routes/auth.routes.js

import express from 'express';
import { cognitoSignup, cognitoLogin } from '../controllers/cognito.controller.js';

const router = express.Router();

// Cognito auth
router.post('/signup', cognitoSignup);
router.post('/login', cognitoLogin);

export default router;
