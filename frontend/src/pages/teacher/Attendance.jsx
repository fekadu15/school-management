import { useEffect, useState } from 'react';
import {
  getTeacherAssignments,
  getStudentsByClass,
  getAttendance,
  saveAttendance
} from '../../api/attendanceApi';
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
  Button,
  Alert,
  TextField,
  Paper,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Attendance() {
  const [assignments, setAssignments] = useState([]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');


  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await getTeacherAssignments(); 
        setAssignments(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAssignments();
  }, []);

 
  useEffect(() => {
    if (!classId || !subjectId || !date) return;

    const loadData = async () => {
      try {
        const studentsData = await getStudentsByClass(classId);
        setStudents(studentsData);

        const attendanceData = await getAttendance(classId, subjectId);
        const todayAttendance = attendanceData.filter(a => a.date === date);

        const map = {};
        todayAttendance.forEach(a => {
          map[a.student_id] = a.status;
        });

        setAttendance(map);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [classId, subjectId, date]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setMessage('');

      const promises = students.map(s =>
        saveAttendance({
          student_id: s.student_id,
          class_id: Number(classId),
          subject_id: Number(subjectId),
          date,
          status: attendance[s.student_id] || 'present'
        })
      );

      await Promise.all(promises);
      setMessage('Attendance saved successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered students based on search
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
        Mark Attendance
      </Typography>

      {message && (
        <Alert
          severity={message.includes('successfully') ? 'success' : 'error'}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, minWidth: 150 }}
          />

          <FormControl sx={{ flex: 1, minWidth: 150 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              label="Class"
            >
              <MenuItem value="">
                <em>Select Class</em>
              </MenuItem>
              {assignments
                .map(a => ({ class_id: a.class_id, class_name: a.class_name }))
                .filter((v, i, self) => self.findIndex(c => c.class_id === v.class_id) === i)
                .map(a => (
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
              onChange={(e) => setSubjectId(e.target.value)}
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

      {/* Search Field */}
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

      {/* Attendance Table */}
      {filteredStudents.length > 0 ? (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((s, index) => (
                <TableRow
                  key={s.student_id}
                  sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}
                >
                  <TableCell>{s.student_name}</TableCell>
                  <TableCell>
                    <Select
                      value={attendance[s.student_id] || 'present'}
                      onChange={(e) => handleStatusChange(s.student_id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: '#f5f5f5'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={saving}
              sx={{ minWidth: 150 }}
            >
              {saving ? 'Saving...' : 'Save Attendance'}
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
