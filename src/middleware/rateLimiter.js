/**
 * Simple rate limiting middleware
 */
const requests = new Map();

export const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();
        
        // Clean old entries
        if (requests.has(key)) {
            const userRequests = requests.get(key);
            const validRequests = userRequests.filter(time => now - time < windowMs);
            requests.set(key, validRequests);
        }
        
        // Check rate limit
        const userRequests = requests.get(key) || [];
        if (userRequests.length >= maxRequests) {
            return res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
        
        // Add current request
        userRequests.push(now);
        requests.set(key, userRequests);
        
        next();
    };
};