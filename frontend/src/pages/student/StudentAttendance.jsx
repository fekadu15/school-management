import { useEffect, useState } from 'react';
import { getAttendanceByStudent } from '../../api/attendanceApi';
import Loading from '../../components/Loading';
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
  Alert
} from '@mui/material';

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const token = getToken();
        if (!token) {
          setMessage('You must be logged in to view attendance.');
          return;
        }

        const decoded = decodeToken(token);
        if (!decoded?.id) {
          setMessage('Student ID not found in token.');
          return;
        }

        const studentId = decoded.id;
        const data = await getAttendanceByStudent(studentId);
        setAttendance(data);

        if (!data.length) setMessage('No attendance records found.');
      } catch (err) {
        console.error(err);
        setMessage('Failed to fetch attendance.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) return <Loading />;

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: '#f0f4f8' }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        My Attendance
      </Typography>

      {message && (
        <Alert severity={attendance.length > 0 ? 'success' : 'info'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {attendance.length > 0 && (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Subject</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map(a => (
                  <TableRow key={a.id} hover>
                    <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                    <TableCell
                      sx={{
                        color: a.status === 'present' ? 'green' : 'red',
                        fontWeight: 'bold'
                      }}
                    >
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </TableCell>
                    <TableCell>{a.class_name}</TableCell>
                    <TableCell>{a.subject_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
