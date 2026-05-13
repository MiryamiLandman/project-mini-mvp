import { Router } from 'express';
import * as userController from '../controllers/UserController';
import { protect, adminOnly } from '../middleware/authMiddleware'; 
import { validateUser, validateIdParam } from '../middleware/validationMiddleware'; 

const router = Router();

router.post('/register', validateUser, userController.registerUser);
router.post('/login', userController.loginUser);

router.get('/', protect, adminOnly, userController.getAllUsers);

router.get('/:id', protect, adminOnly, validateIdParam, userController.getUserById);

router.get('/name/:name', protect, adminOnly, userController.getUserByName);

router.get('/phone/:phone', protect, adminOnly, userController.getUserByPhone);

export default router;