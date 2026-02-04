import { useEffect, useState } from 'react';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../../api/subjectApi';
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

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Subject name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateSubject(editingId, form);
        setEditingId(null);
      } else {
        await createSubject(form);
      }
      setForm({ name: '', code: '' });
      setErrors({});
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setForm({ name: subject.name, code: subject.code || '' });
    setErrors({});
  };

  const handleDelete = async () => {
    if (deleteDialog.id) {
      await deleteSubject(deleteDialog.id);
      fetchSubjects();
    }
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Subjects Management
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
              label="Subject Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Code (optional)"
              name="code"
              value={form.code}
              onChange={handleChange}
              sx={{ flex: 1, minWidth: 150 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ minWidth: 200, height: 56 }}
            >
              {editingId ? 'Update Subject' : 'Create Subject'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Table sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <TableHead sx={{ backgroundColor: '#1976d2' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Code</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.id}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.code}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setDeleteDialog({ open: true, id: s.id })}
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
        <DialogTitle>Delete Subject</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this subject? This action cannot be undone.
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
