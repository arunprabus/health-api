import { CognitoIdentityProviderClient, DescribeUserPoolCommand, AdminConfirmSignUpCommand, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import dotenv from 'dotenv';

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({ 
    region: process.env.AWS_REGION || 'ap-south-1'
});

const checkCognitoConfig = async () => {
    try {
        console.log('🔍 Checking Cognito User Pool configuration...');
        
        if (!process.env.COGNITO_USER_POOL_ID) {
            console.error('❌ COGNITO_USER_POOL_ID not found in .env');
            return;
        }
        
        // Get User Pool details
        const describeCommand = new DescribeUserPoolCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID
        });
        
        const userPool = await cognitoClient.send(describeCommand);
        const config = userPool.UserPool;
        
        console.log('📋 User Pool Configuration:');
        console.log(`   Name: ${config.Name}`);
        console.log(`   Status: ${config.Status}`);
        console.log(`   Email Verification: ${config.AutoVerifiedAttributes?.includes('email') ? '✅ Enabled' : '❌ Disabled'}`);
        console.log(`   Email Configuration: ${config.EmailConfiguration ? '✅ Configured' : '❌ Not configured'}`);
        
        if (config.EmailConfiguration) {
            console.log(`   Email Source: ${config.EmailConfiguration.SourceArn ? 'SES' : 'Cognito Default'}`);
        }
        
        // List unconfirmed users
        const listCommand = new ListUsersCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Filter: 'cognito:user_status = "UNCONFIRMED"'
        });
        
        const users = await cognitoClient.send(listCommand);
        
        if (users.Users && users.Users.length > 0) {
            console.log('\n👥 Unconfirmed Users:');
            users.Users.forEach(user => {
                const email = user.Attributes?.find(attr => attr.Name === 'email')?.Value;
                console.log(`   📧 ${email} - Status: ${user.UserStatus}`);
            });
            
            console.log('\n💡 Options to fix:');
            console.log('   1. Check spam/junk folder for confirmation email');
            console.log('   2. Run: npm run confirm-user <email>');
            console.log('   3. Resend confirmation email from AWS Console');
        } else {
            console.log('\n✅ No unconfirmed users found');
        }
        
    } catch (error) {
        console.error('❌ Error checking Cognito:', error.message);
        
        if (error.name === 'ResourceNotFoundException') {
            console.error('💡 User Pool not found. Check COGNITO_USER_POOL_ID');
        } else if (error.name === 'AccessDeniedException') {
            console.error('💡 Access denied. Check AWS credentials and permissions');
        }
    }
};

checkCognitoConfig();