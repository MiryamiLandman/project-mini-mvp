import { Router } from 'express';
import * as promptController from '../controllers/PromptController'; // שימי לב לאיית לפי שם הקובץ אצלך
import { protect, adminOnly } from '../middleware/authMiddleware';
import { validatePrompt, validateIdParam } from '../middleware/validationMiddleware';
const router = Router();
router.post('/generate', protect, validatePrompt, promptController.generateLesson);
router.get('/stats/:userId', protect, validateIdParam, promptController.getUserLearningStats);
router.get('/my-prompts', protect, promptController.getUserPrompts);
router.get('/admin/all', protect, adminOnly, promptController.getAllPromptsAdmin);
export default router;