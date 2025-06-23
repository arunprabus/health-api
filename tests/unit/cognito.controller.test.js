import { cognitoSignup, cognitoLogin } from '../../src/controllers/cognito.controller.js';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

// Mock AWS SDK
jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('../../src/utils/db.js', () => ({
    query: jest.fn()
}));

describe('Cognito Controller', () => {
    let req, res, mockSend;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockSend = jest.fn();
        CognitoIdentityProviderClient.prototype.send = mockSend;
    });

    describe('cognitoSignup', () => {
        test('should successfully signup user', async () => {
            req.body = { email: 'test@example.com', password: 'Password123!' };
            mockSend.mockResolvedValue({ UserSub: 'user-123' });

            await cognitoSignup(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Signup successful. Please check your email for verification.',
                userSub: 'user-123'
            });
        });

        test('should handle signup error', async () => {
            req.body = { email: 'test@example.com', password: 'weak' };
            mockSend.mockRejectedValue(new Error('Password too weak'));

            await cognitoSignup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Password too weak'
            });
        });
    });

    describe('cognitoLogin', () => {
        test('should successfully login user', async () => {
            req.body = { email: 'test@example.com', password: 'Password123!' };
            
            const mockIdToken = Buffer.from(JSON.stringify({
                sub: 'user-123',
                email: 'test@example.com'
            })).toString('base64');
            
            mockSend.mockResolvedValue({
                AuthenticationResult: {
                    AccessToken: 'access-token',
                    RefreshToken: 'refresh-token',
                    IdToken: `header.${mockIdToken}.signature`
                }
            });

            await cognitoLogin(req, res);

            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                user: {
                    id: 'user-123',
                    email: 'test@example.com'
                },
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                idToken: `header.${mockIdToken}.signature`
            });
        });

        test('should handle login error', async () => {
            req.body = { email: 'test@example.com', password: 'wrong' };
            mockSend.mockRejectedValue(new Error('Invalid credentials'));

            await cognitoLogin(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Invalid credentials'
            });
        });
    });
});