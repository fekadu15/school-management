import { useEffect, useState } from 'react';
import { getClasses, createClass, updateClass, deleteClass } from '../../api/classApi';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: '', academic_year: '2026' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Class name is required';
    if (!form.academic_year.trim()) newErrors.academic_year = 'Academic year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateClass(editingId, form);
        setEditingId(null);
      } else {
        await createClass(form);
      }
      setForm({ name: '', academic_year: '2026' });
      setErrors({});
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setForm({ name: cls.name, academic_year: cls.academic_year });
    setErrors({});
  };

  const handleDelete = async () => {
    if (deleteDialog.id) {
      await deleteClass(deleteDialog.id);
      fetchClasses();
    }
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Classes Management
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
              label="Class Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Academic Year"
              name="academic_year"
              value={form.academic_year}
              onChange={handleChange}
              error={!!errors.academic_year}
              helperText={errors.academic_year}
              sx={{ flex: 1, minWidth: 150 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ minWidth: 200, height: 56 }}
            >
              {editingId ? 'Update Class' : 'Create Class'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Table sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <TableHead sx={{ backgroundColor: '#1976d2'}}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Academic Year</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classes.map((cls) => (
            <TableRow key={cls.id}>
              <TableCell>{cls.id}</TableCell>
              <TableCell>{cls.name}</TableCell>
              <TableCell>{cls.academic_year}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(cls)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setDeleteDialog({ open: true, id: cls.id })}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Delete Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this class? This action cannot be undone.
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
