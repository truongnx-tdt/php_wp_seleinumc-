import { VALIDATION, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  return password && password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

/**
 * Validate name
 */
export const isValidName = (name) => {
  return name && 
         name.length >= VALIDATION.NAME_MIN_LENGTH && 
         name.length <= VALIDATION.NAME_MAX_LENGTH;
};

/**
 * Validate required fields
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = `${field} is required`;
    }
  });
  
  return Object.keys(errors).length === 0 ? null : errors;
};

/**
 * Validate user registration data
 */
export const validateUserRegistration = (data) => {
  const errors = {};
  
  // Check required fields
  const requiredFields = ['name', 'email', 'password'];
  const requiredErrors = validateRequired(data, requiredFields);
  if (requiredErrors) {
    Object.assign(errors, requiredErrors);
  }
  
  // Validate email format
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Validate email length
  if (data.email && data.email.length > VALIDATION.EMAIL_MAX_LENGTH) {
    errors.email = `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`;
  }
  
  // Validate name
  if (data.name && !isValidName(data.name)) {
    errors.name = `Name must be between ${VALIDATION.NAME_MIN_LENGTH} and ${VALIDATION.NAME_MAX_LENGTH} characters`;
  }
  
  // Validate password
  if (data.password && !isValidPassword(data.password)) {
    errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
};

/**
 * Validate user login data
 */
export const validateUserLogin = (data) => {
  const errors = {};
  
  // Check required fields
  const requiredFields = ['email', 'password'];
  const requiredErrors = validateRequired(data, requiredFields);
  if (requiredErrors) {
    Object.assign(errors, requiredErrors);
  }
  
  // Validate email format
  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
};

/**
 * Validate product data
 */
export const validateProduct = (data) => {
  const errors = {};
  
  // Check required fields
  const requiredFields = ['name', 'price', 'description'];
  const requiredErrors = validateRequired(data, requiredFields);
  if (requiredErrors) {
    Object.assign(errors, requiredErrors);
  }
  
  // Validate price
  if (data.price && (isNaN(data.price) || data.price <= 0)) {
    errors.price = 'Price must be a positive number';
  }
  
  // Validate stock
  if (data.stock !== undefined && (isNaN(data.stock) || data.stock < 0)) {
    errors.stock = 'Stock must be a non-negative number';
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
};

/**
 * Validate order data
 */
export const validateOrder = (data) => {
  const errors = {};
  
  // Check required fields
  const requiredFields = ['orderItems', 'shippingAddress', 'paymentMethod'];
  const requiredErrors = validateRequired(data, requiredFields);
  if (requiredErrors) {
    Object.assign(errors, requiredErrors);
  }
  
  // Validate order items
  if (data.orderItems && (!Array.isArray(data.orderItems) || data.orderItems.length === 0)) {
    errors.orderItems = 'Order must contain at least one item';
  }
  
  // Validate shipping address
  if (data.shippingAddress) {
    const addressFields = ['address', 'city', 'postalCode', 'country'];
    const addressErrors = validateRequired(data.shippingAddress, addressFields);
    if (addressErrors) {
      errors.shippingAddress = addressErrors;
    }
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
};

/**
 * Sanitize input data
 */
export const sanitizeInput = (data) => {
  const sanitized = {};
  
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      sanitized[key] = data[key].trim();
    } else {
      sanitized[key] = data[key];
    }
  });
  
  return sanitized;
}; 