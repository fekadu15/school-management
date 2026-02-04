import * as userService from '../services/userService.js';

export const createUserController = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllUsersController = async (req, res) => {
  const { role } = req.query;
  const users = await userService.getAllUsers(role);
  res.json(users);
};


export const getUserByIdController = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const updateUserController = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
