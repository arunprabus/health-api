# Scripts Documentation

## Database Reset Script

### Purpose
Completely resets the development environment by clearing:
- PostgreSQL database tables
- AWS Cognito users
- S3 bucket files

### Usage

**From project root:**
```bash
npm run reset
# or
npm run reset-db
# or
node scripts/reset-db.js
```

**Using batch file (Windows):**
```bash
reset-db.bat
```

### What it does

1. **Database Cleanup**
   - Truncates `profiles` table
   - Truncates `cognito_users` table
   - Resets auto-increment sequences

2. **Cognito Cleanup**
   - Lists all users in the User Pool
   - Deletes each user account
   - Requires `COGNITO_USER_POOL_ID` in .env

3. **S3 Cleanup**
   - Lists all objects in the bucket
   - Deletes all files recursively
   - Requires `S3_BUCKET_NAME` in .env

### Prerequisites

- Valid `.env` file with database and AWS credentials
- AWS credentials with appropriate permissions:
  - `cognito-idp:ListUsers`
  - `cognito-idp:AdminDeleteUser`
  - `s3:ListObjects`
  - `s3:DeleteObject`

### Error Handling

The script handles common errors gracefully:
- Database connection failures
- Missing AWS permissions
- Non-existent S3 buckets
- Network connectivity issues

### Safety Features

- **Confirmation prompt** (when using batch file)
- **Graceful error handling** - continues with other cleanup tasks
- **Detailed logging** - shows exactly what's being cleaned
- **Environment validation** - checks for required variables

### Example Output

```
🗑️ Resetting database and Cognito users...
📊 Truncating database tables...
✅ Database tables cleared
👥 Deleting Cognito users...
🗑️ Deleting user: test-user@example.com
✅ Deleted 2 Cognito users
📁 Clearing S3 bucket...
✅ Deleted 5 files from S3
🎉 Complete reset finished!
💡 You can now run your application with a clean slate!
```

### Troubleshooting

**Database connection failed:**
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in .env
- Ensure database is running and accessible

**Cognito access denied:**
- Verify AWS credentials have Cognito permissions
- Check `COGNITO_USER_POOL_ID` is correct

**S3 access denied:**
- Verify AWS credentials have S3 permissions
- Check `S3_BUCKET_NAME` exists and is accessible

**Partial failures:**
- Script continues with other cleanup tasks
- Check logs for specific error details
- Manual cleanup may be needed for failed resources