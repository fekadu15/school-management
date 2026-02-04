import pool from '../utils/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

export const login = async (email, password) => {

  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = rows[0];

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({ id: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      f_name: user.f_name,
      l_name: user.l_name,
      email: user.email,
      role: user.role,
    },
  };
};
export const signup = async ({ f_name, l_name, email, password, role }) => {

  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (rows.length) {
    throw new Error('Email already exixsts try logging in instead');
  }

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

