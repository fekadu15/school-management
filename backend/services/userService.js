import pool from '../utils/db.js';
import bcrypt from 'bcrypt';

export const createUser = async ({ f_name, l_name, email, password, role }) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (rows.length) throw new Error('Email already in use');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const insertQuery = `
    INSERT INTO users (f_name, l_name, email, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, f_name, l_name, email, role
  `;
  const result = await pool.query(insertQuery, [f_name, l_name, email, hashedPassword, role]);

  return result.rows[0];
};

export const getAllUsers = async (role) => {
  if (role) {
    const { rows } = await pool.query(
      'SELECT id, f_name, l_name, email, role FROM users WHERE role = $1',
      [role]
    );
    return rows;
  }

  const { rows } = await pool.query(
    'SELECT id, f_name, l_name, email, role FROM users'
  );
  return rows;
};


export const getUserById = async (id) => {
  const { rows } = await pool.query('SELECT id, f_name, l_name, email, role FROM users WHERE id=$1', [id]);
  return rows[0];
};

export const updateUser = async (id, data) => {
  const { f_name, l_name, email, role, password } = data;
  let hashedPassword = undefined;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const updateQuery = `
    UPDATE users
    SET f_name = COALESCE($1, f_name),
        l_name = COALESCE($2, l_name),
        email = COALESCE($3, email),
        role = COALESCE($4, role),
        password = COALESCE($5, password)
    WHERE id=$6
    RETURNING id, f_name, l_name, email, role
  `;
  const result = await pool.query(updateQuery, [f_name, l_name, email, role, hashedPassword, id]);
  return result.rows[0];
};

export const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id=$1', [id]);
  return { message: 'User deleted successfully' };
};
