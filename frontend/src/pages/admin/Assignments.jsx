import { useEffect, useState } from 'react';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment } from '../../api/assignmentApi';
import { getUsers } from '../../api/userApi';
import { getClasses } from '../../api/classApi';
import { getSubjects } from '../../api/subjectApi';
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
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ teacher_id: '', class_id: '', subject_id: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [assignData, teacherData, classData, subjectData] = await Promise.all([
        getAssignments(),
        getUsers(),
        getClasses(),
        getSubjects(),
      ]);
      setAssignments(assignData);
      setTeachers(teacherData.filter(u => u.role === 'teacher'));
      setClasses(classData);
      setSubjects(subjectData);
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
    if (!form.teacher_id) newErrors.teacher_id = 'Teacher is required';
    if (!form.class_id) newErrors.class_id = 'Class is required';
    if (!form.subject_id) newErrors.subject_id = 'Subject is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (editingId) {
        await updateAssignment(editingId, form);
        setEditingId(null);
      } else {
        await createAssignment(form);
      }
      setForm({ teacher_id: '', class_id: '', subject_id: '' });
      setErrors({});
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setForm({ teacher_id: a.teacher_id, class_id: a.class_id, subject_id: a.subject_id });
    setErrors({});
  };

  const handleDelete = async () => {
    if (deleteDialog.id) {
      await deleteAssignment(deleteDialog.id);
      fetchData();
    }
    setDeleteDialog({ open: false, id: null });
  };

  const filteredAssignments = assignments.filter(a =>
    `${a.teacher_name} ${a.class_name} ${a.subject_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>Teacher Assignments</Typography>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box component="form" display="flex" gap={2} flexWrap="wrap" alignItems="center" onSubmit={handleSubmit}>
            <FormControl sx={{ flex: 1, minWidth: 150 }} error={!!errors.teacher_id}>
              <InputLabel>Teacher</InputLabel>
              <Select name="teacher_id" value={form.teacher_id} onChange={handleChange} label="Teacher">
                {teachers.map(t => <MenuItem key={t.id} value={t.id}>{t.f_name} {t.l_name}</MenuItem>)}
              </Select>
              {errors.teacher_id && <Typography variant="caption" color="error">{errors.teacher_id}</Typography>}
            </FormControl>

            <FormControl sx={{ flex: 1, minWidth: 150 }} error={!!errors.class_id}>
              <InputLabel>Class</InputLabel>
              <Select name="class_id" value={form.class_id} onChange={handleChange} label="Class">
                {classes.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
              {errors.class_id && <Typography variant="caption" color="error">{errors.class_id}</Typography>}
            </FormControl>

            <FormControl sx={{ flex: 1, minWidth: 150 }} error={!!errors.subject_id}>
              <InputLabel>Subject</InputLabel>
              <Select name="subject_id" value={form.subject_id} onChange={handleChange} label="Subject">
                {subjects.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
              {errors.subject_id && <Typography variant="caption" color="error">{errors.subject_id}</Typography>}
            </FormControl>

            <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 200, height: 56 }}>
              {editingId ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          placeholder="Search assignments"
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
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Teacher</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAssignments.map(a => (
            <TableRow key={a.id}>
              <TableCell>{a.id}</TableCell>
              <TableCell>{a.teacher_name}</TableCell>
              <TableCell>{a.class_name}</TableCell>
              <TableCell>{a.subject_name}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => handleEdit(a)}>Edit</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => setDeleteDialog({ open: true, id: a.id })}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Delete Assignment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this assignment? This action cannot be undone.
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
