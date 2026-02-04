import express from 'express';
import {
  createAssignmentController,
  getAllAssignmentsController,
  getAssignmentByIdController,
  updateAssignmentController,
  deleteAssignmentController,
  getTeacherAssignmentsController
} from '../controllers/teacherAssignmentController.js';

import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.post('/', authorizeRoles('admin'), createAssignmentController);
router.put('/:id', authorizeRoles('admin'), updateAssignmentController);
router.delete('/:id', authorizeRoles('admin'), deleteAssignmentController);

router.get(
  '/',
  authorizeRoles('admin', 'teacher'),
  (req, res, next) => {
    if (req.user.role === 'teacher') {
      return getTeacherAssignmentsController(req, res, next);
    }
    return getAllAssignmentsController(req, res, next);
  }
);

router.get('/:id', authorizeRoles('admin'), getAssignmentByIdController);

export default router;
