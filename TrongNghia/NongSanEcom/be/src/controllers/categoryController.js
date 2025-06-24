import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive = true } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    description,
    isActive,
    user: req.user._id,
  });

  res.status(201).json(category);
});

// @desc    Get all categories with pagination and filtering
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  // Build filter object
  const filter = {};
  
  if (req.query.search) {
    filter.name = {
      $regex: req.query.search,
      $options: 'i'
    };
  }

  if (req.query.status) {
    if (req.query.status === 'active') {
      filter.isActive = true;
    } else if (req.query.status === 'inactive') {
      filter.isActive = false;
    }
  }

  const count = await Category.countDocuments(filter);
  const categories = await Category.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  // Get product count for each category
  const categoriesWithProductCount = await Promise.all(
    categories.map(async (category) => {
      const productCount = await Product.countDocuments({ category: category._id });
      return {
        ...category.toObject(),
        productCount
      };
    })
  );

  res.json({
    categories: categoriesWithProductCount,
    page,
    total: count,
    totalPages: Math.ceil(count / pageSize)
  });
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  const category = await Category.findById(req.params.id);

  if (category) {
    // Check if name is being changed and if it already exists
    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ name, _id: { $ne: req.params.id } });
      if (categoryExists) {
        res.status(400);
        throw new Error('Category name already exists');
      }
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      res.status(400);
      throw new Error(`Cannot delete category. It has ${productCount} products.`);
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
}; 