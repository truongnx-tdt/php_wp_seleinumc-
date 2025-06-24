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
 * @desc    Fetch all products with filtering, pagination, and sorting
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};
    
    const category = req.query.category ? { category: req.query.category } : {};

    const count = await Product.countDocuments({ ...keyword, ...category });
    const products = await Product.find({ ...keyword, ...category })
        .populate('category', 'name')
        .populate('unit', 'name symbol')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

/**
 * @desc    Fetch single product
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('reviews.user', 'name')
        .populate('category', 'name')
        .populate('unit', 'name symbol');
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        images,
        countInStock,
        category,
        unit,
        origin,
        isOrganic,
        discount
    } = req.body;

    const product = new Product({
        name,
        price,
        user: req.user._id,
        images,
        countInStock,
        description,
        category,
        unit,
        origin,
        isOrganic,
        discount
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        images,
        countInStock,
        category,
        unit,
        origin,
        isOrganic,
        discount
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.images = images;
        product.countInStock = countInStock;
        product.category = category;
        product.unit = unit;
        product.origin = origin;
        product.isOrganic = isOrganic;
        product.discount = discount;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Create new review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
export const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
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