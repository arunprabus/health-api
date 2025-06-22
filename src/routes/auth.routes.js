// src/routes/auth.routes.js

import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { cognitoSignup, cognitoLogin } from '../controllers/cognito.controller.js';

const router = express.Router();

// Local auth (existing)
router.post('/signup', signup);
router.post('/login', login);

// Cognito auth (new)
router.post('/cognito/signup', cognitoSignup);
router.post('/cognito/login', cognitoLogin);

export default router;
