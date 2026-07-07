import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  updateProfile,
  updatePassword,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * Public Routes
 */

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Refresh Token
router.post('/refresh', refreshToken);

/**
 * Protected Routes (require authentication)
 */

// Logout
router.post('/logout', authenticate, logout);

// Get Current User
router.get('/me', authenticate, getCurrentUser);

// Update Profile
router.patch('/profile', authenticate, updateProfile);

// Change Password
router.patch('/password', authenticate, updatePassword);

export default router;
