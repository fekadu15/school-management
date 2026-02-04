import pool from '../utils/db.js';
export const createGrade = async ({ student_id, class_id, subject_id, score }) => {
  try {
    const query = `
      INSERT INTO grades (student_id, class_id, subject_id, score)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      student_id,
      class_id,
      subject_id,
      score,
    ]);

    return rows[0];
  } catch (err) {

    if (err.code === '23505') {
      throw new Error(
        'Grade already exists try update'
      );
    }
    throw err;
  }
};

export const getAllGrades = async () => {
  const { rows } = await pool.query(`
    SELECT g.*, 
           u.f_name AS student_first_name,
           u.l_name AS student_last_name,
           c.name AS class_name,
           s.name AS subject_name
    FROM grades g
    JOIN users u ON g.student_id = u.id
    JOIN classes c ON g.class_id = c.id
    JOIN subjects s ON g.subject_id = s.id
    ORDER BY c.name, s.name, u.f_name
  `);
  return rows;
};

export const getGradesByStudent = async (student_id) => {
  const { rows } = await pool.query(
    `
    SELECT g.*, 
           c.name AS class_name, 
           s.name AS subject_name
    FROM grades g
    JOIN classes c ON g.class_id = c.id
    JOIN subjects s ON g.subject_id = s.id
    WHERE g.student_id = $1
    ORDER BY c.name, s.name
  `,
    [student_id]
  );
  return rows;
};

export const getGradesByClassSubject = async (class_id, subject_id) => {
  const { rows } = await pool.query(
    `
    SELECT g.*, 
           u.f_name AS student_first_name,
           u.l_name AS student_last_name
    FROM grades g
    JOIN users u ON g.student_id = u.id
    WHERE g.class_id = $1 
      AND g.subject_id = $2
    ORDER BY u.f_name
  `,
    [class_id, subject_id]
  );
  return rows;
};

export const updateGrade = async (id, score) => {
  const { rows, rowCount } = await pool.query(
    `
    UPDATE grades
    SET score = $1
    WHERE id = $2
    RETURNING *
  `,
    [score, id]
  );

  if (rowCount === 0) {
    throw new Error('Grade not found');
  }

  return rows[0];
};

export const deleteGrade = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM grades WHERE id = $1',
    [id]
  );

  if (rowCount === 0) {
    throw new Error('Grade not found or already deleted');
  }

  return { message: 'Grade deleted successfully' };
};
