import React from 'react';
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

const Navbar: React.FC<NavbarProps> = ({ onToggleCollapse, collapsed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [project, setProject] = React.useState('');

  const handleProjectChange = (event: SelectChangeEvent) => {
    setProject(event.target.value as string);
  };

  return (
    <AppBar position='fixed' sx={{ backgroundColor: '#333333', zIndex: 1300 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Roboto, sans-serif' }}>
        {/* Left Side - Menu Button, Logo & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
          <IconButton edge='start' color='inherit' onClick={onToggleCollapse} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <img src={logo} alt='Logo' style={{ height: 40 }} />
          <Typography variant='h6' sx={{ ml: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Internal Project Management
          </Typography>
        </Box>

        {/* Project Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', mx: 2, minWidth: 0 }}>
          <Typography variant='body1' sx={{ color: 'white', mr: 1, whiteSpace: 'nowrap' }}>
            Project:
          </Typography>
          <FormControl variant='outlined' sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Select</InputLabel>
            <Select
              value={project}
              onChange={handleProjectChange}
              label='Select'
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '& .MuiSvgIcon-root': { color: 'white' } }}
            >
              <MenuItem value='Project1'>Project 1</MenuItem>
              <MenuItem value='Project2'>Project 2</MenuItem>
              <MenuItem value='Project3'>Project 3</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 1,
            paddingX: 1,
            width: isMobile ? 'auto' : '30%',
            minWidth: 150,
          }}
        >
          <SearchIcon sx={{ marginLeft: 1, color: 'black' }} />
          <TextField
            variant="standard"
            placeholder="Search..."
            sx={{ width: '100%', ml: 1 }}
            InputProps={{ disableUnderline: true }}
          />
        </Box>

        {/* Right Side - Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <IconButton color='inherit'>
            <Badge badgeContent={4} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color='inherit'>
            <SettingsIcon />
          </IconButton>
          <Avatar sx={{ ml: 2 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
