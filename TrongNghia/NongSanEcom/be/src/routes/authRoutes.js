import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUsers, 
  deleteUser, 
  updateUser, 
  getUserProfile, 
  updateUserProfile, 
  customerRegister
} from '../controllers/authController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// === Public Routes ===
// For Client App login (and Admin App, will be checked in controller)
router.post('/login', authUser); 
router.post('/register', customerRegister);

// === User's own protected routes ===
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// === Admin Only Routes ===
router.get('/get-users', protect, isAdmin, getUsers);
router.post('/add-user', protect, isAdmin, registerUser);
router.route('/:id')
  .delete(protect, isAdmin, deleteUser)
  .put(protect, isAdmin, updateUser);

export default router; 