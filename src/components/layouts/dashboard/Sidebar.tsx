import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
} from '@mui/material';
import { Dashboard, MonetizationOn, Group, Warning, AccountCircle,  Assignment, Assessment } from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps & { onClose: () => void }> = ({ collapsed, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  const handleItemClick = (path: string) => {
    setSelectedPath(path);
    if (isMobile) onClose(); // Close the sidebar when a menu item is clicked
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Projects', icon: <Assignment />, path: '/projects' },  // Changed icon to Assignment for Projects
    { text: 'Budgets', icon: <MonetizationOn />, path: '/budgets' },
    { text: 'Resources', icon: <Group />, path: '/resources' },
    { text: 'Risk Management', icon: <Warning />, path: '/risk-management' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },  // Changed icon to Assessment for Reports
  ];

  const additionalItems = [
    { text: 'Account', icon: <AccountCircle />, path: '/account' },

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
              <NavLink
                to={item.path}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                onClick={() => handleItemClick(item.path)}
              >
                <ListItemButton
                  sx={{
                    py: 2,
                    px: 1.5,
                    '&:hover': { backgroundColor: '#ffe600', color: '#333333' },
                    borderLeft: item.path === selectedPath ? `4px solid #ffe600` : 'none',
                    color: item.path === selectedPath ? '#ffe600' : 'inherit',
                  }}
                >
                  <ListItemIcon sx={{ color: item.path === selectedPath ? '#ffe600' : 'white', minWidth: collapsed ? 'auto' : 56 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText primary={item.text} sx={{ color: item.path === selectedPath ? '#ffe600' : 'white' }} />
                  )}
                </ListItemButton>
              </NavLink>
            </Tooltip>
          </ListItem>
        ))}
        <Divider sx={{ my: 2, backgroundColor: 'white' }} />
        {additionalItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <Tooltip title={!collapsed ? '' : item.text} placement='right'>
              <NavLink
                to={item.path}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                onClick={() => handleItemClick(item.path)}
              >
                <ListItemButton
                  sx={{
                    py: 2,
                    px: 1.5,
                    '&:hover': { backgroundColor: '#ffe600', color: '#333333' },
                    borderLeft: item.path === selectedPath ? `4px solid #ffe600` : 'none',
                    color: item.path === selectedPath ? '#ffe600' : 'inherit',
                  }}
                >
                  <ListItemIcon sx={{ color: item.path === selectedPath ? '#ffe600' : 'white', minWidth: collapsed ? 'auto' : 56 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText primary={item.text} sx={{ color: item.path === selectedPath ? '#ffe600' : 'white' }} />
                  )}
                </ListItemButton>
              </NavLink>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
