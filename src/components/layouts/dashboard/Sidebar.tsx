import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Tooltip, Divider, useTheme, useMediaQuery, IconButton
} from '@mui/material';
import {  MonetizationOn, Group, Warning, AccountCircle, Assignment, Assessment, Close , Home} from '@mui/icons-material';
import { useProfile } from '../../../features/auth/hooks/useProfile';


interface SidebarProps {
  collapsed: boolean;
  onClose: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onClose, isOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);
  const Profile= useProfile();

  const handleItemClick = (path: string) => {
    setSelectedPath(path);
    if (isMobile) onClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: '/dashboard' },
    { text: 'Projects', icon: <Assignment />, path: '/projects' },
    { text: 'Budgets', icon: <MonetizationOn />, path: '/budgets' },
    { text: 'Resources', icon: <Group />, path: '/resources' },
    { text: 'Risk Management', icon: <Warning />, path: '/risk-management' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' }
    

  ];

  const additionalItems = [{ text: 'Account', icon: <AccountCircle />, path: '/Account' }];

  return (
    <Drawer
    ModalProps={{
      keepMounted: true, 
    }}
      variant={isMobile ? 'temporary' : 'persistent'}
      open={isMobile ? isOpen : true} 
      onClose={onClose} 
      sx={{
        width: collapsed ? 60 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 60 : 240,
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
                  {!collapsed && <ListItemText primary={item.text} sx={{ color: item.path === selectedPath ? '#ffe600' : 'white' }} />}
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
                  {!collapsed && <ListItemText primary={item.text} sx={{ color: item.path === selectedPath ? '#ffe600' : 'white' }} />}
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
