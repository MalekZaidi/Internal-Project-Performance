import React from 'react';
import { Drawer, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
  collapsedWidth?: number;
  children: React.ReactNode;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ isOpen, onClose, width = 240, collapsedWidth = 60, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={isMobile ? isOpen : true}
      onClose={onClose}
      sx={{
        width: isMobile ? width : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isMobile ? width : collapsedWidth,
          boxSizing: 'border-box',
          backgroundColor: '#333333',
          color: 'white',
          paddingTop: '64px',
          transition: 'width 0.3s',
          fontFamily: 'Roboto, sans-serif',
          overflowX: 'hidden',
          zIndex: 1200,
        },
      }}
    >
      {isMobile && (
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
          <Close />
        </IconButton>
      )}
      {children}
    </Drawer>
  );
};

export default CustomDrawer;
