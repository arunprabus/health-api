import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { COGNITO_CONFIG } from '../config/cognito.js';
import pool from '../utils/db.js';

const cognitoClient = new CognitoIdentityProviderClient({ 
    region: COGNITO_CONFIG.region 
});

export const cognitoSignup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const command = new SignUpCommand({
            ClientId: COGNITO_CONFIG.clientId,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email }
            ]
        });

        const result = await cognitoClient.send(command);

        // Create user record in our database
        try {
            await pool.query(
                'INSERT INTO cognito_users (id, email, username) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
                [result.UserSub, email, email]
            );
        } catch (dbError) {
            console.log('User record creation skipped (may already exist):', dbError.message);
        }

        res.status(201).json({
            message: 'Signup successful. Please check your email for verification.',
            userSub: result.UserSub
        });
    } catch (error) {
        console.error('Cognito signup error:', error);
        res.status(400).json({ 
            error: error.message || 'Signup failed' 
        });
    }
};

export const cognitoLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const command = new InitiateAuthCommand({
            ClientId: COGNITO_CONFIG.clientId,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        });

        const result = await cognitoClient.send(command);

        // Decode the ID token to get user info
        const idTokenPayload = JSON.parse(Buffer.from(result.AuthenticationResult.IdToken.split('.')[1], 'base64').toString());
        
        // Create/update user record in our database
        try {
            await pool.query(
                'INSERT INTO cognito_users (id, email, username) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET username = $3',
                [idTokenPayload.sub, idTokenPayload.email, idTokenPayload['cognito:username'] || idTokenPayload.email]
            );
        } catch (dbError) {
            console.log('User record update skipped:', dbError.message);
        }
        
        res.json({
            message: 'Login successful',
            user: {
                id: idTokenPayload.sub,
                email: idTokenPayload.email
            },
            accessToken: result.AuthenticationResult.AccessToken,
            refreshToken: result.AuthenticationResult.RefreshToken,
            idToken: result.AuthenticationResult.IdToken
        });
    } catch (error) {
        console.error('Cognito login error:', error);
        res.status(401).json({ 
            error: error.message || 'Login failed' 
        });
    }
};