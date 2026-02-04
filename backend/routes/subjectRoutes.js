import express from 'express';
import {
  createSubjectController,
  getAllSubjectsController,
  getSubjectByIdController,
  updateSubjectController,
  deleteSubjectController
} from '../controllers/subjectController.js';

import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();


router.use(authenticateJWT);


router.post('/', authorizeRoles('admin'), createSubjectController);
router.put('/:id', authorizeRoles('admin'), updateSubjectController);
router.delete('/:id', authorizeRoles('admin'), deleteSubjectController);


router.get('/', getAllSubjectsController);
router.get('/:id', getSubjectByIdController);

export default router;
