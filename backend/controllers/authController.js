import * as authService from '../services/authService.js';

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
export const signupController = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

