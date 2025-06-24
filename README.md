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
# Edit .env with your database and AWS credentials
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

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | PostgreSQL host | ✅ |
| `DB_PORT` | PostgreSQL port | ✅ |
| `DB_NAME` | Database name | ✅ |
| `DB_USER` | Database user | ✅ |
| `DB_PASSWORD` | Database password | ✅ |
| `AWS_REGION` | AWS region | ✅ |
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID | ✅ |
| `COGNITO_CLIENT_ID` | Cognito App Client ID | ✅ |
| `S3_BUCKET_NAME` | S3 bucket for documents | ✅ |
| `S3_REGION` | S3 region | ✅ |
| `PORT` | Server port (default: 8080) | ❌ |

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