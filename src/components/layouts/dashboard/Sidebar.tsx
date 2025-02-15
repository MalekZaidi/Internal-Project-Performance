import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Dashboard, MonetizationOn, Group, Warning } from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Projects', icon: <Dashboard /> },
    { text: 'Budgets', icon: <MonetizationOn /> },
    { text: 'Resources', icon: <Group /> },
    { text: 'Risk Management', icon: <Warning /> },
  ];

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open
      sx={{
        width: collapsed ? 60 : 200,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 60 : 200,
          boxSizing: 'border-box',
          backgroundColor: '#333333',
          color: 'white',
          paddingTop: '64px',
          transition: 'width 0.3s',
          fontFamily: 'Roboto, sans-serif',
          overflowX: 'hidden',
        },
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <Tooltip title={!collapsed ? '' : item.text} placement='right'>
              <ListItemButton sx={{ py: 2, px: 1.5, '&:hover': { backgroundColor: '#ffe600', color: '#333333' } }}>
                <ListItemIcon sx={{ color: 'white', minWidth: collapsed ? 'auto' : 56 }}>{item.icon}</ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} sx={{ color: 'white', fontFamily: 'Roboto, sans-serif' }} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
