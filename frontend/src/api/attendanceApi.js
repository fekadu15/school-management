import api from './axios';


export const getTeacherAssignments = async () => {
  const res = await api.get('/teacher-assignments');
  return res.data;
};

export const getStudentsByClass = async (classId) => {
  const res = await api.get(`/enrollments/class/${classId}`);
  return res.data;
};

export const getAttendance = async (classId, subjectId) => {
  const res = await api.get(`/attendance/class/${classId}/subject/${subjectId}`);
  return res.data;
};

export const saveAttendance = async (records) => {
  const res = await api.post('/attendance', records);
  return res.data;
};
export const getAttendanceByStudent = async (studentId) => {
  const res = await api.get(`/attendance/student/${studentId}`);
  return res.data;
};

