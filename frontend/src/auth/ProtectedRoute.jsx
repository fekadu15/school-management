import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
