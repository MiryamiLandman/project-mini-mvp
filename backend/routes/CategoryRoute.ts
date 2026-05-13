import { Router } from 'express';
import * as categoryController from '../controllers/CategoryController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, categoryController.getAllCategories);

router.post('/', protect, adminOnly, categoryController.createCategory);

export default router;