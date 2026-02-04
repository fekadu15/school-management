import { useEffect, useState } from 'react';
import {
  getGradesByClassSubject,
  saveGrade,
  updateGrade,
  deleteGrade
} from '../../api/gradeApi';
import {
  getStudentsByClass,
  getTeacherAssignments
} from '../../api/attendanceApi';
import Loading from '../../components/Loading';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Alert,
  Paper,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Grade() {
  const [assignments, setAssignments] = useState([]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await getTeacherAssignments();
        setAssignments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (!classId || !subjectId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const studentsData = await getStudentsByClass(classId);
        setStudents(studentsData);

        const gradesData = await getGradesByClassSubject(classId, subjectId);
        const map = {};
        gradesData.forEach(g => {
          map[g.student_id] = { id: g.id, score: g.score };
        });
        setGrades(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId, subjectId]);

  const handleScoreChange = (studentId, score) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score
      }
    }));
  };

  const handleSaveNewGrades = async () => {
    try {
      setSaving(true);
      setMessage('');
      const promises = students
        .filter(s => !grades[s.student_id]?.id && grades[s.student_id]?.score)
        .map(s =>
          saveGrade({
            student_id: s.student_id,
            class_id: Number(classId),
            subject_id: Number(subjectId),
            score: grades[s.student_id].score
          })
        );

      if (!promises.length) {
        setMessage('No new grades to save.');
        return;
      }

      await Promise.all(promises);
      setMessage('New grades saved successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to save grades.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateGrade = async studentId => {
    try {
      setSaving(true);
      setMessage('');
      const grade = grades[studentId];
      if (!grade?.id) return;
      await updateGrade(grade.id, grade.score);
      setMessage('Grade updated successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update grade.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGrade = async studentId => {
    try {
      setSaving(true);
      setMessage('');
      const grade = grades[studentId];
      if (!grade?.id) return;
      await deleteGrade(grade.id);
      setGrades(prev => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
      setMessage('Grade deleted successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete grade.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  // Filter students based on search
  const filteredStudents = students.filter(s =>
    s.student_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        textAlign="center"
        color="primary"
      >
        Manage Grades
      </Typography>

      {message && (
        <Alert
          severity={message.includes('successfully') ? 'success' : 'error'}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ flex: 1, minWidth: 150 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={classId}
              onChange={e => setClassId(e.target.value)}
              label="Class"
            >
              <MenuItem value="">
                <em>Select Class</em>
              </MenuItem>
              {assignments.map(a => (
                <MenuItem key={a.class_id} value={a.class_id}>
                  {a.class_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              label="Subject"
              disabled={!classId}
            >
              <MenuItem value="">
                <em>Select Subject</em>
              </MenuItem>
              {assignments
                .filter(a => a.class_id === Number(classId))
                .map(a => (
                  <MenuItem key={a.subject_id} value={a.subject_id}>
                    {a.subject_name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TextField
            placeholder="Search students"
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
      )}

      {filteredStudents.length > 0 ? (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((s, index) => {
                const grade = grades[s.student_id];
                return (
                  <TableRow
                    key={s.student_id}
                    sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}
                  >
                    <TableCell>{s.student_name}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={grade?.score || ''}
                        onChange={e => handleScoreChange(s.student_id, e.target.value)}
                        size="small"
                        sx={{ minWidth: 100 }}
                      />
                    </TableCell>
                    <TableCell>
                      {grade?.id ? (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleUpdateGrade(s.student_id)}
                            disabled={saving}
                            sx={{ mr: 1 }}
                          >
                            Update
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => handleDeleteGrade(s.student_id)}
                            disabled={saving}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          New
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', backgroundColor: '#f5f5f5' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveNewGrades}
              disabled={saving}
              sx={{ minWidth: 150 }}
            >
              {saving ? 'Saving...' : 'Save New Grades'}
            </Button>
          </Box>
        </Paper>
      ) : (
        classId &&
        subjectId && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No students found for this class and subject.
          </Alert>
        )
      )}
    </Box>
  );
}
