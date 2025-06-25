import { Router } from 'express';
import { signup, login, updateProfile, createTractor, getTractors, getProfile, updateUserById, getUserById, getAllTractors } from '../controllers/user.controller.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
// Auth routes
router.post('/signup', signup);
router.post('/login', login);
// Profile routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, upload.single('image'), updateProfile);
// Tractor routes   
router.post('/tractors', authMiddleware, upload.single('image'), createTractor);
router.get('/tractors', authMiddleware, getTractors);
router.put('/users/:id', authMiddleware, upload.single('image'), updateUserById);
router.get('/users/:id', getUserById);
router.get('/all-tractors', getAllTractors);
export default router;
