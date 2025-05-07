import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../stores/store';
import { fetchProjects } from '../../features/project-management/stores/projectStore';
import { fetchUsers, selectUsers } from '../../features/users/api/usersSlice';
import { addTeamMembers } from '../../features/project-management/stores/projectStore';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Grid, 
  Autocomplete, 
  TextField, 
  Button,
  CircularProgress,
  useTheme,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Avatar,
  InputAdornment,
  LinearProgress,
  List,
  Container,
  Badge,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,  
  
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Skill } from '../../features/skills/types/skillTypes';
import CustomButton from '../../components/ui/CustomButton';
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Search } from '@mui/icons-material';
import TeamRadarChart from '../../components/ui/RadarChart';
import { motion } from 'framer-motion';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
const Resources = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { projects, loading: projectsLoading, selectedProjectId } = useSelector((state: RootState) => state.projects);  const users = useSelector(selectUsers);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [aiInsights, setAiInsights] = useState<{ [projectId: string]: { [userId: string]: string } }>({});
  const [skillMatches, setSkillMatches] = useState<{ [projectId: string]: { [userId: string]: number } }>({});
   const [comparativeAnalysis, setComparativeAnalysis] = useState<{ [projectId: string]: string }>({});



  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

const getComparativeAnalysis = async (projectId: string) => {
  if (!projectId || selectedMembers.length < 2) return;

  try {
    const project = managedProjects.find(p => p._id === projectId);
    const usersData = selectedMembers.map(id => users.find(u => u._id === id)!);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{
          role: 'system',
          content: `Compare team members based on skills and project requirements. 
          Format response as:
          1. Ranked list with medals 🥇🥈🥉 
          2. Bold strengths with ✅ 
          3. Highlight weaknesses with ⚠️ 
          4. Add relevant emojis for skills/roles
          5. Final suitability verdict with ★★★★★
          Keep under 300 words.`
        }, {
          role: 'user',
          content: `Project: ${project?.projectName}\nSkills: ${project?.skills?.map(s => s.name).join(', ')}\n` +
                   `Candidates:\n${usersData.map(u => `${u.fullName}: ${u.skills?.map(s => s.name).join(', ')}`).join('\n')}`
        }]
      })
    });
    
    const data = await response.json();
    setComparativeAnalysis(prev => ({
      ...prev,
      [projectId]: data.choices[0].message.content
    }));  } catch (error) {
    console.error('Comparative analysis error:', error);
  }
};
  // Filter projects where current user is the manager
  const managedProjects = projects.filter(project => {
    const managerId = typeof project.assignedProjectManager === 'object' 
      ? project.assignedProjectManager?._id 
      : project.assignedProjectManager;
    return managerId === currentUser?._id;
  });

    const projectsX = managedProjects.filter(p=> p._id=== selectedProjectId)
    const selectedProjects = managedProjects.find(p => p._id === selectedProjectId);

  const getSkillIdentifier = (skill: Skill) => {
    if (!skill) return '';
    return skill._id || skill.escoUri || (skill.name?.toLowerCase().trim() || '');
  };

  const calculateSkillMatch = (userSkills: Skill[] = [], projectSkills: Skill[] = []): number => {
    if (projectSkills.length === 0) return 100;
    
    const requiredSkills = new Set(
      projectSkills
        .map(getSkillIdentifier)
        .filter(s => s !== '')
    );
    
    const userSkillSet = new Set(
      userSkills
        .map(getSkillIdentifier)
        .filter(s => s !== '')
    );
    
    const intersection = new Set(
      [...requiredSkills].filter(s => userSkillSet.has(s))
    );
    
    return requiredSkills.size > 0 
      ? (intersection.size / requiredSkills.size) * 100 
      : 0;
  };
