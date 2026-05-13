import { Router } from 'express';
import * as subCategoryController from '../controllers/SubCategoryController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, subCategoryController.getAllSubCategories);

router.get('/:categoryName', protect, subCategoryController.getSubCategoriesByCatName);

router.post('/', protect, adminOnly, subCategoryController.createSubCategory);

export default router;