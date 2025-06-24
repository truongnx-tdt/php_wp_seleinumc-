import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Unit from '../models/Unit.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;
    const role = req.query.role || '';
    const status = req.query.status || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';
    // lọc theo khoảng ngày tạo, từ ngày đến ngày
    const createdAtFrom = req.query.createdAtFrom || '';
    const createdAtTo = req.query.createdAtTo || '';

    const query = {
        $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
    };

    if (role) {
        query.role = role;
    }

    if (status) {
        query.status = status;
    }

    if (createdAtFrom || createdAtTo) {
        query.createdAt = {};
        if (createdAtFrom) {
            query.createdAt.$gte = new Date(createdAtFrom);
        }
        if (createdAtTo) {
            query.createdAt.$lte = new Date(createdAtTo);
        }
    }

    const users = await User.find(query).select('-password').skip(skip).limit(limit).sort({ [sort]: order });

    const total = await User.countDocuments(query);

    res.json({
        users,
        total,
        page,
        limit,
        sort,
        order,
        totalPages: Math.ceil(total / limit)
    });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
        return;
    }
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
    // check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // check if password min length 8, have at least 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
        res.status(400).json({ message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt' });
        return;
    }

    const newUser = await User.create(req.body);

    res.status(201).json(newUser);

});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.status = req.body.status || user.status;
        user.phone = req.body.phone || user.phone;
        user.addresses = req.body.addresses || user.addresses;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
            addresses: updatedUser.addresses,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
        return;
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400).json({ message: 'Cannot delete admin user' });
            return;
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
        return;
    }
});


// @desc    Add a new address for a user
// @route   POST /api/users/profile/addresses
// @access  Private
const addUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { street, city, district, ward, postalCode, country } = req.body;
        const newAddress = { street, city, district, ward, postalCode, country };

        // If this is the first address, make it default
        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();
        res.status(201).json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
        return;
    }
});

// @desc    Get user addresses
// @route   GET /api/users/profile/addresses
// @access  Private
const getUserAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
        return;
    }
});

// @desc    Update a user address
// @route   PUT /api/users/profile/addresses/:addressId
// @access  Private
const updateUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const address = user.addresses.id(req.params.addressId);
        if (address) {
            const { street, city, district, ward, postalCode, country } = req.body;
            address.street = street || address.street;
            address.city = city || address.city;
            address.district = district || address.district;
            address.ward = ward || address.ward;
            address.postalCode = postalCode || address.postalCode;
            address.country = country || address.country;
            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404).json({ message: 'Address not found' });
            return;
        }
    } else {
        res.status(404).json({ message: 'User not found' });
        return;
    }
});

// @desc    Delete a user address
// @route   DELETE /api/users/profile/addresses/:addressId
// @access  Private
const deleteUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const address = user.addresses.id(req.params.addressId);
        if (address) {
            if (address.isDefault && user.addresses.length > 1) {
                res.status(400).json({ message: 'Cannot delete default address. Set another address as default first.' });
                return;
            }
            address.remove();
            await user.save();
            res.json({ message: 'Address removed' });
        } else {
            res.status(404).json({ message: 'Address not found' });
            return;
        }
    } else {
        res.status(404).json({ message: 'User not found' });
        return;
    }
});


// @desc    Set a default address
// @route   PUT /api/users/profile/addresses/:addressId/default
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const newDefaultAddress = user.addresses.id(req.params.addressId);
        if (!newDefaultAddress) {
            res.status(404);
            throw new Error('Address not found');
        }

        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.equals(newDefaultAddress._id);
        });

        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    // Check if email already exists (excluding current user)
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
        res.status(400);
        throw new Error('Email đã được sử dụng bởi tài khoản khác');
    }

    const user = await User.findById(req.user._id);
    if (user) {
        user.name = name;
        user.email = email;
        user.updatedBy = req.user._id;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Change user password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        res.status(400);
        throw new Error('Mật khẩu hiện tại không đúng');
    }

    // Update password
    user.password = newPassword;
    user.updatedBy = req.user._id;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
});

/**
 * @desc    Get system settings
 * @route   GET /api/users/settings
 * @access  Private/Admin
 */
const getSystemSettings = asyncHandler(async (req, res) => {
    // Get system statistics
    const [totalUsers, totalProducts, totalOrders, totalCategories, totalUnits] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Category.countDocuments(),
        Unit.countDocuments(),
    ]);

    // Get recent activities
    const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role createdAt');

    const recentProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name price createdAt')
        .populate('category', 'name');

    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber totalPrice status createdAt')
        .populate('user', 'name');

    res.json({
        statistics: {
            totalUsers,
            totalProducts,
            totalOrders,
            totalCategories,
            totalUnits,
        },
        recentActivities: {
            users: recentUsers,
            products: recentProducts,
            orders: recentOrders,
        },
    });
});

/**
 * @desc    Get dashboard stats
 * @route   GET /api/users/dashboard-stats
 * @access  Private/Admin
 */

export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addUserAddress,
    getUserAddresses,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
    updateProfile,
    changePassword,
    getSystemSettings
}; 