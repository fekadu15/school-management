import express from 'express';
import {
  createEnrollmentController,
  getAllEnrollmentsController,
  getEnrollmentsByStudentController,
  getEnrollmentsByClassController,
  deleteEnrollmentController
} from '../controllers/enrollmentController.js';

import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();


router.use(authenticateJWT);


router.post('/', authorizeRoles('admin'), createEnrollmentController);
router.delete('/:id', authorizeRoles('admin'), deleteEnrollmentController);


router.get('/', getAllEnrollmentsController);
router.get('/student/:student_id', getEnrollmentsByStudentController);
router.get('/class/:class_id', getEnrollmentsByClassController);

export default router;
