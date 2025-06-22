import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { COGNITO_CONFIG } from '../config/cognito.js';

// Create JWT verifier for Cognito
const verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_CONFIG.userPoolId,
    tokenUse: 'access',
    clientId: COGNITO_CONFIG.clientId,
});

export const authenticateCognito = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authorization.split(' ')[1];

        // Verify the JWT token with Cognito
        const payload = await verifier.verify(token);
        
        // Extract user info from token
        req.user = {
            id: payload.sub, // Cognito user ID
            email: payload.email,
            username: payload.username
        };

        next();
    } catch (error) {
        console.error('Cognito authentication error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};