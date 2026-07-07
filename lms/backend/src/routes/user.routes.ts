import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', authenticate, (req, res) => {
  res.json({ success: true, message: 'Profile endpoint' });
});

// Update user profile
router.put('/profile', authenticate, (req, res) => {
  res.json({ success: true, message: 'Profile update endpoint' });
});

// Get user enrollments
router.get('/enrollments', authenticate, (req, res) => {
  res.json({ success: true, message: 'User enrollments endpoint' });
});

// Get user progress summary
router.get('/progress-summary', authenticate, (req, res) => {
  res.json({ success: true, message: 'Progress summary endpoint' });
});

export default router;
