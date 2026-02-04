import api from './axios';

export const getUsers = async () => {
  const res = await api.get('/users'); 
  return res.data;
};

export const createUser = async (user) => {
  const res = await api.post('/users', user); 
  return res.data;
};
