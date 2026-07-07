import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', (req, res) => res.json({ success: true, message: 'Get all courses' }));
router.get('/:slug', (req, res) => res.json({ success: true, message: 'Get course' }));
router.post('/:courseId/enroll', authenticate, (req, res) => res.json({ success: true, message: 'Enroll in course' }));
router.get('/:courseId/lessons', (req, res) => res.json({ success: true, message: 'Get course lessons' }));

export default router;
