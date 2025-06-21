import { HTTP_STATUS } from '../constants/index.js';

/**
 * Success Response Helper
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString(),
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Error Response Helper
 */
export const errorResponse = (res, message = 'Error', statusCode = HTTP_STATUS.BAD_REQUEST, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString(),
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Pagination Response Helper
 */
export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  };
  
  return res.status(HTTP_STATUS.OK).json(response);
};

/**
 * Created Response Helper
 */
export const createdResponse = (res, data, message = 'Created successfully') => {
  return successResponse(res, data, message, HTTP_STATUS.CREATED);
};

/**
 * Not Found Response Helper
 */
export const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, HTTP_STATUS.NOT_FOUND);
};

/**
 * Unauthorized Response Helper
 */
export const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Forbidden Response Helper
 */
export const forbiddenResponse = (res, message = 'Access denied') => {
  return errorResponse(res, message, HTTP_STATUS.FORBIDDEN);
};

/**
 * Validation Error Response Helper
 */
export const validationErrorResponse = (res, errors, message = 'Validation error') => {
  return errorResponse(res, message, HTTP_STATUS.BAD_REQUEST, errors);
};

/**
 * Conflict Response Helper
 */
export const conflictResponse = (res, message = 'Resource conflict') => {
  return errorResponse(res, message, HTTP_STATUS.CONFLICT);
}; 