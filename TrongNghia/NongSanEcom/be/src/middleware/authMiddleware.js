import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { USER_ROLES } from '../constants/index.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware to protect routes by requiring authentication.
 * It verifies the JWT token from the http-only cookie.
 */
const protect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');

        if (!req.user) {
            res.status(401).json({ message: 'Not authorized, user not found for this token' });
        }
        next();
    } catch (error) {
        logger.warn('Token verification failed', { error: error.message, ip: req.ip });
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

/**
 * Middleware to require admin role.
 * Should be used after `protect`.
 */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === USER_ROLES.ADMIN) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

/**
 * Middleware to require staff or admin role.
 * Should be used after `protect`.
 */
const requireStaffOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === USER_ROLES.STAFF || req.user.role === USER_ROLES.ADMIN)) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a staff or admin' });
    }
};


// --- Rate Limiting ---
// This state is stored in memory at the module level.
const requests = new Map();

/**
 * Creates a rate-limiting middleware.
 * @param {number} windowMs - The time window in milliseconds.
 * @param {number} max - The max number of requests allowed in the time window.
 */
const rateLimitFunction = (windowMs = 15 * 60 * 1000, max = 2000) => {
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;

        // Get records for this IP, or initialize
        let records = requests.get(ip) || [];

        // Filter out records that are outside the current window
        records = records.filter(timestamp => timestamp > windowStart);

        // Check if limit is exceeded
        if (records.length >= max) {
            logger.warn('Rate limit exceeded', { ip: ip, url: req.originalUrl });
            return res.status(429).json({ message: 'Too many requests, please try again later.' });
        }

        // Add the current request's timestamp
        records.push(now);
        requests.set(ip, records);

        next();
    };
};

// Create an instance of the rate limiter
const rateLimit = rateLimitFunction();

export { protect, requireAdmin, requireStaffOrAdmin, rateLimit };