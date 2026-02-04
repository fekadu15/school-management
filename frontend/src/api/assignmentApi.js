import api from './axios';


export const getAssignments = async () => {
  const res = await api.get('/teacher-assignments');
  return res.data;
};

export const createAssignment = async (data) => {
  const res = await api.post('/teacher-assignments', data);
  return res.data;
};

export const updateAssignment = async (id, data) => {
  const res = await api.put(`/teacher-assignments/${id}`, data);
  return res.data;
};

export const deleteAssignment = async (id) => {
  const res = await api.delete(`/teacher-assignments/${id}`);
  return res.data;
};
