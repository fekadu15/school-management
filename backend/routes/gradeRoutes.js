import express from 'express';
import {
  createGradeController,
  getAllGradesController,
  getGradesByStudentController,
  getGradesByClassSubjectController,
  updateGradeController,
  deleteGradeController
} from '../controllers/gradeController.js';

import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { authorizeTeacherForSubject } from '../middlewares/teacherMiddleware.js';

const router = express.Router();

router.use(authenticateJWT);


router.post('/', authorizeTeacherForSubject, createGradeController);
router.put('/:id', authorizeTeacherForSubject, updateGradeController);
router.delete('/:id', authorizeTeacherForSubject, deleteGradeController);


router.get('/', getAllGradesController);
router.get('/student/:student_id', getGradesByStudentController);
router.get('/class/:class_id/subject/:subject_id', getGradesByClassSubjectController);

export default router;
