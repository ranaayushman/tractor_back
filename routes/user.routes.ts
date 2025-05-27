import { Router, RequestHandler } from 'express';
import { signup, login, updateProfile, createTractor, getTractors } from '../controllers/user.controller.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Auth routes
router.post('/signup', signup as RequestHandler);
router.post('/login', login as RequestHandler);

// Protected routes
router.put('/profile', authMiddleware as RequestHandler, upload.single('image'), updateProfile as RequestHandler);
router.post('/tractors', authMiddleware as RequestHandler, upload.single('image'), createTractor as RequestHandler);
router.get('/tractors', authMiddleware as RequestHandler, getTractors as RequestHandler);

export default router;
