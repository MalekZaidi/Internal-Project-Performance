import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggleCollapse = () => {
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar collapsed={collapsed} onClose={() => setIsSidebarOpen(false)} isOpen={isSidebarOpen} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: isMobile ? '100%' : `calc(100% - ${collapsed ? '80px' : '240px'})`,
          transition: 'width 0.3s',
        }}
      >
        <Navbar onToggleCollapse={handleToggleCollapse} collapsed={collapsed} />
                <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: '#f4f4f4',
            padding: isMobile ? '16px' : '24px',
            marginTop: '64px',
            overflow: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ width: '100%', flexGrow: 1 }}>
            {children}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default DashboardLayout;