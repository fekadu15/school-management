import { getStudentReport } from '../services/reportService.js';

export const getMyReportController = async (req, res) => {
  try {
    const report = await getStudentReport(req.user.id);
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentReportByAdminController = async (req, res) => {
  try {
    const report = await getStudentReport(req.params.student_id);
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
