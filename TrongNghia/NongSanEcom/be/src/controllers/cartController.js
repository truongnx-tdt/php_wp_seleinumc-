import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images');
  
  if (cart) {
    res.json(cart);
  } else {
    // If no cart, create one
    const newCart = await Cart.create({ user: req.user._id, items: [] });
    res.json(newCart);
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        // Product exists in cart, update quantity
        cart.items[itemIndex].quantity += quantity;
    } else {
        // Product does not exist in cart, add new item
        cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product', 'name price images');
    res.status(201).json(populatedCart);
});


// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        // If quantity is 0 or less, remove the item
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      const populatedCart = await cart.populate('items.product', 'name price images');
      res.json(populatedCart);
    } else {
      res.status(404);
      throw new Error('Product not in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (cart) {
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (cart.items.length === initialLength) {
            res.status(404);
            throw new Error('Item not found in cart');
        }

        await cart.save();
        const populatedCart = await cart.populate('items.product', 'name price images');
        res.json(populatedCart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart has been cleared' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

export { 
  getCart, 
  addItemToCart, 
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart
}; 