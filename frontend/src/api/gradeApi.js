import api from './axios';

export const getGradesByClassSubject = async (classId, subjectId) => {
  try {
    const res = await api.get(`/grades/class/${classId}/subject/${subjectId}`);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to fetch grades';
    throw new Error(message);
  }
};
export const saveGrade = async (record) => {
  try {
    const res = await api.post('/grades', record);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to save grade';
    throw new Error(message);
  }
};

export const updateGrade = async (id, score) => {
  try {
    const res = await api.put(`/grades/${id}`, { score });
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to update grade';
    throw new Error(message);
  }
};

export const deleteGrade = async (id) => {
  try {
    const res = await api.delete(`/grades/${id}`);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to delete grade';
    throw new Error(message);
  }
};
export const getGradesByStudent = async (studentId) => {
  try {
    const res = await api.get(`/grades/student/${studentId}`);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || 'Failed to fetch student grades';
    throw new Error(message);
  }
};
