import api from './axios';

export const getAllStudents = async () => {
  const res = await api.get('/users?role=student');
  return res.data;
};

export const getAllTeachers = async () => {
  const res = await api.get('/users?role=teacher');
  return res.data;
};

export const getAllClasses = async () => {
  const res = await api.get('/classes');
  return res.data;
};

export const getAllSubjects = async () => {
  const res = await api.get('/subjects');
  return res.data;
};

export const getAllAssignments = async () => {
  const res = await api.get('/teacher-assignments');
  return res.data;
};
