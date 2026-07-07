import { Router } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();
router.get('/', authenticate, (req, res) => res.json({ success: true, message: 'Get progress' }));
router.post('/update', authenticate, (req, res) => res.json({ success: true }));
export default router;
