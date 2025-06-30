import { Router, RequestHandler } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByUserId } from '../controllers/products.controller.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/products', getAllProducts as RequestHandler);
router.get('/products/:id', getProductById as RequestHandler);

// Authenticated routes
router.post('/products', authMiddleware as RequestHandler, upload.array('images', 20), createProduct as RequestHandler);
router.get('/products/user/:userId', authMiddleware as RequestHandler, getProductsByUserId as RequestHandler);
router.put('/products/:id', authMiddleware as RequestHandler, upload.array('images', 20), updateProduct as RequestHandler);
router.delete('/products/:id', authMiddleware as RequestHandler, deleteProduct as RequestHandler);

export default router; 