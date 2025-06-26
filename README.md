# Health API

A secure REST API for managing health profiles with AWS Cognito authentication and S3 document storage.

## Features

- 🔐 **AWS Cognito Authentication** - Secure user signup and login
- 👤 **Profile Management** - Create and update health profiles
- 📄 **Document Upload** - Secure S3 file storage for health documents
- 🧪 **Comprehensive Testing** - Unit tests and smoke tests
- 🐳 **Docker Support** - Containerized deployment
- ☸️ **Kubernetes Ready** - K8s manifests included

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- AWS account with Cognito and S3 configured

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd health-api
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your values (see Environment Variables table below)
```

### Sample .env Configuration
```bash
# Database Configuration
DB_HOST=your-db.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-secure-password

# AWS Configuration
USE_COGNITO=true
AWS_REGION=ap-south-1
COGNITO_USER_POOL_ID=ap-south-1_xxxxxxxxx
COGNITO_CLIENT_ID=your-client-id

# S3 Configuration
S3_BUCKET_NAME=your-health-documents
S3_REGION=ap-south-1

# Application Configuration
PORT=8080
NODE_ENV=development
```

3. **Start the server:**
```bash
npm start
```

The API will be available at `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login

### Profile Management
- `POST /api/profile` - Create health profile
- `GET /api/profile` - Get user's profile
- `PUT /api/profile` - Update profile

### File Upload
- `POST /api/upload` - Upload health document

### Health Check
- `GET /api/health` - API health status

## Environment Variables

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `DB_HOST` | PostgreSQL host | `your-db.region.rds.amazonaws.com` | ✅ |
| `DB_PORT` | PostgreSQL port | `5432` | ✅ |
| `DB_NAME` | Database name | `postgres` | ✅ |
| `DB_USER` | Database user | `postgres` | ✅ |
| `DB_PASSWORD` | Database password | `your-secure-password` | ✅ |
| `AWS_REGION` | AWS region | `ap-south-1` | ✅ |
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID | `ap-south-1_xxxxxxxxx` | ✅ |
| `COGNITO_CLIENT_ID` | Cognito App Client ID | `your-client-id` | ✅ |
| `S3_BUCKET_NAME` | S3 bucket for documents | `your-health-documents` | ✅ |
| `S3_REGION` | S3 region | `ap-south-1` | ✅ |
| `USE_COGNITO` | Enable Cognito auth | `true` | ✅ |
| `PORT` | Server port | `8080` | ❌ |
| `NODE_ENV` | Environment | `production` | ❌ |

## Testing

### Run All Tests
```bash
cd tests
npm install
npm test          # Unit tests
npm run smoke     # Smoke tests
npm run test:coverage  # Coverage report
```

### Reset Database & AWS Resources
```bash
# Complete reset (database + Cognito + S3)
npm run reset

# Windows batch file with confirmation
reset-db.bat

# Direct script execution
node scripts/reset-db.js
```

## Release Process

This project follows a Maven-like release process with development snapshots and feature branches:

### Branch Structure
- `fet-*` - Feature branches with SNAPSHOT versions (e.g., `fet-docker-build-push`)
- `main` - Release branch with stable versions

### Release Instructions

1. **Development Phase**:
   - Create a feature branch with prefix `fet-*` from main
   - Work on your feature with SNAPSHOT version in package.json
   - Commit and push changes to your feature branch

2. **Prepare for Release**:
   - Complete feature development and testing
   - Create a pull request from your feature branch to main
   - Run `npm run version:release` to remove SNAPSHOT suffix
   - Commit the version change and push to your feature branch

3. **Release Process**:
   - Merge the approved pull request to main
   - GitHub Actions will automatically:
     - Create a release tag based on the version
     - Build and push Docker images with version tag
     - Update version to next SNAPSHOT for future development

4. **Start Next Development Cycle**:
   - Create a new feature branch from updated main
   - Continue development with the new SNAPSHOT version

### Version Commands
```bash
# Create a new feature branch
npm run feature my-new-feature

# Set next snapshot version (increments minor version by default)
npm run version:snapshot

# Set next snapshot version with specific increment type
npm run version:snapshot:patch  # Increment patch version
npm run version:snapshot:minor  # Increment minor version
npm run version:snapshot:major  # Increment major version

# Set release version (removes SNAPSHOT suffix)
npm run version:release
```

### Manual Release Trigger
You can also manually trigger a release from GitHub Actions:
1. Go to the Actions tab in GitHub
2. Select "Release Process" workflow
3. Click "Run workflow"
4. Select release type (patch, minor, major)
5. Click "Run workflow"

This will create a release with the specified version increment.

## Docker Deployment

```bash
# Build image
docker build -t health-api .

# Run container
docker run -p 8080:8080 --env-file .env health-api
```

## Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## Project Structure

```
health-api/
├── src/
│   ├── config/          # AWS Cognito configuration
│   ├── controllers/     # Authentication controllers
│   ├── middleware/      # Auth, validation, logging, rate limiting
│   ├── routes/          # API routes (auth, profile, upload)
│   ├── utils/           # Database connection & migrations
│   └── index.js         # Application entry point
├── tests/
│   ├── unit/            # Unit tests for middleware & controllers
│   ├── smoke-tests.js   # End-to-end API tests
│   └── jest.config.js   # Test configuration
├── scripts/
│   └── reset-db.js      # Database & AWS cleanup utility
├── docs/
│   ├── API.md           # API documentation
│   └── DEPLOYMENT.md    # Deployment guide
├── k8s/                 # Kubernetes manifests
└── *.bat                # Windows utility scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details