import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment variables
const PROFILES_TABLE = process.env.DYNAMODB_PROFILES_TABLE || 'health-profiles-dev';
const UPLOADS_TABLE = process.env.DYNAMODB_UPLOADS_TABLE || 'health-profiles-dev-uploads';

// Profile data access layer
export class ProfileService {
  // Create a new profile
  static async createProfile(profileData) {
    const item = {
      PK: `PROFILE#${profileData.id}`,
      SK: `PROFILE#${profileData.id}`,
      id: profileData.id,
      name: profileData.name,
      bloodGroup: profileData.bloodGroup,
      insurance: profileData.insurance,
      email: profileData.email,
      idProof: profileData.idProof,
      user_id: profileData.user_id || 'anonymous',
      createdAt: profileData.createdAt,
      updatedAt: profileData.updatedAt,
      entityType: 'PROFILE'
    };

    const command = new PutCommand({
      TableName: PROFILES_TABLE,
      Item: item
    });

    await docClient.send(command);
    return item;
  }

  // Get profile by ID
  static async getProfileById(profileId) {
    const command = new GetCommand({
      TableName: PROFILES_TABLE,
      Key: {
        PK: `PROFILE#${profileId}`,
        SK: `PROFILE#${profileId}`
      }
    });

    const result = await docClient.send(command);
    return result.Item;
  }

  // Get all profiles
  static async getAllProfiles() {
    const command = new ScanCommand({
      TableName: PROFILES_TABLE,
      FilterExpression: 'entityType = :entityType',
      ExpressionAttributeValues: {
        ':entityType': 'PROFILE'
      }
    });

    const result = await docClient.send(command);
    return result.Items || [];
  }

  // Update profile
  static async updateProfile(profileId, updateData) {
    const command = new UpdateCommand({
      TableName: PROFILES_TABLE,
      Key: {
        PK: `PROFILE#${profileId}`,
        SK: `PROFILE#${profileId}`
      },
      UpdateExpression: 'SET #name = :name, bloodGroup = :bloodGroup, insurance = :insurance, email = :email, idProof = :idProof, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updateData.name,
        ':bloodGroup': updateData.bloodGroup,
        ':insurance': updateData.insurance,
        ':email': updateData.email,
        ':idProof': updateData.idProof,
        ':updatedAt': updateData.updatedAt
      },
      ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(command);
    return result.Attributes;
  }

  // Delete profile
  static async deleteProfile(profileId) {
    const command = new DeleteCommand({
      TableName: PROFILES_TABLE,
      Key: {
        PK: `PROFILE#${profileId}`,
        SK: `PROFILE#${profileId}`
      }
    });

    await docClient.send(command);
    return true;
  }

  // Query profiles by email (using GSI)
  static async getProfilesByEmail(email) {
    const command = new QueryCommand({
      TableName: PROFILES_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    });

    const result = await docClient.send(command);
    return result.Items || [];
  }
}

// File upload data access layer
export class FileUploadService {
  // Create file upload record
  static async createFileUpload(uploadData) {
    const item = {
      PK: `UPLOAD#${uploadData.id}`,
      SK: `UPLOAD#${uploadData.id}`,
      id: uploadData.id,
      profile_id: uploadData.profile_id,
      original_filename: uploadData.original_filename,
      stored_filename: uploadData.stored_filename,
      file_size: uploadData.file_size,
      mime_type: uploadData.mime_type,
      s3_url: uploadData.s3_url,
      upload_status: uploadData.upload_status || 'completed',
      createdAt: uploadData.createdAt,
      updatedAt: uploadData.updatedAt,
      entityType: 'UPLOAD'
    };

    const command = new PutCommand({
      TableName: UPLOADS_TABLE,
      Item: item
    });

    await docClient.send(command);
    return item;
  }

  // Get uploads by profile ID
  static async getUploadsByProfileId(profileId) {
    const command = new QueryCommand({
      TableName: UPLOADS_TABLE,
      IndexName: 'ProfileIndex',
      KeyConditionExpression: 'profile_id = :profile_id',
      ExpressionAttributeValues: {
        ':profile_id': profileId
      }
    });

    const result = await docClient.send(command);
    return result.Items || [];
  }

  // Get upload by ID
  static async getUploadById(uploadId) {
    const command = new GetCommand({
      TableName: UPLOADS_TABLE,
      Key: {
        PK: `UPLOAD#${uploadId}`,
        SK: `UPLOAD#${uploadId}`
      }
    });

    const result = await docClient.send(command);
    return result.Item;
  }
}