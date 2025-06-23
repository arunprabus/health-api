import { errorHandler } from '../../src/middleware/errorHandler.js';

describe('Error Handler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.NODE_ENV = 'test';
    });

    test('should handle ValidationError', () => {
        const error = new Error('Invalid input');
        error.name = 'ValidationError';

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Validation Error',
            details: 'Invalid input'
        });
    });

    test('should handle UnauthorizedError', () => {
        const error = new Error('Access denied');
        error.name = 'UnauthorizedError';

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Unauthorized',
            details: 'Invalid or missing authentication'
        });
    });

    test('should handle generic errors in development', () => {
        const error = new Error('Database connection failed');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal Server Error',
            message: 'Database connection failed'
        });
    });

    test('should hide error details in production', () => {
        process.env.NODE_ENV = 'production';
        const error = new Error('Database connection failed');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred'
        });
    });
});