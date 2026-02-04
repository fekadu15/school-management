import * as classService from '../services/classService.js';

export const createClassController = async (req, res) => {
  try {
    const newClass = await classService.createClass(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllClassesController = async (req, res) => {
  const classes = await classService.getAllClasses();
  res.json(classes);
};

export const getClassByIdController = async (req, res) => {
  const classData = await classService.getClassById(req.params.id);
  if (!classData) return res.status(404).json({ message: 'Class not found' });
  res.json(classData);
};

export const updateClassController = async (req, res) => {
  try {
    const updatedClass = await classService.updateClass(req.params.id, req.body);
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteClassController = async (req, res) => {
  try {
    const result = await classService.deleteClass(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
