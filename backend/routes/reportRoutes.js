import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
  getMyReportController,
  getStudentReportByAdminController
} from '../controllers/reportController.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/me', authorizeRoles('student'), getMyReportController);


router.get(
  '/student/:student_id',
  authorizeRoles('admin'),
  getStudentReportByAdminController
);

export default router;
