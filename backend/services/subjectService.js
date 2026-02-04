import pool from '../utils/db.js';

export const createSubject = async ({ name, code }) => {
  const insertQuery = `
    INSERT INTO subjects (name, code)
    VALUES ($1, $2)
    RETURNING id, name, code
  `;
  const { rows } = await pool.query(insertQuery, [name, code]);
  return rows[0];
};

export const getAllSubjects = async () => {
  const { rows } = await pool.query(`
    SELECT id, name, code FROM subjects
  `);
  return rows;
};

export const getSubjectById = async (id) => {
  const { rows } = await pool.query(`
    SELECT id, name, code FROM subjects
    WHERE id=$1
  `, [id]);
  return rows[0];
};

export const updateSubject = async (id, { name, code }) => {
  const updateQuery = `
    UPDATE subjects
    SET name = COALESCE($1, name),
        code = COALESCE($2, code)
    WHERE id=$3
    RETURNING id, name, code
  `;
  const { rows } = await pool.query(updateQuery, [name, code, id]);
  return rows[0];
};

export const deleteSubject = async (id) => {
  await pool.query('DELETE FROM subjects WHERE id=$1', [id]);
  return { message: 'Subject deleted successfully' };
};
