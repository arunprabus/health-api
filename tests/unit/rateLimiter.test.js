import { rateLimiter } from '../../src/middleware/rateLimiter.js';

describe('Rate Limiter Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { ip: '127.0.0.1' };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('should allow requests under limit', () => {
        const limiter = rateLimiter(5, 60000);
        
        limiter(req, res, next);
        
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('should block requests over limit', () => {
        const limiter = rateLimiter(2, 60000);
        
        // Make 3 requests
        limiter(req, res, next);
        limiter(req, res, next);
        limiter(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Too many requests',
            retryAfter: 60
        });
    });

    test('should allow requests from different IPs', () => {
        const limiter = rateLimiter(1, 60000);
        const req2 = { ip: '192.168.1.1' };
        
        limiter(req, res, next);
        limiter(req2, res, next);
        
        expect(next).toHaveBeenCalledTimes(2);
    });
});