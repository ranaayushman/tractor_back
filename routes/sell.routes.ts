import { Router, RequestHandler } from 'express';
import { createSell, getSells, getSellById, updateSell, deleteSell } from '../controllers/sell.controller.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();    

// All routes require authentication
router.use(authMiddleware as RequestHandler);

router.post('/sellProduct', upload.array('images', 20), createSell as RequestHandler);
router.get('/getProducts', getSells as RequestHandler);
router.get('/getProduct/:id', getSellById as RequestHandler);
router.put('/updateProduct/:id', upload.array('images', 20), updateSell as RequestHandler);
router.delete('/deleteProduct/:id', deleteSell as RequestHandler);

export default router; 