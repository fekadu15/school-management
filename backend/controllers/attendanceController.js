import * as attendanceService from '../services/attendanceService.js';

export const markAttendanceController = async (req, res) => {
  try {
    const record = await attendanceService.markAttendance(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllAttendanceController = async (req, res) => {
  const records = await attendanceService.getAllAttendance();
  res.json(records);
};

export const getAttendanceByStudentController = async (req, res) => {
  const user = req.user;


  const studentId = user.role === 'student' ? user.id : req.params.student_id;
  const records = await attendanceService.getAttendanceByStudent(studentId);
  res.json(records);
};

export const getAttendanceByClassSubjectController = async (req, res) => {
  const records = await attendanceService.getAttendanceByClassSubject(
    req.params.class_id,
    req.params.subject_id
  );
  res.json(records);
};

export const updateAttendanceController = async (req, res) => {
  try {
    const updated = await attendanceService.updateAttendance(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAttendanceController = async (req, res) => {
  try {
    const result = await attendanceService.deleteAttendance(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
