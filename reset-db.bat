@echo off
echo 🔄 Resetting Health API Database...
echo.
echo ⚠️  WARNING: This will delete ALL data!
set /p confirm="Are you sure? (y/N): "

if /i "%confirm%"=="y" (
    echo.
    echo 🗑️ Proceeding with database reset...
    node scripts/reset-db.js
) else (
    echo.
    echo ❌ Database reset cancelled.
)