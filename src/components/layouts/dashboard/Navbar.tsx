import React, { useEffect, useState } from 'react';
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
import { useProfile } from '../../../features/auth/hooks/useProfile';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../../../features/auth/api/authService';

interface NavbarProps {
  onToggleCollapse: () => void;
  collapsed : boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleCollapse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [project, setProject] = useState('');
  const { profile } = useProfile();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For dropdown menu

  useEffect(() => {
    if (profile) {
      setUserName(profile.fullName); 
      setUserRole(profile.role);
    }
  }, [profile]);

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
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <Typography variant="body1" sx={{ color: 'white', mr: 1 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#333', borderRadius: 1, width: 280, mx: 2 }}>
              <TextField
                variant="standard"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  width: '100%',
                  '& input': { padding: '4px 0', color: 'white' },
                }}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {searchTerm && (
                        <IconButton onClick={clearSearch} sx={{ padding: 0 }}>
                          <ClearIcon sx={{ color: 'white' }} />
                        </IconButton>
                      )}
                      <SearchIcon sx={{ color: 'white' }} />
                    </Box>
                  ),
                }}
              />
            </Box>

            {/* Notifications & Settings */}
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

        {/* Avatar & Dropdown */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mx: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
              {userName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              {userRole}
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
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <List sx={{ width: 250, paddingTop: '64px', backgroundColor: '#333', color: 'white' }}>
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
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
