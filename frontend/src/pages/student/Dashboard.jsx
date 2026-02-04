import { useEffect, useState } from 'react';
import { getGradesByStudent } from '../../api/gradeApi';
import { getAttendanceByStudent } from '../../api/attendanceApi';
import { getToken, decodeToken } from '../../utils/auth';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@mui/material';

export default function StudentDashboard() {
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const user = decodeToken(token);
  const studentId = user?.id;

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      try {
        const gradesData = await getGradesByStudent(studentId);
        const attendanceData = await getAttendanceByStudent(studentId);

        setGrades(gradesData);
        setAttendance(attendanceData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!studentId) return <Typography>Student not found</Typography>;

  const totalSubjects = grades.length;
  const averageScore =
    totalSubjects > 0
      ? (
          grades.reduce((sum, g) => sum + Number(g.score), 0) / totalSubjects
        ).toFixed(2)
      : 0;

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: '#f0f2f5' }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Welcome {user.f_name} {user.l_name}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Subjects</Typography>
            <Typography variant="h4">{totalSubjects}</Typography>
          </CardContent>
        </Card>

        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Average Grade</Typography>
            <Typography variant="h4">{averageScore}</Typography>
          </CardContent>
        </Card>

        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Attendance</Typography>
            <Typography>
              Present: {presentCount} <br />
              Absent: {absentCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" mb={2}>
          Recent Grades
        </Typography>

        {grades.length > 0 ? (
          <Table component={Paper}>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.slice(0, 5).map(g => (
                <TableRow key={g.id}>
                  <TableCell>{g.subject_name}</TableCell>
                  <TableCell>{g.class_name}</TableCell>
                  <TableCell>{g.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No grades yet</Typography>
        )}
      </Box>
    </Box>
  );
}

const cardStyle = {
  flex: '1 1 250px',
  borderRadius: 3,
  boxShadow: 3,
  backgroundColor: 'white',
  textAlign: 'center',
  minWidth: 200
};
