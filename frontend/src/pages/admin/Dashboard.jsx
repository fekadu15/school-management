import { useEffect, useState } from 'react';
import { getAllStudents, getAllTeachers, getAllClasses, getAllSubjects, getAllAssignments } from '../../api/adminApi';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import Loading from '../../components/Loading';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stu, tea, cls, sub, ass] = await Promise.all([
          getAllStudents(),
          getAllTeachers(),
          getAllClasses(),
          getAllSubjects(),
          getAllAssignments()
        ]);
        setStudents(stu);
        setTeachers(tea);
        setClasses(cls);
        setSubjects(sub);
        setAssignments(ass);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { title: 'Students', count: students.length },
    { title: 'Teachers', count: teachers.length },
    { title: 'Classes', count: classes.length },
    { title: 'Subjects', count: subjects.length },
    { title: 'Assignments', count: assignments.length },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.title}>
            <Card sx={{ p: 3, borderRadius: 2, textAlign: 'center', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {c.title}
                </Typography>
                <Typography variant="h4">{c.count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
