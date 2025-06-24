import { CognitoIdentityProviderClient, AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import dotenv from 'dotenv';

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({ 
    region: process.env.AWS_REGION || 'ap-south-1'
});

const confirmUser = async (email) => {
    try {
        if (!email) {
            console.error('❌ Please provide an email address');
            console.log('Usage: npm run confirm-user <email>');
            return;
        }
        
        console.log(`🔄 Confirming user: ${email}`);
        
        const command = new AdminConfirmSignUpCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: email
        });
        
        await cognitoClient.send(command);
        
        console.log('✅ User confirmed successfully!');
        console.log('💡 User can now login without email verification');
        
    } catch (error) {
        console.error('❌ Error confirming user:', error.message);
        
        if (error.name === 'UserNotFoundException') {
            console.error('💡 User not found. Check the email address');
        } else if (error.name === 'InvalidParameterException') {
            console.error('💡 User may already be confirmed');
        }
    }
};

const email = process.argv[2];
confirmUser(email);