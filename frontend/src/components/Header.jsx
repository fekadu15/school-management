import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { getToken, decodeToken, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const token = getToken();
  const user = decodeToken(token);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {user?.role?.toUpperCase()} DASHBOARD
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography>
            {user?.f_name} {user?.l_name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
