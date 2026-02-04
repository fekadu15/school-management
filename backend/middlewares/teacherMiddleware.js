import pool from '../utils/db.js';

export const authorizeTeacherForSubject = async (req, res, next) => {
  const user = req.user; 

  let { class_id, subject_id } = req.body || {};

  if ((!class_id || !subject_id) && req.params.id) {
    try {
      const { rows } = await pool.query(
        'SELECT class_id, subject_id FROM grades WHERE id=$1',
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Grade not found' });
      }

      class_id = rows[0].class_id;
      subject_id = rows[0].subject_id;
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  if (user.role === 'admin') return next(); 

  if (user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can perform this action' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT * FROM teacher_assignments
       WHERE teacher_id=$1 AND class_id=$2 AND subject_id=$3`,
      [user.id, class_id, subject_id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'You are not assigned to this class/subject' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
