import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Chip,
  Stack,
  useTheme,
  Button,
  Collapse,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  AvatarGroup,
  Tooltip,
  Badge,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, selectProjects } from '../../features/project-management/stores/projectStore';
import { RootState, AppDispatch } from '../../stores/store';
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';
import { CalendarToday, AttachMoney, Work, Description, ExpandMore, ExpandLess, ChevronLeft, ChevronRight, Flag, DateRange, People } from '@mui/icons-material';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addWeeks, addDays, addMonths } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CodeIcon from '@mui/icons-material/Code';
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type CalendarView = 'month' | 'week' | 'day';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const { loading } = useSelector((state: RootState) => state.projects);
  const theme = useTheme();
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedGoals, setExpandedGoals] = useState(true);
  const [expandedTimeline, setExpandedTimeline] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState(true);
  const [expandedSkills, setExpandedSkills] = useState(true);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const project = projects.find((p) => p._id === id);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  const navigateToPrevious = () => {
    if (calendarView === 'month') {
      setCurrentDate(addMonths(currentDate, -1));
    } else if (calendarView === 'week') {
      setCurrentDate(addWeeks(currentDate, -1));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const navigateToNext = () => {
    if (calendarView === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

const handleViewChange = useCallback((newView: View) => {
  setCalendarView(newView as CalendarView);
}, []);

  if (loading || !project) {
    return (
      <ContentLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      </ContentLayout>
    );
  }

  const statusColor = {
    Started: 'primary',
    InProgress: 'warning',
    Completed: 'success',
    Onhold: 'error',
  }[project.status] || 'default';

  const priorityColor = {
    Low: 'success',
    Medium: 'warning',
    High: 'error',
  }[project.priority] || 'default';

  const calendarEvents = [
    {
      title: `${project.projectName}\n${formatDate(project.startDate)} - ${formatDate(project.endDate)}`,
      start: new Date(project.startDate),
      end: new Date(project.endDate),
      allDay: true,
    }
  ];

  const eventStyleGetter = () => {
    const backgroundColor = theme.palette.primary.main;
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: theme.palette.primary.contrastText,
        border: '0px',
        display: 'block',
        padding: '2px 8px',
        whiteSpace: 'pre-line',
      }
    };
  };
// Handle both string (comma-separated) and array goals
const getGoals = () => {
  if (!project.goal) return [];

  if (Array.isArray(project.goal)) {
    // Check if it's an array with one big string
    if (project.goal.length === 1 && typeof project.goal[0] === 'string') {
      return project.goal[0]
        .split(/\s*,\s*/) // split the single string on commas
        .map(g => g.trim())
        .filter(Boolean);
    }

    // Otherwise treat each array item as a separate goal
    return project.goal.map(g => g.trim()).filter(Boolean);
  }

  if (typeof project.goal === 'string') {
    return project.goal
      .split(/\s*,\s*/)
      .map(g => g.trim())
      .filter(Boolean);
  }

  return [];
};


const goals = getGoals();

  // Custom icon color
  const iconColor = '#333333';
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  return (
    <ContentLayout>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          backgroundColor: '#fff',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: theme.palette.text.primary }}>
            {project.projectName}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              label={project.status} 
              color={statusColor as any} 
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Priority: ${project.priority}`} 
              color={priorityColor as any} 
              size="small"
              variant="outlined"
            />
          </Stack>
                    {/* Team Assignment Section */}
                    <Box sx={{ mb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary,
                }
              }}
              onClick={() => setExpandedTeam(!expandedTeam)}
            >
              <People sx={{ mr: 1, color: iconColor }} />
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Team Assignment
              </Typography>
              <IconButton size="small">
                {expandedTeam ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedTeam}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mt: 1,
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 2,
                  borderLeft: `4px solid ${iconColor}`
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge color="primary" />
                      <strong>Project Manager</strong>
                    </Typography>
                    {project.assignedProjectManager ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {getInitials(
                            typeof project.assignedProjectManager === 'string' 
                              ? 'PM' 
                              : project.assignedProjectManager.fullName
                          )}
                        </Avatar>
                        <Box>
                          <Typography>
                            {typeof project.assignedProjectManager === 'string' 
                              ? project.assignedProjectManager 
                              : project.assignedProjectManager.fullName}
                          </Typography>
                          {typeof project.assignedProjectManager !== 'string' && (
                            <Typography variant="body2" color="text.secondary">
                              {project.assignedProjectManager.login}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No project manager assigned
                      </Typography>
                    )}
                  </Grid>


                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <People color="action" />
                      <strong>Team Members</strong>
                    </Typography>
                    {project.assignedTeamMembers && project.assignedTeamMembers.length > 0 ? (
                      <Box>
                        <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                          {project.assignedTeamMembers.map((member, index) => (
                            <Tooltip 
                              key={typeof member === 'string' ? member : member._id} 
                              title={typeof member === 'string' ? member : member.fullName}
                            >
                              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                                {typeof member === 'string' ? member.charAt(0).toUpperCase() : getInitials(member.fullName)}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                        <List dense sx={{ mt: 1 }}>
                          {project.assignedTeamMembers.map((member, index) => (
                            <ListItem key={typeof member === 'string' ? member : member._id} sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
                                  {typeof member === 'string' ? member.charAt(0).toUpperCase() : getInitials(member.fullName)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={typeof member === 'string' ? member : member.fullName}
                                secondary={typeof member === 'string' ? '' : member.login}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No team members assigned
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Collapse>
          </Box>
              {/* Goals Section */}
                  <Divider sx={{ my: 3 }} />

                  {goals.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: theme.palette.text.secondary,
                      '&:hover': { color: theme.palette.text.primary },
                    }}
                    onClick={() => setExpandedGoals(!expandedGoals)}
                  >
                    <Flag sx={{ mr: 1, color: iconColor }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                      Project Goals ({goals.length})
                    </Typography>
                    <IconButton size="small">
                      {expandedGoals ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedGoals}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mt: 1,
                        backgroundColor: theme.palette.grey[50],
                        borderRadius: 2,
                        borderLeft: `4px solid ${iconColor}`,
                      }}
                    >
                      <List dense>
                        {goals.map((goal, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemAvatar sx={{ minWidth: 32 }}>
                              <Avatar
                                sx={{
                                  bgcolor: iconColor,
                                  width: 24,
                                  height: 24,
                                  fontSize: '0.75rem',
                                  color: '#fff',
                                }}
                              >
                                {index + 1}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={goal}
                              primaryTypographyProps={{
                                variant: 'body1',
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Collapse>
                </Box>
              )}

        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.text.secondary,
                  fontWeight: 600
                }}
              >
                <DateRange sx={{ color: iconColor }} />
                Project Timeline
              </Typography>
              <Box sx={{ pl: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Start Date:</strong> {formatDate(project.startDate)}
                </Typography>
                <Typography variant="body1">
                  <strong>End Date:</strong> {formatDate(project.endDate)}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.text.secondary,
                  fontWeight: 600
                }}
              >
                <Work sx={{ color: iconColor }} />
                Project Details
              </Typography>
              <Box sx={{ pl: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Status:</strong> <Chip 
                    label={project.status} 
                    color={statusColor as any} 
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body1">
                  <strong>Priority:</strong> <Chip 
                    label={project.priority} 
                    color={priorityColor as any} 
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.text.secondary,
                  fontWeight: 600
                }}
              >
                <AttachMoney sx={{ color: iconColor }} />
                Budget & ID
              </Typography>
              <Box sx={{ pl: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Initial Budget:</strong> ${project.initialBudget.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Project ID:</strong> {project._id}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>


        {/* Divider */}
        <Divider sx={{ my: 3 }} />
        {/* Divider */}

        {/* Enhanced Calendar Visualization */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              color: theme.palette.text.secondary,
              mb: expandedTimeline ? 2 : 0,
              '&:hover': {
                color: theme.palette.text.primary,
              }
            }}
            onClick={() => setExpandedTimeline(!expandedTimeline)}
          >
            <CalendarToday sx={{ mr: 1, color: iconColor }} />
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600
              }}
            >
              Project Timeline Visualization
            </Typography>
            <IconButton size="small">
              {expandedTimeline ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedTimeline}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={navigateToPrevious} size="small">
                  <ChevronLeft />
                </IconButton>
                <Button 
                  variant={calendarView === 'month' ? 'contained' : 'outlined'} 
                  size="small"
                  onClick={() => handleViewChange('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={calendarView === 'week' ? 'contained' : 'outlined'} 
                  size="small"
                  onClick={() => handleViewChange('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={calendarView === 'day' ? 'contained' : 'outlined'} 
                  size="small"
                  onClick={() => handleViewChange('day')}
                >
                  Day
                </Button>
                <IconButton onClick={navigateToNext} size="small">
                  <ChevronRight />
                </IconButton>
              </Stack>
            </Box>
            
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, height: 500 }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                view={calendarView}
                onView={handleViewChange}
                date={currentDate}
                onNavigate={handleNavigate}
                defaultView="month"
                eventPropGetter={eventStyleGetter}
                toolbar={false}
                views={['month', 'week', 'day']}
                onSelectEvent={(event) => {
                  console.log('Event selected:', event);
                }}
              />
            </Paper>
          </Collapse>
        </Box>

        {project.description && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.text.secondary,
                fontWeight: 600
              }}
            >
              <Description sx={{ color: iconColor }} />
              Description
            </Typography>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: theme.palette.grey[50],
                borderRadius: 2,
                borderLeft: `4px solid ${iconColor}`
              }}
            > 
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                {project.description}
              </Typography>
            </Paper>
          </>
        )}          <Divider sx={{ my: 3 }} />

{/* Skills Section */}
<Box sx={{ mb: 4 }}>
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      cursor: 'pointer',
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.primary,
      }
    }}
    onClick={() => setExpandedSkills(!expandedSkills)}
  >
    <CodeIcon sx={{ mr: 1, color: iconColor }} />
    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
      Required Skills
    </Typography>
    <IconButton size="small">
      {expandedSkills ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
  </Box>
  
  <Collapse in={expandedSkills}>
    <Paper elevation={0} sx={{ p: 2, mt: 1, backgroundColor: theme.palette.grey[50], borderRadius: 2, borderLeft: `4px solid ${iconColor}` }}>
    {project.skills?.length ? (
  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
    {project.skills?.map((skill) => (
      <Tooltip 
        key={skill?._id} 
        title={skill?.description || 'No description'}
      >
        <Chip
          label={skill?.name || 'Unnamed Skill'}
          variant="outlined"
          sx={{
            backgroundColor: theme.palette.common.white,
            borderColor: theme.palette.divider,
            '& .MuiChip-label': { fontWeight: 500 }
          }}
        />
      </Tooltip>
    ))}
  </Stack>
) : (
  <Typography variant="body2" color="text.secondary">
    No skills specified for this project
  </Typography>
)}
    </Paper>
  </Collapse>
</Box>
      </Paper>
    </ContentLayout>
  );
};

export default ProjectDetail;