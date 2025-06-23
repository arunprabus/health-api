# Health API - Backend Microservice

A Node.js REST API for health profile management with AWS Cognito authentication.

## Features

- 🔐 AWS Cognito Authentication
- 👤 User Profile Management (CRUD)
- 🐳 Docker Support
- ☸️ Kubernetes Ready
- 🚀 CI/CD with GitHub Actions

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/profile/` - Get user profile
- `POST /api/profile/` - Create user profile
- `PUT /api/profile/` - Update user profile
- `GET /api/health` - Health check

## Local Development

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your values

# Run locally
npm run dev

# Run with Docker
docker-compose up --build
```

## Environment Variables

```env
AWS_REGION=ap-south-1
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=postgres
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

## Deployment

This microservice deploys to an existing EKS cluster. Infrastructure is managed separately in the `health-api-infrastructure` repository.

### Manual Deployment
1. Go to Actions → "Build and Deploy to EKS"
2. Click "Run workflow"
3. Select environment (auto/dev/prod)

### Environment URLs
- **Production (master branch)**: `yourdomain.com`
- **Development (feature branches)**: `branchname.yourdomain.com`

## Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   AWS Cognito   │    │  Health API  │    │ PostgreSQL  │
│ (Authentication)│◄──►│(Node.js/Express)│◄──►│ (Database)  │
└─────────────────┘    └──────────────┘    └─────────────┘
```

## Infrastructure

Infrastructure components (EKS, VPC, ECR) are managed in a separate repository:
- Repository: `health-api-infrastructure`
- Technology: Terraform
- Components: EKS Cluster, ECR, VPC, ALB