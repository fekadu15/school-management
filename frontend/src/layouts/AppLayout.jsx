import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
export default function AppLayout() {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column">
        <Header />
        <Box
          sx={{
            flex: 1,
            p: 3,
            backgroundColor: '#f4f6f8'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
