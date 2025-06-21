import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './errorMiddleware.js';
import { unauthorizedResponse, forbiddenResponse } from '../utils/responseHelper.js';
import { USER_ROLES, ERROR_MESSAGES } from '../constants/index.js';
import { logger } from '../utils/logger.js';

/**
 * Protect routes - require authentication
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    logger.warn('Authentication failed - No token provided', {
      url: req.originalUrl,
      ip: req.ip,
    });
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET.replace(/'/g, ''));
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      logger.warn('Authentication failed - User not found', {
        userId: decoded.id,
        url: req.originalUrl,
      });
      return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Check if user is active (you can add an isActive field to User model)
    // if (!user.isActive) {
    //   return unauthorizedResponse(res, 'User account is deactivated');
    // }

    req.user = user;
    next();
  } catch (error) {
    logger.warn('Authentication failed - Invalid token', {
      error: error.message,
      url: req.originalUrl,
      ip: req.ip,
    });
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }
});

/**
 * Require admin role
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    logger.warn('Access denied - Admin role required', {
      userId: req.user._id,
      userRole: req.user.role,
      url: req.originalUrl,
    });
    return forbiddenResponse(res, ERROR_MESSAGES.FORBIDDEN);
  }

  next();
};

/**
 * Require staff or admin role
 */
export const requireStaffOrAdmin = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, ERROR_MESSAGES.UNAUTHORIZED);
  }

  if (req.user.role !== USER_ROLES.ADMIN && req.user.role !== USER_ROLES.STAFF) {
    logger.warn('Access denied - Staff or Admin role required', {
      userId: req.user._id,
      userRole: req.user.role,
      url: req.originalUrl,
    });
    return forbiddenResponse(res, ERROR_MESSAGES.FORBIDDEN);
  }

  next();
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET.replace(/'/g, ''));
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      logger.debug('Optional auth failed - Invalid token', {
        error: error.message,
        url: req.originalUrl,
      });
    }
  }

  next();
});

/**
 * Rate limiting middleware (basic implementation)
 */
export const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(key)) {
      const userRequests = requests.get(key).filter(time => time > windowStart);
      requests.set(key, userRequests);
    } else {
      requests.set(key, []);
    }

    const userRequests = requests.get(key);

    if (userRequests.length >= max) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        url: req.originalUrl,
        requests: userRequests.length,
      });
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.',
        timestamp: new Date().toISOString(),
      });
    }

    userRequests.push(now);
    next();
  };
}; 