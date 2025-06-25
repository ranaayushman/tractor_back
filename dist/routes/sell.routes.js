import { Router } from 'express';
import { createSell, getSells, getSellById, updateSell, deleteSell } from '../controllers/sell.controller.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
// All routes require authentication
router.use(authMiddleware);
router.post('/sellProduct', upload.array('images', 20), createSell);
router.get('/getProducts', getSells);
router.get('/getProduct/:id', getSellById);
router.put('/updateProduct/:id', upload.array('images', 20), updateSell);
router.delete('/deleteProduct/:id', deleteSell);
export default router;
