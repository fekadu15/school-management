export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const decodeToken = (token) => {
  if (!token) return null;

  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded.role;
};
