# Test Fix Plan

## Current Issues

1. **Jest Identifier Already Declared**
   - Error: `SyntaxError: Identifier 'jest' has already been declared`
   - Cause: Jest is being imported multiple times or declared globally in a way that conflicts

2. **ES Modules Compatibility**
   - Error: `Cannot use import statement outside a module`
   - Cause: Jest configuration not properly set up for ES modules

3. **Missing Environment Variables**
   - Error: `Missing required Cognito environment variables`
   - Cause: Tests require environment variables that aren't available

## Fix Plan

### Step 1: Update Test Files

For each test file, modify to use proper ES module imports:

```javascript
// Before
import { jest } from '@jest/globals';
// ... test code using jest directly

// After
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
// ... test code using imported functions
```

### Step 2: Remove Global Jest Setup

Remove the global jest setup that's causing conflicts:

1. Delete `jest.setup.js` and `jest.setup.cjs`
2. Remove `setupFilesAfterEnv` from Jest configs

### Step 3: Create Mock Environment for Tests

Create a proper test environment setup:

1. Create `tests/test-env.js`:
```javascript
// Set up test environment variables
process.env.COGNITO_USER_POOL_ID = 'test-pool-id';
process.env.COGNITO_CLIENT_ID = 'test-client-id';
process.env.AWS_REGION = 'us-east-1';
process.env.NODE_ENV = 'test';
```

2. Update Jest config to use this file:
```javascript
// jest.config.js
export default {
  // ...
  setupFiles: ['./test-env.js'],
  // ...
};
```

### Step 4: Mock External Dependencies

Create mocks for AWS services and other external dependencies:

```javascript
// __mocks__/@aws-sdk/client-cognito-identity-provider.js
export const CognitoIdentityProviderClient = jest.fn().mockImplementation(() => ({
  send: jest.fn().mockResolvedValue({})
}));

export const SignUpCommand = jest.fn();
export const InitiateAuthCommand = jest.fn();
// ... other commands
```

## Implementation Timeline

1. Create a separate branch for test fixes
2. Implement the changes in the order listed above
3. Verify tests pass locally
4. Create a PR to merge the test fixes
5. Once merged, re-enable tests in CI workflows