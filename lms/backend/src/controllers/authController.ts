import { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/errorHandler';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserById,
  updateUserProfile,
  changePassword,
} from '../services/authService';

/**
 * Validation Schemas
 */
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  tier: z.enum(['foundation', 'authority', 'domination']).optional(),
  companyName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

const profileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  companyName: z.string().optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

/**
 * Register Controller
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  // Validate request
  const validated = registerSchema.parse(req.body);

  // Register user
  const result = await registerUser(validated);

  res.status(201).json({
    success: true,
    data: result,
    message: 'User registered successfully',
  });
});

/**
 * Login Controller
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  // Validate request
  const validated = loginSchema.parse(req.body);

  // Login user
  const result = await loginUser(validated.email, validated.password);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Login successful',
  });
});

/**
 * Refresh Token Controller
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  // Validate request
  const validated = refreshSchema.parse(req.body);

  // Refresh token
  const result = await refreshAccessToken(validated.refreshToken);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Token refreshed successfully',
  });
});

/**
 * Logout Controller
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'Refresh token required',
    });
  }

  // Logout
  await logoutUser(userId, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * Get Current User Controller
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;

  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Update Profile Controller
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;

  // Validate request
  const validated = profileUpdateSchema.parse(req.body);

  // Update profile
  const user = await updateUserProfile(userId, validated);

  res.status(200).json({
    success: true,
    data: user,
    message: 'Profile updated successfully',
  });
});

/**
 * Change Password Controller
 */
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;

  // Validate request
  const validated = changePasswordSchema.parse(req.body);

  // Change password
  await changePassword(userId, validated.oldPassword, validated.newPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * Health Check
 */
export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is healthy',
  });
});
