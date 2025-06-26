# Test Fixes Required

## Issues Identified

1. **Jest Not Defined**
   - Error: `ReferenceError: jest is not defined`
   - Files affected: 
     - `unit/errorHandler.test.js`
     - `unit/validation.test.js`
     - `unit/rateLimiter.test.js`
   - Fix: Import jest from @jest/globals in each test file

2. **Missing Cognito Environment Variables**
   - Error: `Missing required Cognito environment variables`
   - Files affected: `unit/cognito.controller.test.js`
   - Fix: Add mock Cognito configuration for tests

## Required Changes

1. Update test files to import jest:
```javascript
import { jest } from '@jest/globals';
```

2. Create mock Cognito configuration for tests:
```javascript
// In tests setup
process.env.COGNITO_USER_POOL_ID = 'test-pool-id';
process.env.COGNITO_CLIENT_ID = 'test-client-id';
process.env.AWS_REGION = 'us-east-1';
```

3. Update Jest configuration to properly handle ES modules:
```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'mjs'],
  setupFiles: ['./jest.setup.js'], // Add setup file for environment variables
  testMatch: ['**/tests/unit/**/*.test.js'],
  // Other configuration...
};
```

## Implementation Plan

1. Create a separate PR to fix test configuration
2. Once tests are passing, re-enable test steps in CI workflows