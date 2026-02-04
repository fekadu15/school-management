import * as gradeService from '../services/gradeService.js';

export const createGradeController = async (req, res) => {
  try {
    const grade = await gradeService.createGrade(req.body);
    res.status(201).json(grade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllGradesController = async (req, res) => {
  const grades = await gradeService.getAllGrades();
  res.json(grades);
};

export const getGradesByStudentController = async (req, res) => {
  const user = req.user;

  const studentId =
    user.role === 'student' ? user.id : req.params.student_id;

  const grades = await gradeService.getGradesByStudent(studentId);
  res.json(grades);
};

export const getGradesByClassSubjectController = async (req, res) => {
  const grades = await gradeService.getGradesByClassSubject(
    req.params.class_id,
    req.params.subject_id
  );
  res.json(grades);
};

export const updateGradeController = async (req, res) => {
  try {
    const updated = await gradeService.updateGrade(
      req.params.id,
      req.body.score
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGradeController = async (req, res) => {
  try {
    const result = await gradeService.deleteGrade(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
