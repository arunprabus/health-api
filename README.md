# Health API

A Node.js + Express API for health profile management with file upload capabilities.

## Features

- **Profile Management**: CRUD operations for health profiles
- **File Upload**: PDF upload to AWS S3
- **Validation**: Input validation with Joi
- **Security**: Helmet.js security headers and CORS
- **Health Checks**: Built-in monitoring endpoints

## API Endpoints

### Profiles
- `GET /api/profile` - Get all profiles
- `GET /api/profile/:id` - Get specific profile
- `POST /api/profile` - Create new profile
- `PUT /api/profile/:id` - Update profile
- `DELETE /api/profile/:id` - Delete profile

### File Upload
- `POST /api/upload` - Upload PDF file to S3

### System
- `GET /health` - Health check endpoint
- `GET /` - API information

## Quick Start

### Development
```bash
npm install
cp .env.example .env
npm run dev
```

### Docker
```bash
docker build -t health-api .
docker run -p 3001:3001 \
  -e NODE_ENV=development \
  -e AWS_ACCESS_KEY_ID=your_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret \
  health-api
```

### Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Allowed frontend origin
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region
- `S3_BUCKET`: S3 bucket name
- `DB_URL`: Database connection string
- `JWT_SECRET`: JWT signing secret

## CI/CD

GitHub Actions automatically builds and pushes container images to GitHub Container Registry on push to main/develop branches.