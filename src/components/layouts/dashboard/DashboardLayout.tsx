import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: `calc(100% - ${collapsed ? '80px' : '240px'})`,
          transition: 'width 0.3s',
        }}
      >
        <Navbar onToggleCollapse={handleToggleCollapse} collapsed={collapsed} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: '#f4f4f4',
            padding: '24px',
            marginTop: '64px',
            overflow: 'auto',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
