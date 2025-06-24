import pool from '../src/utils/db.js';
import { CognitoIdentityProviderClient, ListUsersCommand, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({ 
    region: process.env.AWS_REGION || 'ap-south-1'
});

const s3Client = new S3Client({
    region: process.env.S3_REGION || process.env.AWS_REGION
});

const resetDatabase = async () => {
    try {
        console.log('🗑️ Resetting database and Cognito users...');
        
        // 1. Clear database tables
        console.log('📊 Truncating database tables...');
        await pool.query('TRUNCATE TABLE profiles RESTART IDENTITY CASCADE');
        await pool.query('TRUNCATE TABLE cognito_users RESTART IDENTITY CASCADE');
        console.log('✅ Database tables cleared');
        
        // 2. Delete Cognito users
        if (process.env.COGNITO_USER_POOL_ID) {
            console.log('👥 Deleting Cognito users...');
            
            const listCommand = new ListUsersCommand({
                UserPoolId: process.env.COGNITO_USER_POOL_ID
            });
            
            const users = await cognitoClient.send(listCommand);
            
            if (users.Users && users.Users.length > 0) {
                for (const user of users.Users) {
                    console.log(`🗑️ Deleting user: ${user.Username}`);
                    
                    const deleteCommand = new AdminDeleteUserCommand({
                        UserPoolId: process.env.COGNITO_USER_POOL_ID,
                        Username: user.Username
                    });
                    
                    await cognitoClient.send(deleteCommand);
                }
                console.log(`✅ Deleted ${users.Users.length} Cognito users`);
            } else {
                console.log('ℹ️ No Cognito users found');
            }
        } else {
            console.log('⚠️ COGNITO_USER_POOL_ID not found in .env - skipping Cognito cleanup');
        }
        
        // 3. Clear S3 bucket
        if (process.env.S3_BUCKET_NAME) {
            console.log('📁 Clearing S3 bucket...');
            
            const listCommand = new ListObjectsV2Command({
                Bucket: process.env.S3_BUCKET_NAME
            });
            
            const objects = await s3Client.send(listCommand);
            
            if (objects.Contents && objects.Contents.length > 0) {
                const deleteParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Delete: {
                        Objects: objects.Contents.map(obj => ({ Key: obj.Key }))
                    }
                };
                
                await s3Client.send(new DeleteObjectsCommand(deleteParams));
                console.log(`✅ Deleted ${objects.Contents.length} files from S3`);
            } else {
                console.log('ℹ️ No files found in S3 bucket');
            }
        } else {
            console.log('⚠️ S3_BUCKET_NAME not found in .env - skipping S3 cleanup');
        }
        
        console.log('🎉 Complete reset finished!');
        
    } catch (error) {
        console.error('❌ Reset failed:', error.message);
        if (error.name === 'AccessDeniedException') {
            console.error('💡 Make sure your AWS credentials have Cognito admin permissions');
        }
    } finally {
        await pool.end();
        process.exit(0);
    }
};

resetDatabase();