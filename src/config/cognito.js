import dotenv from 'dotenv';
dotenv.config();

export const COGNITO_CONFIG = {
    region: process.env.AWS_REGION,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID
};

// Validate required config
if (!COGNITO_CONFIG.userPoolId || !COGNITO_CONFIG.clientId || !COGNITO_CONFIG.region) {
    console.error('Missing Cognito configuration:', COGNITO_CONFIG);
    throw new Error('Missing required Cognito environment variables');
}