# TODO: Fix Test Configuration

## Issues to Address

1. **Jest ES Modules Configuration**
   - Current tests are using ES modules (import/export) but Jest configuration is not properly set up
   - Error: "Cannot use import statement outside a module"

## Possible Solutions

1. **Update Jest Configuration**
   - Configure Jest to properly handle ES modules
   - Add proper Babel configuration if needed

2. **Convert Tests to CommonJS**
   - Convert test files to use CommonJS (require/module.exports) instead of ES modules

3. **Update Node.js Version**
   - Ensure Node.js version is compatible with ES modules in Jest

## Next Steps

1. Create a separate PR to fix the test configuration
2. Once tests are passing, remove the temporary test skipping in CI workflows
3. Re-enable test steps in all workflows