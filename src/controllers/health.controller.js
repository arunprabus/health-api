const healthService = require('../services/health.service');

exports.getHealthStatus = (req, res) => {
    const status = healthService.getStatus();
    res.json({ status });
};
