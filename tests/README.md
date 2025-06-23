# Health API Test Suite

Comprehensive testing suite including unit tests and smoke tests for the Health API.

## Test Types

### Unit Tests
- **Validation Middleware** - Tests profile validation logic
- **Error Handler** - Tests error handling middleware
- **Cognito Controller** - Tests authentication logic (mocked)

### Smoke Tests
1. **Health Check** - Verifies API is running and responsive
2. **User Signup** - Creates a new test user account
3. **User Login** - Authenticates the test user and retrieves JWT token
4. **Create Profile** - Creates a health profile for the authenticated user
5. **Get Profile** - Retrieves the user's profile data
6. **Update Profile** - Updates the user's profile information

## Running the Tests

### Quick Start (Windows)
```bash
# Run all tests
run-tests.bat

# Run only unit tests
run-tests.bat unit

# Run only smoke tests
run-tests.bat smoke

# Run with coverage
run-tests.bat coverage
```

### Smoke Tests Only
```bash
run-smoke-tests.bat
# Or with custom API URL:
run-smoke-tests.bat http://your-api-url/api
```

### Manual Execution

1. Navigate to the tests directory:
```bash
cd tests
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# Smoke tests (default localhost:8080)
npm run smoke

# Smoke tests with custom API URL
API_BASE_URL=http://your-api-url/api npm run smoke
```

## Environment Variables

- `API_BASE_URL`: Base URL of the API (default: `http://localhost:8080/api`)

## Test Output

The tests will show real-time progress with emojis:
- ⏳ Test running
- ✅ Test passed
- ❌ Test failed

Final summary shows total passed/failed tests and exits with appropriate code (0 for success, 1 for failure).

## Integration with CI/CD

Add to your deployment pipeline:

```yaml
# Example GitHub Actions step
- name: Run Smoke Tests
  run: |
    chmod +x run-smoke-tests.sh
    ./run-smoke-tests.sh ${{ env.API_URL }}
```

## Notes

- Each test run creates a unique test user to avoid conflicts
- Tests include 1-second delays between operations for stability
- Authentication token is automatically managed between tests
- Tests will fail fast if critical dependencies (like login) fail