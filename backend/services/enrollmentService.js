import pool from '../utils/db.js';

export const createEnrollment = async ({ student_id, class_id }) => {
  const insertQuery = `
    INSERT INTO enrollments (student_id, class_id)
    VALUES ($1, $2)
    RETURNING id, student_id, class_id
  `;
  const { rows } = await pool.query(insertQuery, [student_id, class_id]);
  return rows[0];
};

export const getAllEnrollments = async () => {
  const { rows } = await pool.query(`
    SELECT e.id, e.student_id, e.class_id,
           u.f_name || ' ' || u.l_name AS student_name,
           c.name AS class_name, c.academic_year
    FROM enrollments e
    JOIN users u ON e.student_id = u.id
    JOIN classes c ON e.class_id = c.id
  `);
  return rows;
};

export const getEnrollmentsByStudent = async (student_id) => {
  const { rows } = await pool.query(`
    SELECT e.id, e.student_id, e.class_id,
           c.name AS class_name, c.academic_year
    FROM enrollments e
    JOIN classes c ON e.class_id = c.id
    WHERE e.student_id=$1
  `, [student_id]);
  return rows;
};

export const getEnrollmentsByClass = async (class_id) => {
  const { rows } = await pool.query(`
    SELECT e.id, e.student_id, e.class_id,
           u.f_name || ' ' || u.l_name AS student_name
    FROM enrollments e
    JOIN users u ON e.student_id = u.id
    WHERE e.class_id=$1
  `, [class_id]);
  return rows;
};

export const deleteEnrollment = async (id) => {
  await pool.query('DELETE FROM enrollments WHERE id=$1', [id]);
  return { message: 'Enrollment deleted successfully' };
};
