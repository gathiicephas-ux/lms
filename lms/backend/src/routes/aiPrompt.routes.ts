import { Router } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();
router.get('/', (req, res) => res.json({ success: true, message: 'Get AI prompts' }));
router.post('/:promptId/execute', authenticate, (req, res) => res.json({ success: true }));
router.get('/history', authenticate, (req, res) => res.json({ success: true }));
export default router;
