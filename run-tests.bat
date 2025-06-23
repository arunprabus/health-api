@echo off
REM Health API Test Runner for Windows
REM Usage: run-tests.bat [unit|smoke|all]

setlocal

set TEST_TYPE=%1
if "%TEST_TYPE%"=="" set TEST_TYPE=all

echo 🔧 Setting up tests...
cd tests

if not exist "node_modules" (
    echo 📦 Installing test dependencies...
    npm install
)

if "%TEST_TYPE%"=="unit" (
    echo 🧪 Running unit tests...
    npm test
) else if "%TEST_TYPE%"=="smoke" (
    echo 💨 Running smoke tests...
    npm run smoke
) else if "%TEST_TYPE%"=="coverage" (
    echo 📊 Running tests with coverage...
    npm run test:coverage
) else (
    echo 🚀 Running all tests...
    echo.
    echo === Unit Tests ===
    npm test
    echo.
    echo === Smoke Tests ===
    npm run smoke
)