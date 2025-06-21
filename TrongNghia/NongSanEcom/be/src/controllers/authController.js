import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { 
  successResponse, 
  createdResponse, 
  unauthorizedResponse, 
  notFoundResponse,
  validationErrorResponse,
  conflictResponse 
} from '../utils/responseHelper.js';
import { 
  validateUserRegistration, 
  validateUserLogin, 
  sanitizeInput 
} from '../utils/validationHelper.js';
import { USER_ROLES, SUCCESS_MESSAGES, ERROR_MESSAGES, JWT_CONFIG } from '../constants/index.js';
import { logger } from '../utils/logger.js';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET.replace(/'/g, ''), {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
  });
};

/**
 * @desc    Register new user (by Admin)
 * @route   POST /api/auth/add-user
 * @access  Private/Admin
 */
export const registerUser = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  
  // Validate input
  const validationErrors = validateUserRegistration(sanitizedData);
  if (validationErrors) {
    return validationErrorResponse(res, validationErrors);
  }

  const { name, email, password, role = USER_ROLES.CUSTOMER } = sanitizedData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return conflictResponse(res, ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  // Create user
  const user = await User.create({ 
    name, 
    email, 
    password, 
    role: role || USER_ROLES.CUSTOMER 
  });

  logger.info('User registered successfully', {
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  return createdResponse(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }, SUCCESS_MESSAGES.USER_CREATED);
});

/**
 * @desc    Auth user & get token (for Admin Panel)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const authUser = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  
  // Validate input
  const validationErrors = validateUserLogin(sanitizedData);
  if (validationErrors) {
    return validationErrorResponse(res, validationErrors);
  }

  const { email, password } = sanitizedData;

  // Find user and check password
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    logger.warn('Login failed - Invalid credentials', { email });
    return unauthorizedResponse(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  logger.info('User logged in successfully', {
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  return successResponse(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  }, SUCCESS_MESSAGES.LOGIN_SUCCESS);
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return notFoundResponse(res, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return successResponse(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return notFoundResponse(res, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  // Update fields
  if (sanitizedData.name) user.name = sanitizedData.name;
  if (sanitizedData.email) {
    // Check if email is already taken by another user
    const emailExists = await User.findOne({ 
      email: sanitizedData.email, 
      _id: { $ne: user._id } 
    });
    if (emailExists) {
      return conflictResponse(res, 'Email is already taken');
    }
    user.email = sanitizedData.email;
  }
  if (sanitizedData.password) {
    user.password = sanitizedData.password;
  }

  const updatedUser = await user.save();

  logger.info('User profile updated', {
    userId: user._id,
    updatedFields: Object.keys(sanitizedData),
  });

  return successResponse(res, {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    token: generateToken(updatedUser._id),
  }, SUCCESS_MESSAGES.USER_UPDATED);
});

/**
 * @desc    Get all users (with pagination)
 * @route   GET /api/auth/get-users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', role = '' } = req.query;
  
  // Build filter
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) {
    filter.role = role;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  return successResponse(res, {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    },
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/auth/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return notFoundResponse(res, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return unauthorizedResponse(res, 'Cannot delete your own account');
  }

  await user.deleteOne();

  logger.info('User deleted', {
    deletedUserId: user._id,
    deletedBy: req.user._id,
  });

  return successResponse(res, null, SUCCESS_MESSAGES.USER_DELETED);
});

/**
 * @desc    Update user by Admin
 * @route   PUT /api/auth/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return notFoundResponse(res, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  // Update fields
  if (sanitizedData.name) user.name = sanitizedData.name;
  if (sanitizedData.email) {
    // Check if email is already taken by another user
    const emailExists = await User.findOne({ 
      email: sanitizedData.email, 
      _id: { $ne: user._id } 
    });
    if (emailExists) {
      return conflictResponse(res, 'Email is already taken');
    }
    user.email = sanitizedData.email;
  }
  if (sanitizedData.role && Object.values(USER_ROLES).includes(sanitizedData.role)) {
    user.role = sanitizedData.role;
  }

  const updatedUser = await user.save();

  logger.info('User updated by admin', {
    updatedUserId: user._id,
    updatedBy: req.user._id,
    updatedFields: Object.keys(sanitizedData),
  });

  return successResponse(res, updatedUser, SUCCESS_MESSAGES.USER_UPDATED);
});

/**
 * @desc    Customer register
 * @route   POST /api/auth/register
 * @access  Public
 */
export const customerRegister = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  
  // Validate input
  const validationErrors = validateUserRegistration(sanitizedData);
  if (validationErrors) {
    return validationErrorResponse(res, validationErrors);
  }

  const { name, email, password } = sanitizedData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return conflictResponse(res, ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  // Create customer user
  const user = await User.create({ 
    name, 
    email, 
    password, 
    role: USER_ROLES.CUSTOMER 
  });

  logger.info('Customer registered successfully', {
    userId: user._id,
    email: user.email,
  });

  return createdResponse(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }, SUCCESS_MESSAGES.USER_CREATED);
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can log the logout event
  logger.info('User logged out', {
    userId: req.user._id,
    email: req.user.email,
  });

  return successResponse(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
});