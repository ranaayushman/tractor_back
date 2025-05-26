import { Router } from 'express';
import { createUser, getUsers } from '../controllers/user.controller.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/users', upload.single('image'), createUser);
router.get('/users', getUsers);

export default router;
