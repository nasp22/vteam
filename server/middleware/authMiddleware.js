// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { apiResponse } = require('../utils.js');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json(apiResponse(false, null, 'Unauthorized', 401));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json(apiResponse(false, null, 'Forbidden', 403));
        }
        req.user = user;
        next();
    });
}

const checkRole = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json(apiResponse(false, null, 'Unauthorized', 401));
    }
    if (req.user.role !== role) {
        console.log(req.user.role);
        console.log(role);
        return res.status(403).json(apiResponse(false, null, 'Forbidden', 403));
    }
    next();
}

module.exports = { authenticateToken, checkRole };
