import pool from '../utils/db.js';
export const markAttendance = async ({
  student_id,
  class_id,
  subject_id,
  date,
  status
}) => {
  const query = `
    INSERT INTO attendance (student_id, class_id, subject_id, date, status)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (student_id, class_id, subject_id, date)
    DO UPDATE SET status = EXCLUDED.status
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    student_id,
    class_id,
    subject_id,
    date,
    status
  ]);

  return rows[0];
};


export const getAllAttendance = async () => {
  const { rows } = await pool.query(`
    SELECT a.*, 
           u.f_name AS student_first_name, u.l_name AS student_last_name,
           c.name AS class_name, s.name AS subject_name
    FROM attendance a
    JOIN users u ON a.student_id = u.id
    JOIN classes c ON a.class_id = c.id
    JOIN subjects s ON a.subject_id = s.id
  `);
  return rows;
};

export const getAttendanceByStudent = async (student_id) => {
  const { rows } = await pool.query(`
    SELECT a.*, c.name AS class_name, s.name AS subject_name
    FROM attendance a
    JOIN classes c ON a.class_id = c.id
    JOIN subjects s ON a.subject_id = s.id
    WHERE a.student_id=$1
  `, [student_id]);
  return rows;
};


export const getAttendanceByClassSubject = async (class_id, subject_id) => {
  const { rows } = await pool.query(`
    SELECT a.*, u.f_name AS student_first_name, u.l_name AS student_last_name
    FROM attendance a
    JOIN users u ON a.student_id = u.id
    WHERE a.class_id=$1 AND a.subject_id=$2
  `, [class_id, subject_id]);
  return rows;
};


export const updateAttendance = async (id, { status }) => {
  const updateQuery = `
    UPDATE attendance
    SET status = $1
    WHERE id=$2
    RETURNING *
  `;
  const { rows } = await pool.query(updateQuery, [status, id]);
  return rows[0];
};


export const deleteAttendance = async (id) => {
  await pool.query('DELETE FROM attendance WHERE id=$1', [id]);
  return { message: 'Attendance record deleted successfully' };
};
