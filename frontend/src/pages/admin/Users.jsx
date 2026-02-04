import { useEffect, useState } from 'react';
import { getUsers, createUser } from '../../api/userApi';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    f_name: '',
    l_name: '',
    email: '',
    password: '',
    role: 'teacher',
  });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.f_name.trim()) newErrors.f_name = 'First name is required';
    if (!form.l_name.trim()) newErrors.l_name = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await createUser(form);
      setForm({ f_name: '', l_name: '', email: '', password: '', role: 'teacher' });
      setErrors({});
      setErrorMsg('');
      fetchUsers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create user');
    }
  };

  const filteredUsers = users.filter(u =>
    `${u.f_name} ${u.l_name} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Users Management
      </Typography>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box
            component="form"
            display="flex"
            gap={2}
            flexWrap="wrap"
            alignItems="center"
            onSubmit={handleSubmit}
          >
            <TextField
              label="First Name"
              name="f_name"
              value={form.f_name}
              onChange={handleChange}
              error={!!errors.f_name}
              helperText={errors.f_name}
              sx={{ flex: 1, minWidth: 150 }}
            />
            <TextField
              label="Last Name"
              name="l_name"
              value={form.l_name}
              onChange={handleChange}
              error={!!errors.l_name}
              helperText={errors.l_name}
              sx={{ flex: 1, minWidth: 150 }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ flex: 1, minWidth: 150 }}
            />
            <FormControl sx={{ flex: 1, minWidth: 150 }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={form.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" sx={{ minWidth: 200, height: 56 }}>
              Create User
            </Button>
          </Box>
          {errorMsg && (
            <Typography color="error" mt={2}>
              {errorMsg}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Table sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <TableHead sx={{ backgroundColor: '#1976d2' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.f_name} {u.l_name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
