#!/bin/bash

# Health API Smoke Test Runner
# Usage: ./run-smoke-tests.sh [API_BASE_URL]

set -e

# Default API URL
API_BASE_URL=${1:-"http://localhost:8080/api"}

echo "🔧 Setting up smoke tests..."

# Navigate to tests directory
cd tests

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing test dependencies..."
    npm install
fi

# Set environment variable and run tests
echo "🚀 Running smoke tests against: $API_BASE_URL"
export API_BASE_URL=$API_BASE_URL
npm run smoke