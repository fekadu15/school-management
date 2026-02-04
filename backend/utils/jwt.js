import jwt from 'jsonwebtoken';
import config from './config.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
