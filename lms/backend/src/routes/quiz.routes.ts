import { Router } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();
router.get('/:quizId', (req, res) => res.json({ success: true, message: 'Get quiz' }));
router.post('/:quizId/attempt', authenticate, (req, res) => res.json({ success: true }));
router.post('/:quizId/submit', authenticate, (req, res) => res.json({ success: true }));
router.get('/:quizId/results', authenticate, (req, res) => res.json({ success: true }));
export default router;
