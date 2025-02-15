import { Box } from '@mui/material';
import { useState } from 'react';
import Sidebar from './components/layouts/dashboard/Sidebar';
import Navbar from './components/layouts/dashboard/Navbar';

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
      <Sidebar collapsed={sidebarCollapsed} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar onToggleCollapse={toggleCollapse} collapsed={sidebarCollapsed} />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            backgroundColor: '#f4f4f4',
            padding: '24px',
            marginTop: '64px',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          <h1>Welcome to Your Dashboard</h1>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
