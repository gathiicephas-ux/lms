import { Router } from 'express';
import { authenticate } from '../middleware/auth';
const router = Router();
router.get('/discussions', (req, res) => res.json({ success: true, message: 'Get discussions' }));
router.post('/discussions', authenticate, (req, res) => res.json({ success: true }));
router.post('/:discussionId/reply', authenticate, (req, res) => res.json({ success: true }));
router.post('/:discussionId/upvote', authenticate, (req, res) => res.json({ success: true }));
export default router;
