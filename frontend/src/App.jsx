import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUserRole } from './utils/auth';

import Login from './auth/Login';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import AdminDashboard from './pages/admin/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard'
import StudentDashboard from './pages/student/Dashboard'
import Users from './pages/admin/Users';
import Classes from './pages/admin/Classes';
import Subjects from './pages/admin/Subjects';
import Assignments from './pages/admin/Assignments';
import Enrollments from './pages/admin/Enrollments';
import Attendance from './pages/teacher/Attendance';
import Grade from './pages/teacher/Grade';
import StudentGrades from './pages/student/StudentGrades';
import StudentAttendance from './pages/student/StudentAttendance';
const RootRedirect = () => {
  const role = getUserRole();
  if (!role) return <Navigate to="/login" />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" />;
  if (role === 'teacher') return <Navigate to="/teacher/dashboard" />;
  if (role === 'student') return <Navigate to="/student/dashboard" />;
  return <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="classes" element={<Classes />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="enrollments" element={<Enrollments />} />
        </Route>
   
<Route
  path="/teacher"
  element={
    <ProtectedRoute allowedRoles={['teacher']}>
      <AppLayout />
    </ProtectedRoute>
  }
>
 <Route path="dashboard" element={<TeacherDashboard />} />
  <Route path="attendance" element={<Attendance />} />
  <Route path="grades" element={<Grade />} />
</Route>

<Route
  path="/student"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <AppLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<StudentDashboard />} />
  <Route path="grades" element={<StudentGrades />} />
  <Route path='attendance' element={<StudentAttendance/>} />
</Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
