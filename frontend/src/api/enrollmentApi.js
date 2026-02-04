import api from './axios';


export const getEnrollments = async () => {
  const res = await api.get('/enrollments');
  return res.data;
};

export const createEnrollment = async (data) => {
  const res = await api.post('/enrollments', data);
  return res.data;
};

export const updateEnrollment = async (id, data) => {
  const res = await api.put(`/enrollments/${id}`, data);
  return res.data;
};


export const deleteEnrollment = async (id) => {
  const res = await api.delete(`/enrollments/${id}`);
  return res.data;
};
