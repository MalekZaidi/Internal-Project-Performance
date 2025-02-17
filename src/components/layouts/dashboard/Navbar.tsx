import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import logo from '../../../assets/logo.png';

interface NavbarProps {
  onToggleCollapse: () => void;
  collapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleCollapse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [project, setProject] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProjectChange = (event: SelectChangeEvent) => {
    setProject(event.target.value as string);
  };

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
        {/* Left Section - Menu, Logo & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
          <IconButton edge="start" color="inherit" onClick={onToggleCollapse} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="Logo" style={{ height: 40 }} />
          <Typography
            variant="h6"
            sx={{
              ml: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '1.25rem',
            }}
          >
            Internal Project Performance
          </Typography>
        </Box>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <IconButton color="inherit" onClick={() => setMobileMenuOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Desktop View - Project Selection, Search, Notifications, Settings */}
        {!isMobile && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <Typography variant="body1" sx={{ color: 'white', mr: 1, whiteSpace: 'nowrap' }}>
                Project:
              </Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'white' }}>Select</InputLabel>
                <Select
                  value={project}
                  onChange={handleProjectChange}
                  label="Select"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '& .MuiSvgIcon-root': { color: 'white' },
                  }}
                >
                  <MenuItem value="Project1">Project 1</MenuItem>
                  <MenuItem value="Project2">Project 2</MenuItem>
                  <MenuItem value="Project3">Project 3</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Search Bar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f1f3f4',
                borderRadius: '24px',
                padding: '6px 12px',
                width: 280,
                minWidth: 180,
                mx: 2,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              <SearchIcon sx={{ color: '#5f6368', mr: 1 }} />
              <TextField
                variant="standard"
                placeholder="Search..."
                sx={{
                  width: '100%',
                  fontSize: '16px',
                  '& input': {
                    padding: '4px 0',
                  },
                  '&::placeholder': {
                    color: '#5f6368',
                  },
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Box>

            {/* Notifications & Settings Icons */}
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </>
        )}

        {/* Right Section - User Info (Name, Role, Avatar) Always Visible */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mx: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
              Malek Zaidi
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              Admin
            </Typography>
          </Box>
          <Avatar sx={{ width: 40, height: 40 }} />
        </Box>
      </Toolbar>

      {/* Mobile Drawer Menu - Project Selection, Search, Notifications, Settings */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <List sx={{ width: 250, paddingTop: '64px' }}> {/* Adjust padding to make sure items are visible */}
          <ListItem>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.25rem',
                textAlign: 'center',
                width: '100%',
              }}
            >
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
            <SearchIcon sx={{ mr: 1 }} />
            <TextField variant="standard" placeholder="Search..." fullWidth />
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
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
