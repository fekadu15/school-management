import express from 'express';
import cors from 'cors';
import config from './utils/config.js';
import pool from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import teacherAssignmentRoutes from './routes/teacherAssignmentRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teacher-assignments', teacherAssignmentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('School Management System API is running');
});

const PORT = config.port;
app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Database connection failed', error);
  }
});

