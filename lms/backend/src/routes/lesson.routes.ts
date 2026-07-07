import { Router } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();
router.get('/:lessonId', (req, res) => res.json({ success: true, message: 'Get lesson' }));
router.post('/:lessonId/mark-complete', authenticate, (req, res) => res.json({ success: true }));
export default router;
