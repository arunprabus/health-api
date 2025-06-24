# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Authentication

#### User Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "message": "Signup successful. Please check your email for verification.",
  "userSub": "user-uuid"
}
```

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "idToken": "jwt-id-token"
}
```

### Profile Management

#### Create Profile
```http
POST /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "blood_group": "O+",
  "insurance_provider": "Health Insurance Co",
  "insurance_number": "HIC123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile created successfully. You can now upload your document.",
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "blood_group": "O+",
    "insurance_provider": "Health Insurance Co",
    "insurance_number": "HIC123456",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Profile
```http
GET /profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "blood_group": "O+",
    "insurance_provider": "Health Insurance Co",
    "insurance_number": "HIC123456",
    "pdf_url": "https://s3-bucket-url/document.pdf",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "blood_group": "AB+",
  "insurance_provider": "New Insurance Co",
  "insurance_number": "NEW123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Smith",
    "blood_group": "AB+",
    "insurance_provider": "New Insurance Co",
    "insurance_number": "NEW123456",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### File Upload

#### Upload Document
```http
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

[file data]
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileUrl": "https://s3-bucket-url/user-uuid/document.pdf",
  "profile": {
    "id": "user-uuid",
    "pdf_url": "https://s3-bucket-url/user-uuid/document.pdf",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "\"name\" is required"
}
```

### Unauthorized (401)
```json
{
  "error": "Unauthorized",
  "details": "Invalid or missing authentication"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Profile not found"
}
```

### Rate Limited (429)
```json
{
  "error": "Too many requests",
  "retryAfter": 900
}
```

### Server Error (500)
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** Rate limit info included in response headers
- **Exceeded:** Returns 429 status with retry-after time

## File Upload Constraints
- **Max Size:** 10MB
- **Allowed Types:** PDF, JPEG, PNG
- **Storage:** AWS S3 with server-side encryption
- **Naming:** Files stored as `{userId}/document.{extension}`