import { Router } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();
router.get('/', authenticate, (req, res) => res.json({ success: true, message: 'Get certificates' }));
router.get('/:certificateId/download', (req, res) => res.json({ success: true }));
router.get('/verify/:verificationCode', (req, res) => res.json({ success: true }));
export default router;
