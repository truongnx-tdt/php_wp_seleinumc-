import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
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

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if(user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
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
        res.status(404);
        throw new Error('User not found');
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
        res.status(404);
        throw new Error('User not found');
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
            res.status(404);
            throw new Error('Address not found');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
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
                res.status(400);
                throw new Error('Cannot delete default address. Set another address as default first.');
            }
            address.remove();
            await user.save();
            res.json({ message: 'Address removed' });
        } else {
            res.status(404);
            throw new Error('Address not found');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
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

export {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    addUserAddress,
    getUserAddresses,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress
}; 