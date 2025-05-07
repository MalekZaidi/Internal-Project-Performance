import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  List,
  ListSubheader,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  useTheme
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  DoneAll as DoneAllIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import CustomButton from './CustomButton';

interface Notification {
  id: string;
  type: 'alert' | 'assignment' | 'message';
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

const NotificationCenter: React.FC<{
  notifications: Notification[];
  onMarkAllRead: () => void;
  onNavigateTo: (path: string) => void;
}> = ({ notifications, onMarkAllRead, onNavigateTo }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<'all' | 'alert' | 'assignment'>('all');
  const [filterText, setFilterText] = useState('');

  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Group by Today vs Earlier
  const today = new Date().toDateString();
  const grouped = {
    Today: notifications.filter(n => n.timestamp.toDateString() === today),
    Earlier: notifications.filter(n => n.timestamp.toDateString() !== today)
  };

  // Apply tab & search filters
  const filteredGrouped = Object.fromEntries(
    Object.entries(grouped).map(([section, items]) => [
      section,
      items.filter(n => {
        const matchesTab = tab === 'all' || n.type === tab;
        const matchesText = n.message.toLowerCase().includes(filterText.toLowerCase());
        return matchesTab && matchesText;
      })
    ])
  );

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleOpen}
          sx={{
            '&:hover': { color: '#FFE600' }
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            p: 1.5,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 4
          }
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" px={1}>
          <Typography variant="h6" fontWeight={600}>Notifications</Typography>
          <Button
            startIcon={<DoneAllIcon />}
            size="small"
            onClick={() => { onMarkAllRead(); }}
            sx={{ textTransform: 'none', color: theme.palette.grey[600] }}
          >
            Mark all read
          </Button>
        </Box>
        <Divider sx={{ my: 1 }} />

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="primary"
          sx={{ mb: 1 }}
        >
          <Tab label="All" value="all" />
          <Tab label="Alerts" value="alert" />
          <Tab label="Assignments" value="assignment" />
        </Tabs>

        {/* Search */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search notifications"
          fullWidth
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ mb: 1 }}
        />

        {/* Notification List */}
        <List dense disablePadding subheader={<li />}>
          {Object.entries(filteredGrouped).map(([section, items]) =>
            items.length > 0 ? (
              <li key={section}>
                <ul style={{ padding: 0 }}>
                  <ListSubheader sx={{ bgcolor: 'background.paper', pl: 0, fontWeight: 600 }}>
                    {section}
                  </ListSubheader>
                  {items.map(n => (
                    <React.Fragment key={n.id}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          bgcolor: n.read ? 'transparent' : theme.palette.action.hover,
                          borderLeft: `4px solid ${
                            n.type === 'assignment' ? theme.palette.success.main :
                            n.type === 'alert'      ? theme.palette.error.main :
                                                     theme.palette.primary.main
                          }`,
                          mb: 1,
                          borderRadius: 1
                        }}
                        secondaryAction={
                          n.data?.path && (
                            <IconButton edge="end" size="small"
                              onClick={() => onNavigateTo(n.data.path)}
                            >
                              <ChevronRightIcon fontSize="small" />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.grey[300], color: '#333' }}>
                            {n.type === 'assignment' ? 'A' : n.type === 'alert' ? '!' : 'M'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={500} color="#333">
                              {n.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </ul>
              </li>
            ) : null
          )}
          {/* No results */}
          {notifications.length === 0 || Object.values(filteredGrouped).every(arr => arr.length === 0) ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', my: 4 }}
            >
              No notifications found
            </Typography>
          ) : null}
        </List>

        {/* Footer */}
        <Divider sx={{ mt: 1 }} />
        <Box textAlign="center" mt={1}>
          <CustomButton
            size="small"
            onClick={() => onNavigateTo('/notifications')}
          >
            View All Notifications
          </CustomButton>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationCenter;
