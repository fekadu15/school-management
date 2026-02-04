import express from 'express';
import {
  createClassController,
  getAllClassesController,
  getClassByIdController,
  updateClassController,
  deleteClassController
} from '../controllers/classController.js';

import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();


router.use(authenticateJWT);


router.post('/', authorizeRoles('admin'), createClassController);
router.put('/:id', authorizeRoles('admin'), updateClassController);
router.delete('/:id', authorizeRoles('admin'), deleteClassController);


router.get('/', getAllClassesController);
router.get('/:id', getClassByIdController);

export default router;
