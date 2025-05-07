import React, {useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import the icon
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
  TextField,
  Drawer,
  List,
  ListItem,
  Divider,
  Menu,
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import logo from '../../../assets/logo.png';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../../../features/auth/api/authService';
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/store";
import { styled } from '@mui/styles';
import ProjectSelector from '../../ui/ProjectSelector';
import Cookies from "js-cookie";
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { io, Socket } from 'socket.io-client';
import CustomButton from '../../ui/CustomButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
interface NavbarProps {
  onToggleCollapse: () => void;
  collapsed : boolean;
  
}
interface Notification {
  type: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleCollapse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [project, setProject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);


  const handleProjectChange = (event: SelectChangeEvent) => {
    setProject(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setMenuOpen(true);
    } else {
      setAnchorEl(event.currentTarget); 
    }
  };

  
// Notifications 

const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Navbar.tsx
 // Navbar.tsx
useEffect(() => {
  const jwt = Cookies.get('jwt');
  if (!jwt) return;

  const newSocket = io(import.meta.env.VITE_BACK_API_WS_URL, {
    path: '/ws',
    transports: ['websocket'],
    auth: { token: jwt },
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  });

  newSocket.on('connect', () => {
    console.log('WebSocket connected:', newSocket.id);
  });

  newSocket.on('disconnect', (reason) => {
    console.log('WebSocket disconnected:', reason);
  });

  newSocket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
  });

  newSocket.on('notification', (payload) => {
    console.log('Received notification:', payload);
    setNotifications(prev => [{ ...payload, timestamp: new Date() }, ...prev]);
    setUnreadCount(prev => prev + 1);
  });

  setSocket(newSocket);

  return () => {
    newSocket.close();
  };
}, []);

const handleNotification = (payload: any) => {
  setNotifications(prev => [
    {
      ...payload,
      timestamp: new Date(),
      read: false
    },
    ...prev
  ]);
  setUnreadCount(prev => prev + 1);
};


