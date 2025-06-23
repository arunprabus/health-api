@echo off
REM Health API Smoke Test Runner for Windows
REM Usage: run-smoke-tests.bat [API_BASE_URL]

setlocal

REM Default API URL
if "%1"=="" (
    set API_BASE_URL=http://localhost:8080/api
) else (
    set API_BASE_URL=%1
)

echo 🔧 Setting up smoke tests...

REM Navigate to tests directory
cd tests

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing test dependencies...
    npm install
)

REM Set environment variable and run tests
echo 🚀 Running smoke tests against: %API_BASE_URL%
set API_BASE_URL=%API_BASE_URL%
npm run smoke