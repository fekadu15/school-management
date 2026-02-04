import { useEffect, useState } from 'react';
import { getGradesByStudent } from '../../api/gradeApi';
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

export default function StudentGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);

        const token = getToken();
        if (!token) {
          setMessage('You must be logged in to view grades.');
          return;
        }

        const decoded = decodeToken(token);
        if (!decoded?.id) {
          setMessage('Student ID not found in token.');
          return;
        }

        const studentId = decoded.id;
        const data = await getGradesByStudent(studentId);
        setGrades(data);

        if (!data.length) setMessage('No grades found yet.');
      } catch (err) {
        console.error(err);
        setMessage('Failed to fetch grades.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) return <Loading />;

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: '#f0f4f8' }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        My Grades
      </Typography>

      {message && (
        <Alert severity={grades.length > 0 ? 'success' : 'info'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {grades.length > 0 && (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Class</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map(g => (
                  <TableRow key={g.id} hover>
                    <TableCell>{g.class_name}</TableCell>
                    <TableCell>{g.subject_name}</TableCell>
                    <TableCell>{g.score}</TableCell>
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
