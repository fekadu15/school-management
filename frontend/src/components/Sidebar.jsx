import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getUserRole } from '../utils/auth';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GradeIcon from '@mui/icons-material/Grade';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Sidebar() {
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'rgba(25,118,210,0.15)' : 'transparent',
    borderRadius: 8,
    marginBottom: 4
  });

  return (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        background: 'linear-gradient(180deg, #0f172a, #1e293b)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        p: 2
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
        {role?.toUpperCase()} PANEL
      </Typography>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mb: 2 }} />

      <List sx={{ flexGrow: 1 }}>
        {role === 'admin' && (
          <>
            <ListItemButton component={NavLink} to="/admin/dashboard" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/admin/users" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/admin/classes" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><ClassIcon /></ListItemIcon>
              <ListItemText primary="Classes" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/admin/subjects" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><BookIcon /></ListItemIcon>
              <ListItemText primary="Subjects" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/admin/assignments" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Assignments" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/admin/enrollments" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><HowToRegIcon /></ListItemIcon>
              <ListItemText primary="Enrollments" />
            </ListItemButton>
          </>
        )}

        {role === 'teacher' && (
          <>
            <ListItemButton component={NavLink} to="/teacher/dashboard" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/teacher/attendance" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><FactCheckIcon /></ListItemIcon>
              <ListItemText primary="Attendance" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/teacher/grades" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><GradeIcon /></ListItemIcon>
              <ListItemText primary="Grades" />
            </ListItemButton>
          </>
        )}

        {role === 'student' && (
          <>
            <ListItemButton component={NavLink} to="/student/dashboard" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/student/attendance" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><FactCheckIcon /></ListItemIcon>
              <ListItemText primary="My	Attendance" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/student/grades" style={navItemStyle}>
              <ListItemIcon sx={{ color: 'white' }}><GradeIcon /></ListItemIcon>
              <ListItemText primary="My Grades" />
            </ListItemButton>
          </>
        )}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mb: 2 }} />

      <Button
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        fullWidth
      >
        Logout
      </Button>
    </Box>
  );
}
