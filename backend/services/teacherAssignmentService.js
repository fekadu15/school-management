import pool from '../utils/db.js';

export const createAssignment = async ({ teacher_id, subject_id, class_id }) => {
  const insertQuery = `
    INSERT INTO teacher_assignments (teacher_id, subject_id, class_id)
    VALUES ($1, $2, $3)
    RETURNING id, teacher_id, subject_id, class_id
  `;
  const { rows } = await pool.query(insertQuery, [teacher_id, subject_id, class_id]);
  return rows[0];
};

export const getAllAssignments = async () => {
  const { rows } = await pool.query(`
    SELECT ta.id, ta.teacher_id, ta.subject_id, ta.class_id,
           u.f_name || ' ' || u.l_name AS teacher_name,
           s.name AS subject_name,
           c.name AS class_name, c.academic_year
    FROM teacher_assignments ta
    JOIN users u ON ta.teacher_id = u.id
    JOIN subjects s ON ta.subject_id = s.id
    JOIN classes c ON ta.class_id = c.id
  `);
  return rows;
};

export const getAssignmentById = async (id) => {
  const { rows } = await pool.query(`
    SELECT ta.id, ta.teacher_id, ta.subject_id, ta.class_id,
           u.f_name || ' ' || u.l_name AS teacher_name,
           s.name AS subject_name,
           c.name AS class_name, c.academic_year
    FROM teacher_assignments ta
    JOIN users u ON ta.teacher_id = u.id
    JOIN subjects s ON ta.subject_id = s.id
    JOIN classes c ON ta.class_id = c.id
    WHERE ta.id=$1
  `, [id]);
  return rows[0];
};

export const getAssignmentsByTeacher = async (teacherId) => {
  const { rows } = await pool.query(`
    SELECT ta.id, ta.teacher_id, ta.subject_id, ta.class_id,
           u.f_name || ' ' || u.l_name AS teacher_name,
           s.name AS subject_name,
           c.name AS class_name, c.academic_year
    FROM teacher_assignments ta
    JOIN users u ON ta.teacher_id = u.id
    JOIN subjects s ON ta.subject_id = s.id
    JOIN classes c ON ta.class_id = c.id
    WHERE ta.teacher_id = $1
  `, [teacherId]);

  return rows;
};

export const updateAssignment = async (id, { teacher_id, subject_id, class_id }) => {
  const updateQuery = `
    UPDATE teacher_assignments
    SET teacher_id = COALESCE($1, teacher_id),
        subject_id = COALESCE($2, subject_id),
        class_id = COALESCE($3, class_id)
    WHERE id=$4
    RETURNING id, teacher_id, subject_id, class_id
  `;
  const { rows } = await pool.query(updateQuery, [teacher_id, subject_id, class_id, id]);
  return rows[0];
};

export const deleteAssignment = async (id) => {
  await pool.query('DELETE FROM teacher_assignments WHERE id=$1', [id]);
  return { message: 'Teacher assignment deleted successfully' };
};
