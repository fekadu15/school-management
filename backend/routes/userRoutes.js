import express from 'express';
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController
} from '../controllers/userController.js';

import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeRoles('admin'));

router.post('/', createUserController);
router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
