import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';
const TEST_EMAIL = `test-${randomUUID()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';

let authToken = null;

// Test utilities
const makeRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken && !options.skipAuth) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    const data = await response.json();
    return { response, data };
};

const logTest = (testName, status, message = '') => {
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏳';
    console.log(`${emoji} ${testName}${message ? ': ' + message : ''}`);
};

// Test functions
const testHealthCheck = async () => {
    try {
        const { response, data } = await makeRequest('/health', { skipAuth: true });
        
        if (response.status === 200 && data.status === 'healthy') {
            logTest('Health Check', 'PASS');
            return true;
        } else {
            logTest('Health Check', 'FAIL', `Status: ${response.status}`);
            return false;
        }
    } catch (error) {
        logTest('Health Check', 'FAIL', error.message);
        return false;
    }
};

const testUserSignup = async () => {
    try {
        const { response, data } = await makeRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            }),
            skipAuth: true
        });

        if (response.status === 201 || response.status === 200) {
            logTest('User Signup', 'PASS');
            return true;
        } else {
            logTest('User Signup', 'FAIL', `Status: ${response.status}, Message: ${data.error || data.message}`);
            return false;
        }
    } catch (error) {
        logTest('User Signup', 'FAIL', error.message);
        return false;
    }
};

const testUserLogin = async () => {
    try {
        const { response, data } = await makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            }),
            skipAuth: true
        });

        if (response.status === 200 && data.token) {
            authToken = data.token;
            logTest('User Login', 'PASS');
            return true;
        } else {
            logTest('User Login', 'FAIL', `Status: ${response.status}, Message: ${data.error || data.message}`);
            return false;
        }
    } catch (error) {
        logTest('User Login', 'FAIL', error.message);
        return false;
    }
};

const testCreateProfile = async () => {
    try {
        const profileData = {
            name: 'Test User',
            blood_group: 'O+',
            insurance_provider: 'Test Insurance Co',
            insurance_number: 'TEST123456',
            pdf_url: 'https://example.com/test-document.pdf'
        };

        const { response, data } = await makeRequest('/profile', {
            method: 'POST',
            body: JSON.stringify(profileData)
        });

        if (response.status === 201 && data.success) {
            logTest('Create Profile', 'PASS');
            return true;
        } else {
            logTest('Create Profile', 'FAIL', `Status: ${response.status}, Message: ${data.error || data.message}`);
            return false;
        }
    } catch (error) {
        logTest('Create Profile', 'FAIL', error.message);
        return false;
    }
};

const testGetProfile = async () => {
    try {
        const { response, data } = await makeRequest('/profile');

        if (response.status === 200 && data.success && data.data) {
            logTest('Get Profile', 'PASS');
            return true;
        } else {
            logTest('Get Profile', 'FAIL', `Status: ${response.status}, Message: ${data.error || data.message}`);
            return false;
        }
    } catch (error) {
        logTest('Get Profile', 'FAIL', error.message);
        return false;
    }
};

const testUpdateProfile = async () => {
    try {
        const updatedData = {
            name: 'Updated Test User',
            blood_group: 'AB+',
            insurance_provider: 'Updated Insurance Co',
            insurance_number: 'UPDATED123456',
            pdf_url: 'https://example.com/updated-document.pdf'
        };

        const { response, data } = await makeRequest('/profile', {
            method: 'PUT',
            body: JSON.stringify(updatedData)
        });

        if (response.status === 200 && data.success) {
            logTest('Update Profile', 'PASS');
            return true;
        } else {
            logTest('Update Profile', 'FAIL', `Status: ${response.status}, Message: ${data.error || data.message}`);
            return false;
        }
    } catch (error) {
        logTest('Update Profile', 'FAIL', error.message);
        return false;
    }
};

// Main smoke test runner
const runSmokeTests = async () => {
    console.log('🚀 Starting Health API Smoke Tests');
    console.log(`📍 Testing against: ${API_BASE_URL}`);
    console.log(`👤 Test user: ${TEST_EMAIL}`);
    console.log('=' .repeat(50));

    const tests = [
        { name: 'Health Check', fn: testHealthCheck },
        { name: 'User Signup', fn: testUserSignup },
        { name: 'User Login', fn: testUserLogin },
        { name: 'Create Profile', fn: testCreateProfile },
        { name: 'Get Profile', fn: testGetProfile },
        { name: 'Update Profile', fn: testUpdateProfile }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        logTest(test.name, 'RUN');
        const result = await test.fn();
        
        if (result) {
            passed++;
        } else {
            failed++;
        }
        
        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('=' .repeat(50));
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log('🎉 All smoke tests passed! API is ready for use.');
        process.exit(0);
    } else {
        console.log('⚠️  Some tests failed. Please check the API deployment.');
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the tests
runSmokeTests().catch(error => {
    console.error('❌ Smoke tests failed with error:', error);
    process.exit(1);
});