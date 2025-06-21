# API Usage Guide

This document provides instructions for using the Health API endpoints.

## Authentication

Currently, the API is using a simplified authentication approach. For production, JWT-based authentication will be implemented.

### For testing:

Include a `userId` header in your requests:

```
userId: user-uuid-here
```

## Profile Management

### Create a Profile

**Note:** Profiles are automatically created when a user signs up. This endpoint is only needed in special cases.

**Endpoint:** `POST /api/profiles`

**Request Body:**

```json
{
  "user_id": "f63182c0-ce01-4658-a2a1-d2d021a3d7fc",
  "name": "John Doe",
  "blood_group": "O+",
  "insurance_provider": "Health Insurance Co",
  "insurance_number": "HIC123456789",
  "pdf_url": "https://example.com/documents/john-doe-health.pdf"
}
```

**Response:**

```json
{
  "id": "f63182c0-ce01-4658-a2a1-d2d021a3d7fc",
  "name": "John Doe",
  "blood_group": "O+",
  "insurance_provider": "Health Insurance Co",
  "insurance_number": "HIC123456789",
  "pdf_url": "https://example.com/documents/john-doe-health.pdf",
  "created_at": "2025-06-21T12:34:56.789Z"
}
```

### Get Profile by ID

**Endpoint:** `GET /api/profiles/:id`

**Response:**

```json
{
  "id": "f63182c0-ce01-4658-a2a1-d2d021a3d7fc",
  "name": "John Doe",
  "blood_group": "O+",
  "insurance_provider": "Health Insurance Co",
  "insurance_number": "HIC123456789",
  "pdf_url": "https://example.com/documents/john-doe-health.pdf",
  "created_at": "2025-06-21T12:34:56.789Z"
}
```

### Update Profile

**Endpoint:** `PUT /api/profiles/:id` or `POST /api/profiles/:id`

**Request Body:** (Include only fields you want to update)

```json
{
  "blood_group": "AB+",
  "insurance_provider": "New Health Insurance"
}
```

**Note:** Both PUT and POST methods are supported for updating profiles. Use whichever is more convenient for your client application.

**Response:**

```json
{
  "id": "f63182c0-ce01-4658-a2a1-d2d021a3d7fc",
  "name": "John Doe",
  "blood_group": "AB+",
  "insurance_provider": "New Health Insurance",
  "insurance_number": "HIC123456789",
  "pdf_url": "https://example.com/documents/john-doe-health.pdf",
  "created_at": "2025-06-21T12:34:56.789Z"
}
```

### Delete Profile

**Endpoint:** `DELETE /api/profiles/:id`

**Response:**

```json
{
  "message": "Profile deleted successfully"
}
```

## File Management

### Upload File

**Endpoint:** `POST /api/files/upload`

**Request:** Multipart form data with:
- `file`: The file to upload
- `profileId`: ID of the profile to associate with the file

**Response:**

```json
{
  "message": "File uploaded successfully",
  "fileUrl": "https://example.com/uploads/filename.pdf"
}
```

### Get File Information

**Endpoint:** `GET /api/files/:fileId`

**Response:**

```json
{
  "id": "file-id-here",
  "name": "health_document.pdf",
  "url": "https://example.com/uploads/file-id-here.pdf",
  "uploadedAt": "2025-06-21T12:34:56.789Z"
}
```

### Delete File

**Endpoint:** `DELETE /api/files/:fileId`

**Request Body:**

```json
{
  "profileId": "profile-id-here"
}
```

**Response:**

```json
{
  "message": "File deleted successfully"
}
```

## Health Check

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-06-21T12:34:56.789Z",
  "environment": "development"
}
```
