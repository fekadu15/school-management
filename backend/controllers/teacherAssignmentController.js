import * as assignmentService from '../services/teacherAssignmentService.js';

export const createAssignmentController = async (req, res) => {
  try {
    const assignment = await assignmentService.createAssignment(req.body);
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllAssignmentsController = async (req, res) => {
  const assignments = await assignmentService.getAllAssignments();
  res.json(assignments);
};

export const getAssignmentByIdController = async (req, res) => {
  const assignment = await assignmentService.getAssignmentById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  res.json(assignment);
};

export const updateAssignmentController = async (req, res) => {
  try {
    const updated = await assignmentService.updateAssignment(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAssignmentController = async (req, res) => {
  try {
    const result = await assignmentService.deleteAssignment(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const getTeacherAssignmentsController = async (req, res) => {
  try {
    const teacherId = req.user.id; 
    const assignments = await assignmentService.getAssignmentsByTeacher(teacherId);
    res.json(assignments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
