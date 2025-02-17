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

  const handleProjectChange = (event: SelectChangeEvent) => {
    setProject(event.target.value as string);
  };

  return (
    <AppBar position='fixed' sx={{ backgroundColor: '#333', zIndex: 1300 }}>
      <Toolbar
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1, // Add spacing when wrapping
          paddingX: isMobile ? 1 : 3,
        }}
      >
        {/* Left - Menu, Logo & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flexGrow: 1 }}>
          <IconButton edge='start' color='inherit' onClick={onToggleCollapse} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <img src={logo} alt='Logo' style={{ height: 40 }} />
          <Typography
            variant='h6'
            sx={{
              ml: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: isMobile ? '1rem' : '1.25rem',
            }}
          >
            Internal Project Management
          </Typography>
        </Box>

        {/* Project Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <Typography variant='body1' sx={{ color: 'white', mr: 1, whiteSpace: 'nowrap', fontSize: isMobile ? '0.875rem' : '1rem' }}>
            Project:
          </Typography>
          <FormControl variant='outlined' size='small' sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Select</InputLabel>
            <Select
              value={project}
              onChange={handleProjectChange}
              label='Select'
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '& .MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <MenuItem value='Project1'>Project 1</MenuItem>
              <MenuItem value='Project2'>Project 2</MenuItem>
              <MenuItem value='Project3'>Project 3</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Search Bar */}
{/* Search Bar */}
<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: '24px',
    padding: '6px 12px',
    width: isMobile ? 'auto' : '280px',
    minWidth: 180,
    mx: isMobile ? 0 : 2,
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



        {/* Right - Notifications, Settings, Avatar */}
{/* Right - Notifications, Settings, User Info */}
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 }}>
  <IconButton color='inherit'>
    <Badge badgeContent={4} color='error'>
      <NotificationsIcon />
    </Badge>
  </IconButton>
  <IconButton color='inherit'>
    <SettingsIcon />
  </IconButton>

  {/* User Info (Name & Role) */}
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mx: 2 }}>
    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white', fontSize: isMobile ? '0.875rem' : '1rem' }}>
      Malek Zaidi
    </Typography>
    <Typography variant="body2" sx={{ color: '#ccc', fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
      Admin
    </Typography>
  </Box>

  {/* User Avatar */}
  <Avatar sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }} />
</Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
