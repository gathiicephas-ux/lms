import { Router } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();
router.post('/create-intent', authenticate, (req, res) => res.json({ success: true }));
router.post('/webhook', (req, res) => res.json({ success: true }));
router.get('/history', authenticate, (req, res) => res.json({ success: true }));
export default router;
