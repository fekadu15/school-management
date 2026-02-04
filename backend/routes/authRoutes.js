import express from 'express';
import { loginController } from '../controllers/authController.js';
import { signupController } from '../controllers/authController.js';
const router = express.Router();
router.post('/login', loginController);
router.post('/signup', signupController);
export default router;