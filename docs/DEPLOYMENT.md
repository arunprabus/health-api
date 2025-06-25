# Deployment Guide

## Prerequisites

- AWS Account with appropriate permissions
- Docker installed
- kubectl configured (for Kubernetes deployment)
- PostgreSQL database
- AWS Cognito User Pool configured
- S3 bucket created

## Environment Setup

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE health_api;

-- Tables will be created automatically via migrations
```

### 2. AWS Cognito Setup
1. Create User Pool in AWS Cognito
2. Create App Client (disable client secret)
3. Configure sign-up and sign-in attributes
4. Note down User Pool ID and Client ID

### 3. S3 Bucket Setup
1. Create S3 bucket for document storage
2. Configure appropriate bucket policy
3. Enable server-side encryption

## Deployment Options

### Option 1: Docker Deployment

```bash
# Build image
docker build -t health-api .

# Run container
docker run -d \
  --name health-api \
  -p 8080:8080 \
  --env-file .env \
  health-api
```

### Option 2: Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment
kubectl get pods
kubectl get services
```

### Option 3: AWS ECS Deployment

1. Push image to ECR
2. Create ECS task definition
3. Create ECS service
4. Configure load balancer

## Environment Variables

Create `.env` file with:

```bash
# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=health_api
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# AWS Configuration
AWS_REGION=ap-south-1
COGNITO_USER_POOL_ID=ap-south-1_xxxxxxxxx
COGNITO_CLIENT_ID=your-client-id

# S3 Configuration
S3_BUCKET_NAME=your-bucket-name
S3_REGION=ap-south-1

# Application
PORT=8080
NODE_ENV=production
```

## Health Checks

The application includes health check endpoints:

- **HTTP Health Check:** `GET /api/health`
- **Docker Health Check:** Built into Dockerfile
- **Kubernetes Liveness:** Configured in deployment.yaml

## Monitoring

### Logs
```bash
# Docker logs
docker logs health-api

# Kubernetes logs
kubectl logs -f deployment/health-api
```

### Metrics
- Request logging enabled by default
- Rate limiting metrics available
- Database connection monitoring

## Security Considerations

1. **Environment Variables:** Never commit `.env` files
2. **HTTPS:** Use HTTPS in production
3. **Rate Limiting:** Configured for 100 requests/15 minutes
4. **CORS:** Configure appropriate origins
5. **Database:** Use connection pooling and SSL
6. **S3:** Enable server-side encryption
7. **Cognito:** Use appropriate password policies

## Scaling

### Horizontal Scaling
- Multiple container instances
- Load balancer configuration
- Database connection pooling

### Vertical Scaling
- Increase container resources
- Database performance tuning
- S3 transfer acceleration

## Backup Strategy

1. **Database:** Regular PostgreSQL backups
2. **S3 Files:** Cross-region replication
3. **Configuration:** Version control all configs

## Rollback Procedure

1. **Docker:** Use previous image tag
2. **Kubernetes:** `kubectl rollout undo deployment/health-api`
3. **Database:** Restore from backup if needed

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check connection string
   - Verify network connectivity
   - Check credentials

2. **Cognito Authentication Failed**
   - Verify User Pool ID and Client ID
   - Check AWS credentials
   - Ensure proper IAM permissions

3. **S3 Upload Failed**
   - Check bucket permissions
   - Verify AWS credentials
   - Check bucket policy

4. **High Memory Usage**
   - Check for memory leaks
   - Increase container limits
   - Review file upload sizes

### Debug Commands

```bash
# Check container status
docker ps
docker logs health-api

# Check Kubernetes status
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# Test database connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Test S3 access
aws s3 ls s3://$S3_BUCKET_NAME
```