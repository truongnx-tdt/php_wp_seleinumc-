import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@nongsan.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Staff User',
    email: 'staff@nongsan.com',
    password: 'staff123',
    role: 'staff',
  },
  {
    name: 'Customer User',
    email: 'customer@nongsan.com',
    password: 'customer123',
    role: 'customer',
  },
];

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    
    const createdUsers = users.map(user => {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
        return user;
    });

    await User.insertMany(createdUsers);
    logger.info('User data seeded successfully', { count: createdUsers.length });
    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed user data', error);
    process.exit(1);
  }
};

importData(); 