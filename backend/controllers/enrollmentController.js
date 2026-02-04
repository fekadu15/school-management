import * as enrollmentService from '../services/enrollmentService.js';

export const createEnrollmentController = async (req, res) => {
  try {
    const enrollment = await enrollmentService.createEnrollment(req.body);
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllEnrollmentsController = async (req, res) => {
  const enrollments = await enrollmentService.getAllEnrollments();
  res.json(enrollments);
};

export const getEnrollmentsByStudentController = async (req, res) => {
  const enrollments = await enrollmentService.getEnrollmentsByStudent(req.params.student_id);
  res.json(enrollments);
};

export const getEnrollmentsByClassController = async (req, res) => {
  const enrollments = await enrollmentService.getEnrollmentsByClass(req.params.class_id);
  res.json(enrollments);
};

export const deleteEnrollmentController = async (req, res) => {
  try {
    const result = await enrollmentService.deleteEnrollment(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
