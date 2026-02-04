import pool from '../utils/db.js';

export const createClass = async ({ name, academic_year }) => {
  const insertQuery = `
    INSERT INTO classes (name, academic_year)
    VALUES ($1, $2)
    RETURNING id, name, academic_year
  `;
  const { rows } = await pool.query(insertQuery, [name, academic_year]);
  return rows[0];
};

export const getAllClasses = async () => {
  const { rows } = await pool.query(`
    SELECT id, name, academic_year FROM classes
  `);
  return rows;
};

export const getClassById = async (id) => {
  const { rows } = await pool.query(`
    SELECT id, name, academic_year FROM classes
    WHERE id=$1
  `, [id]);
  return rows[0];
};

export const updateClass = async (id, { name, academic_year }) => {
  const updateQuery = `
    UPDATE classes
    SET name = COALESCE($1, name),
        academic_year = COALESCE($2, academic_year)
    WHERE id=$3
    RETURNING id, name, academic_year
  `;
  const { rows } = await pool.query(updateQuery, [name, academic_year, id]);
  return rows[0];
};

export const deleteClass = async (id) => {
  await pool.query('DELETE FROM classes WHERE id=$1', [id]);
  return { message: 'Class deleted successfully' };
};