// utils/getInitials.ts
const getInitials=(fullName: string): string => {
  if (!fullName) return "";

  const names = fullName.trim().split(" ");
  const initials = names.slice(0, 2).map(name => name.charAt(0).toUpperCase());

  return initials.join("");
}

  const getAiInsights = async (userId: string, projectId: string) => {
    try {
      const user = users.find(u => u._id === userId);
      const project = projects.find(p => p._id === projectId);
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{
            role: 'system',
            content: 'Provide concise insights about team member suitability based on skills. Highlight non-obvious matches. Keep response under 100 words.'
          }, {
            role: 'user',
            content: `Project skills: ${project?.skills?.map(s => s.name).join(', ')}\nUser skills: ${user?.skills?.map(s => s.name).join(', ')}`
          }]
        })
      });
      const data = await response.json();
      setAiInsights(prev => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          [userId]: data.choices[0].message.content
        }
      }));
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  };

  const handleAddMembers = async (projectId: string) => {
    if (!selectedProject || selectedMembers.length === 0) return;
    
    try {
      await dispatch(addTeamMembers({
        projectId,
        members: selectedMembers
      })).unwrap();
      
      setSelectedMembers([]);
      setAiInsights(prev => ({
        ...prev,
        [projectId]: {}
      }));
      setSkillMatches(prev => ({
        ...prev,
        [projectId]: {}
      }));
    } catch (error) {
      console.error('Failed to add members:', error);
    }
  };
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const getSuitabilityConclusion = (insight: string, match: number) => {
    if (!insight) return null;
  
    const lowerInsight = insight.toLowerCase();
    
    const positiveIndicators = [
      'suitable', 'good match', 'recommended', 'excellent fit', 'strong fit',
      'potential', 'adequate', 'sufficient', 'relevant skills', 'compatible',
      'matches well', 'strength in', 'proficient', 'experienced', 'qualified',
      'capable', 'competent', 'aligns well', 'possesses required', 'beneficial',
      'complementary skills', 'transferable skills', 'adaptable','robust','unique perspective',
       'valuable','aid','well-suited','possessing expertise','align well','suitable fit','strong candidate'
    ];
    
    const negativeIndicators = [
      'not suitable', 'not recommended', 'weak match', 'unsuitable', 'lack',
      'lacking', 'insufficient', 'poor fit', 'missing', 'limited', 'gap',
      'inadequate', 'no experience', 'does not have', 'struggle', 'concerns',
      'caution', 'requires training', 'mismatch', 'overqualified', 'risk'
    ];
  
    const positiveScore = positiveIndicators.filter(word => 
      lowerInsight.includes(word.toLowerCase())
    ).length;
  
    const negativeScore = negativeIndicators.filter(word => 
      lowerInsight.includes(word.toLowerCase())
    ).length;
  
    // Threshold adjustments
    const recommendationThresholds = {
      strong: 75,
      good: 60,
      moderate: 45
    };
  
    // Sentiment analysis
    const isPositive = positiveScore > negativeScore;
    const isNegative = negativeScore > positiveScore;
    const isNeutral = positiveScore === negativeScore;
  
    // Decision matrix
    let label = 'Not Recommended ❌';
    let color: 'error' | 'warning' | 'success' = 'error';
  
    if (match >= recommendationThresholds.strong) {
      label = isNegative ? 'Consider with Caution ⚠️' : 'Recommended ✅';
      color = isNegative ? 'warning' : 'success';
    } else if (match >= recommendationThresholds.good) {
      if (isPositive) {
        label = 'Recommended ✅';
        color = 'success';
      } else if (isNeutral) {
        label = 'Consider with Caution ⚠️';
        color = 'warning';
      } else {
        label = 'Not Recommended ❌';
        color = 'error';
      }
    } else if (match >= recommendationThresholds.moderate) {
      if (isPositive) {
        label = 'Consider with Caution ⚠️';
        color = 'warning';
      } else {
        label = 'Not Recommended ❌';
        color = 'error';
      }
    } else if (match > 0) {
      label = isPositive ? 'High Risk Consideration ⚠️' : 'Not Recommended ❌';
      color = isPositive ? 'warning' : 'error';
    }
  
    if (negativeScore >= 3) {
      label = 'Not Recommended ❌';
      color = 'error';
    }

    return (
      <Chip 
        label={label}
        color={color}
        variant="outlined"
        sx={{ 
          ml: 1, 
          fontWeight: 600,
          borderWidth: 2,
          borderStyle: 'solid'
        }}
      />
    );
  };

 if (!selectedProjectId ) {
    return (
      <ContentLayout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="textSecondary">
            Please select a project from the dropdown in the navbar
          </Typography>
        </Box>
      </ContentLayout>
    );
  }


  return (
    <ContentLayout>
      {/* Header */}      
      <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
          <Badge badgeContent={managedProjects.length} color="primary" showZero>
            <GroupIcon sx={{ 
              fontSize: 40, 
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              p: 1.5,
              borderRadius: 3
            }} />
          </Badge>
          <div>
            <Typography variant="h4" fontWeight={700}>
              Team Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Optimize team composition and skill alignment for selected projects
            </Typography>
          </div>
        </Stack>
      </motion.div>

      {projectsLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        projectsX.map(project => (
          <Box key={project._id} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            width: 1000,
            mx:'auto'
          }}>
            {/* Current Team Section */}
            <Paper sx={{ 
  p: { xs: 2, md: 3 },
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }
}}>
  <Box sx={{ mb: 3 }}>
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 2,
      gap: 2
    }}>
      <Typography variant="h6" fontWeight={650} sx={{ 
        letterSpacing: '-0.25px',
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <GroupIcon sx={{ 
          color: theme.palette.primary.main,
          fontSize: '1.5em',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          p: 1,
          borderRadius: '8px'
        }} />
        Team Roster
      </Typography>
      <Chip 
        label={`${project.assignedTeamMembers?.length || 0} members`}
        variant="outlined"
        color="primary"
        sx={{ 
          fontWeight: 600,
          borderWidth: '2px',
          borderRadius: '8px',
          px: 1
        }}
      />
    </Box>
    <Divider sx={{ borderWidth: '1px', opacity: 0.5 }} />
    
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {project.assignedTeamMembers?.map(member => {
        const user = typeof member === 'object' ? member : users.find(u => u._id === member);
        return user ? (
          <Grid item xs={12} sm={6} md={4} xl={3} key={user._id}>
            <Paper 
              component={motion.div}
              whileHover={{ y: -4 }}
              sx={{ 
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: '8px',
                border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${theme.palette.background.default})`,
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                }
              }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(45deg, ${alpha(theme.palette.primary.light, 0.03)}, ${alpha(theme.palette.secondary.light, 0.03)})`,
                zIndex: 0,
              }} />
              
              <Avatar sx={{ 
                width: 52, 
                height: 52,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.common.white,
                zIndex: 1
              }}>
                {getInitials(user.fullName)}
              </Avatar>
              
              <Box sx={{ zIndex: 1 }}>
                <Typography 
                  fontWeight={650}
                  sx={{ 
                    lineHeight: 1.2,
                    mb: 0.5,
                    letterSpacing: '-0.1px'
                  }}>
                  {user.fullName}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    display: 'block',
                    fontWeight: 500,
                    fontSize: '0.8rem'
                  }}>
                  {user.role}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <Chip 
                    label="Active"
                    size="small"
                    color="success"
                    variant="filled"
                    sx={{
                      fontWeight: 600,
                      px: 1,
                      '& .MuiChip-label': { 
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }
                    }}
                    icon={<FiberManualRecordIcon sx={{ fontSize: '10px' }} />}
                  />
                  <Chip 
                    label={`${user.skills?.length} skills`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: alpha(theme.palette.divider, 0.3),
                      color: theme.palette.text.secondary,
                      '& .MuiChip-label': { fontSize: '0.7rem' }
                    }}
                  />
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ) : null;
      })}
    </Grid>

    {(!project.assignedTeamMembers || project.assignedTeamMembers.length === 0) && (
      <Box sx={{ 
        p: 4,
        textAlign: 'center',
        border: `2px dashed ${alpha(theme.palette.divider, 0.4)}`,
        borderRadius: '12px',
        mt: 2,
        background: `repeating-linear-gradient(
          45deg,
          ${theme.palette.background.paper},
          ${theme.palette.background.paper} 10px,
          ${theme.palette.background.default} 10px,
          ${theme.palette.background.default} 20px
        )`
      }}>
        <Box sx={{ 
          maxWidth: 300,
          mx: 'auto',
          mb: 2,
          opacity: 0.8
        }}>
          <PersonAddIcon fill="#ffe600" sx={{ 
            fontSize: 60,
            color: "#ffe600", 

          }} />
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          No team members assigned
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.9rem' }}>
          Start building your team using the panel below
        </Typography>
      </Box>
    )}
  </Box>
            </Paper>

            {/* Add Team Members Section */}
            <Paper sx={{ 
  p: 4,
  borderRadius: 4,
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(12px)',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: `#333333`,
  }
}}>
  <Box sx={{ mb: 3 }}>
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      mb: 2,
      paddingBottom: 2,
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`
    }}>
      <PersonAddIcon sx={{ 
        fontSize: 32,
        color: theme.palette.primary.main,
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        p: 1,
        borderRadius: 2
      }} />
      <Typography variant="h5" fontWeight={650}>
        Build Your Team
      </Typography>
      <Chip 
        label={`${selectedMembers.length} selected`} 
        color="primary"
        variant="outlined"
        sx={{ 
          ml: 'auto',
          fontWeight: 600,
          borderWidth: 2,
          borderRadius: 2
        }}
      />
    </Box>
  </Box>

  <Grid container spacing={4}>
    {/* Search Section with Filter */}
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Skill</InputLabel>
          <Select
            value={selectedSkill || ''}
            onChange={(e) => setSelectedSkill(e.target.value || null)}
            label="Filter by Skill"
            sx={{
              borderRadius: 3,
              '& .MuiOutlinedInput-input': {
                py: '13.5px'
              }
            }}
          >
            <MenuItem value=""><em>All Skills</em></MenuItem>
            {Array.from(new Set(
              users.flatMap(u => u.skills?.map(s => s.name) || [])
            )).map(skill => (
              <MenuItem key={skill} value={skill}>{skill}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
      multiple
      sx={{ width: { xs: '100%', md: 400 } }}
      options={users.filter(u => u.role === 'team_member')}
      getOptionLabel={opt => opt.fullName}
      value={users.filter(u => selectedMembers.includes(u._id))}
      onChange={(_, newValue) => {
        const ids = newValue.map(u => u._id);
        setSelectedMembers(ids);
        const matches = newValue.reduce((acc, u) => {
          acc[u._id] = calculateSkillMatch(u.skills || [], project.skills || []);
          return acc;
        }, {} as Record<string, number>);
        setSkillMatches(prev => ({ ...prev, [project._id!]: matches }));
      }}
      renderInput={params => (
        <TextField
          {...params}
          label="Search team members"
          placeholder="Start typing..."
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              '&:hover fieldset': { borderColor: theme.palette.primary.light },
            },
          }}
        />
      )}
      renderOption={(props, user) => {
        const match = calculateSkillMatch(user.skills || [], project.skills || []);
        return (
          <Box
            component="li"
            {...props}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 2,
              transition: '0.2s',
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    width: 40,
                    height: 40,
                    color: theme.palette.primary.main,
                  }}
                >
                  {getInitials(user.fullName)}
                </Avatar>
              </Grid>
              <Grid item xs={7}>
                <Typography fontWeight={600}>{user.fullName}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {user.skills?.slice(0, 3).map(s => s.name).join(', ')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Box textAlign="right">
                  <Chip
                    label={`${Math.round(match)}%`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      backgroundColor:
                        match >= 75
                          ? alpha(theme.palette.success.main, 0.15)
                          : match >= 50
                          ? alpha(theme.palette.warning.main, 0.15)
                          : alpha(theme.palette.error.main, 0.15),
                      color:
                        match >= 75
                          ? theme.palette.success.dark
                          : match >= 50
                          ? theme.palette.warning.dark
                          : theme.palette.error.dark,
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={match}
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.divider, 0.2),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor:
                          match >= 75
                            ? theme.palette.success.main
                            : match >= 50
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                      },
                    }}
                  />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          }}
        />
      </Box>
    </Grid>

    {/* Skill Analysis Section */}
    {selectedMembers.length > 0 && (
      <Grid item xs={12}>
        <Box sx={{ 
          p: 4,
          borderRadius: 3,
          backgroundColor: 'white',
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          backdropFilter: 'blur(8px)'
        }}>
          <Typography variant="h6" fontWeight={650} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LightbulbIcon style={{ color: "#333333" }} />
          Team Composition Analysis
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
              }}>
                <TeamRadarChart
                  projectSkills={project.skills || []}
                  memberSkills={selectedMembers.map(memberId => {
                    const user = users.find(u => u._id === memberId);
                    return {
                      userId: user?._id || '',
                      fullName: user?.fullName || '',
                      skills: user?.skills || []
                    };
                  })}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <List dense sx={{ height: 400, overflow: 'auto' }}>
                {selectedMembers.map(memberId => {
                  const user = users.find(u => u._id === memberId);
                  const match = skillMatches[project._id!]?.[memberId] || 0;
                  const projectSkills = project.skills || [];
                  const userSkills = user?.skills || [];
                  const matchesCount = userSkills.filter(s => 
                    projectSkills.some(ps => getSkillIdentifier(ps) === getSkillIdentifier(s))
                  ).length;
                  
                  return (
                    <motion.div key={memberId} whileHover={{ scale: 1.01 }}>
                      <Paper sx={{ 
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        borderLeft: `4px solid ${
                          match >= 75 ? theme.palette.success.main :
                          match >= 50 ? theme.palette.warning.main : 
                          theme.palette.error.main
                        }`,
                        boxShadow: theme.shadows[1],
                        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${theme.palette.background.default})`
                      }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            width: 40,
                            height: 40,
                            color: theme.palette.primary.main
                          }}>
                            {getInitials(user?.fullName || '')}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>{user?.fullName}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                              <Chip 
                                label={`${matchesCount}/${projectSkills.length} skills`}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                              <Chip 
                                label={`${Math.round(match)}% match`}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor:
                                    match >= 75 ? alpha(theme.palette.success.main, 0.15) :
                                    match >= 50 ? alpha(theme.palette.warning.main, 0.15) : 
                                    alpha(theme.palette.error.main, 0.15),
                                  color:
                                    match >= 75 ? theme.palette.success.dark :
                                    match >= 50 ? theme.palette.warning.dark : 
                                    theme.palette.error.dark
                                }}
                              />
                            </Stack>
                          </Box>
                          {getSuitabilityConclusion(aiInsights[project._id!]?.[memberId], match)}
                        </Stack>

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" fontWeight={600} color="textSecondary" display="block" gutterBottom>
                              USER SKILLS
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {userSkills.length > 0 ? userSkills.map(skill => (
                                <Tooltip key={getSkillIdentifier(skill)} title={skill.description || skill.name}>
                                  <Chip
                                    label={skill.name}
                                    size="small"
                                    variant="filled"
                                    color={
                                      projectSkills.some(ps => getSkillIdentifier(ps) === getSkillIdentifier(skill)) 
                                        ? 'success' 
                                        : 'default'
                                    }
                                    sx={{
                                      fontWeight: 500,
                                      '& .MuiChip-icon': { 
                                        ml: 0.5,
                                        fontSize: '0.8rem'
                                      }
                                    }}
                                    icon={<CheckIcon fontSize="small" />}
                                  />
                                </Tooltip>
                              )) : (
                                <Typography variant="caption" color="text.disabled">
                                  No skills listed
                                </Typography>
                              )}
                            </Box>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="caption" fontWeight={600} color="textSecondary" display="block" gutterBottom>
                              REQUIRED SKILLS
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {projectSkills.length > 0 ? projectSkills.map(skill => (
                                <Tooltip key={getSkillIdentifier(skill)} title={skill.description || skill.name}>
                                  <Chip
                                    label={skill.name}
                                    size="small"
                                    variant="filled"
                                    color={
                                      userSkills.some(us => getSkillIdentifier(us) === getSkillIdentifier(skill)) 
                                        ? 'success' 
                                        : 'error'
                                    }
                                    sx={{
                                      fontWeight: 500,
                                      '& .MuiChip-icon': { 
                                        ml: 0.5,
                                        fontSize: '0.8rem'
                                      }
                                    }}
                                    icon={
                                      userSkills.some(us => getSkillIdentifier(us) === getSkillIdentifier(skill)) 
                                        ? <CheckIcon fontSize="small" /> 
                                        : <CloseIcon fontSize="small" />
                                    }
                                  />
                                </Tooltip>
                              )) : (
                                <Typography variant="caption" color="text.disabled">
                                  No skills required
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                          {aiInsights[project._id!]?.[memberId] ? (
                            <Paper sx={{
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: alpha(theme.palette.primary.light, 0.05)
                            }}>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {aiInsights[project._id!][memberId]}
                              </Typography>
                            </Paper>
                          ) : (
                            <CustomButton
                              variant="outlined"
                              startIcon={<LightbulbIcon />}
                              onClick={() => getAiInsights(memberId, project._id!)}
                              sx={{  color: '#222',
                                borderColor: '#333333',
                                width: '100%',
                                borderRadius: 2,
                                py: 1,
                                borderWidth: 2,
                                '&:hover': {
                                  borderWidth: 2
                                }
                              }}
                            >
                              Generate AI Insights
                            </CustomButton>
                          )}
                        </Box>
                      </Paper>
                    </motion.div>
                  );
                })}
              </List>
            </Grid>
          </Grid>

          {/* Comparative Analysis Section */}
          {selectedMembers.length >= 2 && (
            <Box sx={{ mt: 4 }}>
              <Paper sx={{ 
                p: 3,
                borderRadius: 3,
                backgroundColor: 'white',
                border: `1px solid #333333`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <LightbulbIcon sx={{ 
                    color: '#333333',
                    fontSize: '1.8rem',
                    p: 1,
                    borderRadius: 2
                  }} />
                  <Typography variant="h6" fontWeight={650}>
                    AI Comparative Analysis
                  </Typography>
                </Stack>

                {comparativeAnalysis[project._id!] ? (
                  <Paper sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(6px)'
                  }}>
                    <Box sx={{
                      display: 'flex',
                      gap: 1,
                      mb: 1.5
                    }}>
                      <Chip 
                        label="AI Generated" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        icon={<AutoAwesomeIcon fontSize="small" />}
                      />
                      <Chip 
                        label={`${selectedMembers.length} Members Analyzed`}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>
                    <Typography variant="body2" component="div" sx={{ 
                      lineHeight: 1.6,
                      color: theme.palette.text.secondary,
                      '& strong': {
                        color: theme.palette.primary.main,
                        fontWeight: 600
                      },
                      '& em': {
                        backgroundColor: alpha(theme.palette.warning.main, 0.1),
                        fontStyle: 'normal',
                        px: 0.5,
                        borderRadius: 1
                      }
                    }}>
                      {comparativeAnalysis[project._id!].split('\n').map((line, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                          <FiberManualRecordIcon sx={{ fontSize: '0.5rem', mt: '0.5rem' }} />
                          <span>{line.replace(/^\d+\.\s*/, '')}</span>
                        </Box>
                      ))}
                    </Typography>
                  </Paper>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center',
                    py: 3,
                    border: `2px dashed ${alpha(theme.palette.divider, 0.3)}`,
                    borderRadius: 3
                  }}>
                    <Button 
                      variant="contained"
                      startIcon={<LightbulbIcon />}
                      onClick={() => getComparativeAnalysis(project._id!)}
                      sx={{    backgroundColor: '#333333', // Corrected background color
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 650,
                        boxShadow: theme.shadows[2],
                        '&:hover': {
                          boxShadow: theme.shadows[4],
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      Generate Comparative Analysis
                    </Button>
                    <Typography variant="caption" display="block" sx={{ 
                      mt: 1.5,
                      color: theme.palette.text.secondary
                    }}>
                      Requires at least 2 selected members
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}               
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined"
              onClick={() => setSelectedMembers([])}
            >
              Clear Selection
            </Button>
            <CustomButton
              variant="contained"
              onClick={() => handleAddMembers(project._id!)}
              startIcon={<PersonAddIcon />}
            >
              Add Selected Members
            </CustomButton>
          </Box>
        </Box>
      </Grid>
    )}
  </Grid>
</Paper>

          </Box>
        ))
      )}
            </Container>
    </ContentLayout>
    
  );
};


export default Resources;
