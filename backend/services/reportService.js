import pool from '../utils/db.js';
import { calculateGPA } from '../utils/gpaCalculator.js';

export const getStudentReport = async (student_id) => {
  const { rows } = await pool.query(`
    SELECT 
      g.score,
      s.name AS subject_name,
      c.name AS class_name
    FROM grades g
    JOIN subjects s ON g.subject_id = s.id
    JOIN classes c ON g.class_id = c.id
    WHERE g.student_id = $1
  `, [student_id]);

  const gpa = calculateGPA(rows);

  return {
    student_id,
    gpa,
    grades: rows
  };
};
