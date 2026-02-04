import express from 'express';
import {
  markAttendanceController,
  getAllAttendanceController,
  getAttendanceByStudentController,
  getAttendanceByClassSubjectController,
  updateAttendanceController,
  deleteAttendanceController
} from '../controllers/attendanceController.js';

import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { authorizeTeacherForSubject } from '../middlewares/teacherMiddleware.js';

const router = express.Router();

router.use(authenticateJWT);


router.post('/', authorizeTeacherForSubject, markAttendanceController);
router.put('/:id', authorizeTeacherForSubject, updateAttendanceController);
router.delete('/:id', authorizeTeacherForSubject, deleteAttendanceController);


router.get('/', getAllAttendanceController); 
router.get('/student/:student_id', getAttendanceByStudentController);
router.get('/class/:class_id/subject/:subject_id', getAttendanceByClassSubjectController);

export default router;
