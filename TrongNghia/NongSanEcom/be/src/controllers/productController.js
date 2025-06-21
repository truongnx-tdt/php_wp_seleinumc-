import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { 
  successResponse, 
  createdResponse, 
  notFoundResponse,
  validationErrorResponse 
} from '../utils/responseHelper.js';
import { 
  validateProduct, 
  sanitizeInput 
} from '../utils/validationHelper.js';
import { 
  parsePaginationParams, 
  getPaginatedResults 
} from '../utils/paginate.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';
import { logger } from '../utils/logger.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

/**
 * @desc    Get all products (with pagination)
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { search = '', category = '', minPrice = '', maxPrice = '', sort = '' } = req.query;
  const paginationParams = parsePaginationParams(req.query);
  
  // Build filter
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  // Build sort
  let sortOptions = { createdAt: -1 };
  if (sort) {
    switch (sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'name_desc':
        sortOptions = { name: -1 };
        break;
      case 'rating_desc':
        sortOptions = { rating: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
  }

  const result = await getPaginatedResults(Product, filter, paginationParams, sortOptions);
  
  return successResponse(res, {
    products: result.data,
    pagination: result.pagination,
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return notFoundResponse(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  return successResponse(res, product);
});

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  
  // Validate input
  const validationErrors = validateProduct(sanitizedData);
  if (validationErrors) {
    return validationErrorResponse(res, validationErrors);
  }

  const {
    name,
    images,
    description,
    price,
    countInStock,
    category,
    unit,
    origin,
    discount
  } = sanitizedData;

  const product = new Product({
    user: req.user._id,
    name,
    images: images || [],
    description,
    price: parseFloat(price),
    countInStock: parseInt(countInStock) || 0,
    category,
    unit,
    origin,
    discount: discount ? parseFloat(discount) : 0
  });

  const createdProduct = await product.save();

  logger.info('Product created successfully', {
    productId: createdProduct._id,
    createdBy: req.user._id,
    productName: createdProduct.name,
  });

  return createdResponse(res, createdProduct, SUCCESS_MESSAGES.PRODUCT_CREATED);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeInput(req.body);
  const product = await Product.findById(req.params.id);

  if (!product) {
    return notFoundResponse(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  // Validate input if provided
  if (Object.keys(sanitizedData).length > 0) {
    const validationErrors = validateProduct(sanitizedData);
    if (validationErrors) {
      return validationErrorResponse(res, validationErrors);
    }
  }

  // Update fields
  if (sanitizedData.name) product.name = sanitizedData.name;
  if (sanitizedData.images) product.images = sanitizedData.images;
  if (sanitizedData.description) product.description = sanitizedData.description;
  if (sanitizedData.price) product.price = parseFloat(sanitizedData.price);
  if (sanitizedData.countInStock !== undefined) product.countInStock = parseInt(sanitizedData.countInStock);
  if (sanitizedData.category) product.category = sanitizedData.category;
  if (sanitizedData.unit) product.unit = sanitizedData.unit;
  if (sanitizedData.origin) product.origin = sanitizedData.origin;
  if (sanitizedData.discount !== undefined) product.discount = parseFloat(sanitizedData.discount);

  const updatedProduct = await product.save();

  logger.info('Product updated successfully', {
    productId: product._id,
    updatedBy: req.user._id,
    updatedFields: Object.keys(sanitizedData),
  });

  return successResponse(res, updatedProduct, SUCCESS_MESSAGES.PRODUCT_UPDATED);
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return notFoundResponse(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  await product.deleteOne();

  logger.info('Product deleted successfully', {
    productId: product._id,
    deletedBy: req.user._id,
    productName: product.name,
  });

  return successResponse(res, null, SUCCESS_MESSAGES.PRODUCT_DELETED);
});

/**
 * @desc    Create new review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return notFoundResponse(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  
  if (alreadyReviewed) {
    return validationErrorResponse(res, { review: 'Product already reviewed' });
  }

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return validationErrorResponse(res, { rating: 'Rating must be between 1 and 5' });
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment || '',
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
  
  await product.save();

  logger.info('Product review created', {
    productId: product._id,
    reviewedBy: req.user._id,
    rating: rating,
  });

  return createdResponse(res, { message: 'Review added successfully' });
});

/**
 * @desc    Get dashboard stats
 * @route   GET /api/products/dashboard-stats
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  // Get recent products
  const recentProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name price createdAt');

  // Get low stock products
  const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } })
    .select('name countInStock');

  return successResponse(res, {
    stats: { users, products, orders },
    recentProducts,
    lowStockProducts,
  });
});

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
export const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  return successResponse(res, { categories });
});

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const paginationParams = parsePaginationParams(req.query);
  
  const filter = { category: { $regex: category, $options: 'i' } };
  const result = await getPaginatedResults(Product, filter, paginationParams, { createdAt: -1 });
  
  return successResponse(res, {
    products: result.data,
    pagination: result.pagination,
    category,
  });
}); 