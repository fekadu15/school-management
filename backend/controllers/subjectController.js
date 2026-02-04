import * as subjectService from '../services/subjectService.js';

export const createSubjectController = async (req, res) => {
  try {
    const newSubject = await subjectService.createSubject(req.body);
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllSubjectsController = async (req, res) => {
  const subjects = await subjectService.getAllSubjects();
  res.json(subjects);
};

export const getSubjectByIdController = async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.id);
  if (!subject) return res.status(404).json({ message: 'Subject not found' });
  res.json(subject);
};

export const updateSubjectController = async (req, res) => {
  try {
    const updatedSubject = await subjectService.updateSubject(req.params.id, req.body);
    res.json(updatedSubject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSubjectController = async (req, res) => {
  try {
    const result = await subjectService.deleteSubject(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
