import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldError({ email: '', password: '' });

    let hasError = false;
    const newFieldError = { email: '', password: '' };

    if (!email.trim()) {
      newFieldError.email = 'Email is required';
      hasError = true;
    }
    if (!password.trim()) {
      newFieldError.password = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      setFieldError(newFieldError);
      return;
    }

    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);

      const role = data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            color="primary"
          >
            School System
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Sign in to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!fieldError.email}
              helperText={fieldError.email}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!fieldError.password}
              helperText={fieldError.password}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.4,
                fontWeight: 'bold',
                borderRadius: 2
              }}
            >
              Login
            </Button>
          </Box>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={3}
            color="text.secondary"
          >
            © {new Date().getFullYear()} School Management System
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
