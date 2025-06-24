import asyncHandler from 'express-async-handler';
import Unit from '../models/Unit.js';
import Product from '../models/Product.js';

// @desc    Create a new unit
// @route   POST /api/units
// @access  Private/Admin
const createUnit = asyncHandler(async (req, res) => {
  const { name, symbol, description, isActive = true } = req.body;

  // Check if unit with same name or symbol exists
  const unitExists = await Unit.findOne({
    $or: [{ name }, { symbol }]
  });

  if (unitExists) {
    res.status(400);
    throw new Error('Unit with this name or symbol already exists');
  }

  const unit = await Unit.create({
    name,
    symbol,
    description,
    isActive,
    user: req.user._id,
  });

  res.status(201).json(unit);
});

// @desc    Get all units with pagination and filtering
// @route   GET /api/units
// @access  Public
const getUnits = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  // Build filter object
  const filter = {};
  
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { symbol: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  if (req.query.status) {
    if (req.query.status === 'active') {
      filter.isActive = true;
    } else if (req.query.status === 'inactive') {
      filter.isActive = false;
    }
  }

  const count = await Unit.countDocuments(filter);
  const units = await Unit.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  // Get product count for each unit
  const unitsWithProductCount = await Promise.all(
    units.map(async (unit) => {
      const productCount = await Product.countDocuments({ unit: unit._id });
      return {
        ...unit.toObject(),
        productCount
      };
    })
  );

  res.json({
    units: unitsWithProductCount,
    page,
    total: count,
    totalPages: Math.ceil(count / pageSize)
  });
});

// @desc    Get unit by ID
// @route   GET /api/units/:id
// @access  Public
const getUnitById = asyncHandler(async (req, res) => {
  const unit = await Unit.findById(req.params.id);

  if (unit) {
    res.json(unit);
  } else {
    res.status(404);
    throw new Error('Unit not found');
  }
});

// @desc    Update a unit
// @route   PUT /api/units/:id
// @access  Private/Admin
const updateUnit = asyncHandler(async (req, res) => {
  const { name, symbol, description, isActive } = req.body;
  const unit = await Unit.findById(req.params.id);

  if (unit) {
    // Check if name or symbol is being changed and if it already exists
    if ((name && name !== unit.name) || (symbol && symbol !== unit.symbol)) {
      const unitExists = await Unit.findOne({
        $or: [
          { name: name || unit.name, _id: { $ne: req.params.id } },
          { symbol: symbol || unit.symbol, _id: { $ne: req.params.id } }
        ]
      });
      if (unitExists) {
        res.status(400);
        throw new Error('Unit with this name or symbol already exists');
      }
    }

    unit.name = name || unit.name;
    unit.symbol = symbol || unit.symbol;
    unit.description = description !== undefined ? description : unit.description;
    unit.isActive = isActive !== undefined ? isActive : unit.isActive;

    const updatedUnit = await unit.save();
    res.json(updatedUnit);
  } else {
    res.status(404);
    throw new Error('Unit not found');
  }
});

// @desc    Delete a unit
// @route   DELETE /api/units/:id
// @access  Private/Admin
const deleteUnit = asyncHandler(async (req, res) => {
  const unit = await Unit.findById(req.params.id);

  if (unit) {
    // Check if unit has products
    const productCount = await Product.countDocuments({ unit: req.params.id });
    if (productCount > 0) {
      res.status(400);
      throw new Error(`Cannot delete unit. It has ${productCount} products.`);
    }

    await unit.deleteOne();
    res.json({ message: 'Unit removed' });
  } else {
    res.status(404);
    throw new Error('Unit not found');
  }
});

export {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
}; 