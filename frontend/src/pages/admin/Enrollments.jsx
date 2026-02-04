import { useEffect, useState } from 'react';
import { 
  getEnrollments,
  createEnrollment, 
  updateEnrollment,
  deleteEnrollment 
} from '../../api/enrollmentApi';
import { getUsers } from '../../api/userApi';
import { getClasses } from '../../api/classApi';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ student_id: '', class_id: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [enrollData, studentData, classData] = await Promise.all([
        getEnrollments(),
        getUsers(),
        getClasses(),
      ]);
      setEnrollments(enrollData);
      setClasses(classData);
      setStudents(studentData.filter(u => u.role === 'student'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const newErrors = {};
    if (!form.student_id) newErrors.student_id = 'Student is required';
    if (!form.class_id) newErrors.class_id = 'Class is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateEnrollment(editingId, form);
        setEditingId(null);
      } else {
        await createEnrollment(form);
      }
      setForm({ student_id: '', class_id: '' });
      setErrors({});
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (enroll) => {
    setEditingId(enroll.id);
    setForm({ student_id: enroll.student_id, class_id: enroll.class_id });
    setErrors({});
  };

  const handleDelete = async () => {
    if (deleteDialog.id) {
      await deleteEnrollment(deleteDialog.id);
      fetchData();
    }
    setDeleteDialog({ open: false, id: null });
  };

  const filteredEnrollments = enrollments.filter(e =>
    `${e.student_name} ${e.class_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>Enrollments</Typography>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box component="form" display="flex" gap={2} flexWrap="wrap" alignItems="center" onSubmit={handleSubmit}>

            <Autocomplete
              options={students.filter(s => 
                !enrollments.some(e => e.student_id === s.id && e.id !== editingId)
              )}
              getOptionLabel={(option) => `${option.f_name} ${option.l_name}`}
              value={students.find(s => s.id === form.student_id) || null}
              onChange={(event, newValue) => {
                setForm({ ...form, student_id: newValue ? newValue.id : '' });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Student"
                  error={!!errors.student_id}
                  helperText={errors.student_id}
                  sx={{ flex: 1, minWidth: 180 }}
                />
              )}
            />

            <FormControl sx={{ flex: 1, minWidth: 180 }} error={!!errors.class_id}>
              <InputLabel>Class</InputLabel>
              <Select name="class_id" value={form.class_id} onChange={handleChange} label="Class">
                {classes.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
              {errors.class_id && <Typography variant="caption" color="error">{errors.class_id}</Typography>}
            </FormControl>

            <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 200, height: 56 }}>
              {editingId ? 'Update Enrollment' : 'Create Enrollment'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          placeholder="Search enrollments"
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
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEnrollments.map(e => (
            <TableRow key={e.id}>
              <TableCell>{e.id}</TableCell>
              <TableCell>{e.student_name}</TableCell>
              <TableCell>{e.class_name}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => handleEdit(e)}>Edit</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => setDeleteDialog({ open: true, id: e.id })}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Delete Enrollment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this enrollment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
