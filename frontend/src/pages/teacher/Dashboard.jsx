import { useEffect, useState } from 'react';
import { getTeacherAssignments, getStudentsByClass, getAttendance } from '../../api/attendanceApi';
import Loading from '../../components/Loading';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const teacherAssignments = await getTeacherAssignments();
        setAssignments(teacherAssignments);

        const classIds = [...new Set(teacherAssignments.map(a => a.class_id))];
        setClasses(classIds);

        let totalStudents = 0;
        for (const classId of classIds) {
          const students = await getStudentsByClass(classId);
          totalStudents += students.length;
        }
        setStudentsCount(totalStudents);

        let totalAttendance = 0;
        for (const a of teacherAssignments) {
          const att = await getAttendance(a.class_id, a.subject_id);
          totalAttendance += att.length;
        }
        setAttendanceCount(totalAttendance);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: '#f0f2f5' }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Teacher Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Classes</Typography>
            <Typography variant="h4">{classes.length}</Typography>
          </CardContent>
        </Card>

        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Students</Typography>
            <Typography variant="h4">{studentsCount}</Typography>
          </CardContent>
        </Card>

        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Attendance Records</Typography>
            <Typography variant="h4">{attendanceCount}</Typography>
          </CardContent>
        </Card>

        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Assignments</Typography>
            <Typography variant="h4">{assignments.length}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" mb={2}>
          Recent Assignments
        </Typography>

        {assignments.length > 0 ? (
          <List component={Card} sx={{ p: 2 }}>
            {assignments.slice(0, 5).map(a => (
              <ListItem key={a.id} divider>
                <ListItemText
                  primary={a.title}
                  secondary={`Class: ${a.class_name} | Subject: ${a.subject_name}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No assignments yet</Typography>
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
