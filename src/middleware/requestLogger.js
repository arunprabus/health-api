/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;
    
    // Log request
    console.log(`${new Date().toISOString()} - ${method} ${url} - ${ip}`);
    
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${method} ${url} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
};