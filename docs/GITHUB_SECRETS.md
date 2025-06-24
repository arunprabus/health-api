# GitHub Secrets Configuration

## Required GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

**Only add these sensitive secrets (replace with your actual values):**

```
DB_PASSWORD = your-secure-database-password
COGNITO_USER_POOL_ID = ap-south-1_xxxxxxxxx
COGNITO_CLIENT_ID = your-cognito-client-id
```

## GitHub Variables (Non-sensitive)

Go to your GitHub repository → Settings → Secrets and variables → Actions → Variables tab → New repository variable

**Add these variables (replace with your actual values):**

```
DB_HOST = your-db.region.rds.amazonaws.com
DB_PORT = 5432
DB_NAME = postgres
DB_USER = postgres
AWS_REGION = ap-south-1
S3_BUCKET_NAME = your-health-documents
S3_REGION = ap-south-1
USE_COGNITO = true
PORT = 8080
NODE_ENV = production
```

### Optional AWS Credentials (if not using IAM roles)
```
AWS_ACCESS_KEY_ID = your-access-key
AWS_SECRET_ACCESS_KEY = your-secret-key
```

## How GitHub Actions Uses Secrets

The CI/CD workflow will:
1. Create `.env` file from secrets during build
2. Use secrets for environment variables
3. Never expose secrets in logs

## Security Best Practices

1. **Never commit `.env` files** to repository
2. **Use least privilege** AWS IAM policies
3. **Rotate secrets regularly**
4. **Use environment-specific secrets** for different stages
5. **Monitor secret usage** in GitHub Actions logs

## Environment-Specific Secrets (Optional)

For multiple environments, prefix secrets:

### Development
```
DEV_DB_HOST
DEV_COGNITO_USER_POOL_ID
DEV_S3_BUCKET_NAME
```

### Production
```
PROD_DB_HOST
PROD_COGNITO_USER_POOL_ID
PROD_S3_BUCKET_NAME
```

## Verification

After adding secrets, trigger the workflow to verify:
1. Go to Actions tab
2. Run "Build and Push Health API" workflow
3. Check if build completes successfully
4. Verify Docker image is created