const markAsRead = (index: number) => {
  setNotifications(prev =>
    prev.map((n, i) => (i === index ? { ...n, read: true } : n))
  );
  setUnreadCount(prev => Math.max(0, prev - 1));
};


  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchor(event.currentTarget);
    setUnreadCount(0); 
  };

  const notificationIcon = (
    <IconButton 
      color="inherit" 
      onClick={handleNotificationClick}
      component={motion.div}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Badge 
        badgeContent={unreadCount} 
        color="error"
        component={motion.span}
        animate={{ scale: unreadCount > 0 ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );

  const notificationMenu = (
    <Menu
      anchorEl={notificationMenuAnchor}
      open={Boolean(notificationMenuAnchor)}
      onClose={() => setNotificationMenuAnchor(null)}
      PaperProps={{
        style: {
          maxHeight: '70vh',
          width: '350px',
        },
      }}
    >
      <Typography variant="h6" sx={{ p: 2, fontWeight: 600 }}>
        Notifications
      </Typography>
      <Divider />
      {notifications.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
          No new notifications
        </Typography>
      ) : (
        notifications.map((notification, index) => (
          <React.Fragment key={index}>
            <MenuItem 
              sx={{ 
                whiteSpace: 'normal',
                alignItems: 'flex-start',
                borderLeft: notification.type === 'project_assigned' ? '4px solid #4caf50' : '4px solid #2196f3'
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </Typography>
                {notification.data?.projectId && (
                  <CustomButton 
                    size="small" 
                    sx={{ mt: 1 }}
                    onClick={() => window.location.href = `/projects/${notification.data.projectId}`}
                  >
                    View Project
                  </CustomButton>
                )}
                               
                  <CustomButton 
                    size="small" 
                    sx={{ mt: 1 }}
                    onClick={() => window.location.href = `/tasks`}
                  >
                    View Tasks
                  </CustomButton>

              </Box>
            </MenuItem>
            {index < notifications.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </Menu>
  );



  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#333', zIndex: 1300 }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          paddingX: isMobile ? 1 : 3,
          gap: 1,
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton edge="start" color="inherit" onClick={onToggleCollapse} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="Logo" style={{ height: 40 }} />
          {!isMobile && (
            <Typography variant="h6" sx={{ ml: 2, whiteSpace: 'nowrap' }}>
              Internal Project Performance
            </Typography>
          )}
        </Box>

        {/* Desktop View */}
        {!isMobile && (
          <>


          <ProjectSelector/>
         

            {/* Search Bar */}
{/* Search Bar */}
{/* Search Bar */}
<Box sx={{ 
  display: 'flex', 
  alignItems: 'center', 
  borderRadius: '10px', // More rounded corners
  width: 280, 
  mx: 2,
  border: '1px solid rgb(255, 255, 255)', // Subtle border
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.5)'
  },
  '&:focus-within': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.8)',
    boxShadow: '0 0 0 2px rgba(255,255,255,0.1)' // Glow effect
  }
}}>
  <TextField
    variant="standard"
    placeholder="Search..."
    value={searchTerm}
    onChange={handleSearchChange}
    sx={{
      width: '100%',
      '& input': { 
        padding: '8px 16px', // More padding
        color: 'white',
        fontSize: '0.9rem',
        '&::placeholder': {
          color: 'rgb(255, 255, 255)', // Better placeholder contrast
          fontSize: '0.9rem'
        }
      }
    }}
    InputProps={{
      disableUnderline: true,
      startAdornment: (
        <SearchIcon sx={{ 
          color: 'rgb(255, 253, 255)', 
          ml: 1.5,
          mr: 1 
        }} />
      ),
      endAdornment: (
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
          {searchTerm && (
            <IconButton 
              onClick={clearSearch} 
              sx={{ 
                padding: 0.5,
                '&:hover': {
                  backgroundColor: 'rgb(255, 255, 255)'
                }
              }}
            >
              <ClearIcon sx={{ 
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1.2rem' 
              }} />
            </IconButton>
          )}
        </Box>
      ),
    }}
  />
</Box>

            {/* Notifications & Settings */}
            {notificationIcon}
            {notificationMenu}
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </>
        )}

        {/* Avatar & Dropdown */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mx: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
              {user.fullName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              {user.role}
            </Typography>
          </Box>
          <Avatar sx={{ width: 40, height: 40, cursor: 'pointer' }} onClick={handleAvatarClick} />
          {!isMobile && (
            <IconButton color="inherit" onClick={handleAvatarClick}>
              <ArrowDropDownIcon />
            </IconButton>
          )}
        </Box>

        {/* Dropdown Menu */}
        <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    sx: {
                      '& .MuiMenuItem-root': {
                        color: '#333333', 
                        '&:hover': {
                          backgroundColor: '#FFE600', 
                        },
                      },
                    },
                  }}
>
            <MenuItem component="a" href="/Account">
              <AccountCircleIcon sx={{ marginRight: 1, color: '#333333' }} />
              Profile
            </MenuItem>
              <MenuItem onClick={logout}>
                <ExitToAppIcon sx={{ marginRight: 1, color: '#333333' }} />
                <Typography sx={{ color: '#333333' }}>Logout</Typography>
              </MenuItem>
          </Menu>


      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}
      ModalProps={{
        keepMounted: true, 
      }}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
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
        <List sx={{ width: 250, paddingTop: '64px', backgroundColor: '#333333 ', color: 'white' }}>
          <Divider />
          <ListItem>
            <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
              Internal Project Performance
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
              <InputLabel>Select Project</InputLabel>
              <Select value={project} onChange={handleProjectChange} label="Select">
                <MenuItem value="Project1">Project 1</MenuItem>
                <MenuItem value="Project2">Project 2</MenuItem>
                <MenuItem value="Project3">Project 3</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <Divider />
          <ListItem>
            <TextField variant="standard" placeholder="Search..." fullWidth />
            <SearchIcon sx={{ color: 'white', ml: 1 }} />
          </ListItem>
          <Divider />
          <ListItem>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </ListItem>
          <ListItem onClick={logout}>
          <ExitToAppIcon sx={{ marginRight: 1, color: 'white' }} />
          <Typography sx={{ color: 'white' }}>Logout</Typography>     
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
