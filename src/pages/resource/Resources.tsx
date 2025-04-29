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

      <Box mb={4} px={{ xs: 2, md: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1.8rem', sm: '2rem', md: '2.125rem' } }}>
          <GroupIcon sx={{ 
            verticalAlign: 'middle', 
            mr: 2, 
            fontSize: { xs: '1.2em', md: '1.5em' } 
          }} />
          Team Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Manage team members for selected project
        </Typography>
      </Box>

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
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Current Team Members ({project.assignedTeamMembers?.length || 0})
                </Typography>
                <Divider />
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {project.assignedTeamMembers?.map(member => {
                    const user = typeof member === 'object' ? member : users.find(u => u._id === member);
                    return user ? (
                      <Grid item xs={12} sm={6} md={4} lg={3} width={'100%'} key={user._id}>

                        <Paper sx={{ 
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            boxShadow: theme.shadows[1],
                          }
                        }}>
                          <Avatar sx={{ 
                            bgcolor: theme.palette.primary.main,
                            width: 48, 
                            height: 48,
                            fontSize: '1.2rem'
                          }}>
                            {getInitials(user.fullName)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>{user.fullName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.role}
                            </Typography>
                            <Chip 
                              label="Active" 
                              size="small" 
                              color="success" 
                              sx={{ mt: 0.5, fontSize: '0.75rem' }}
                            />
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
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 3,
                    mt: 2
                  }}>
                    <Typography variant="body1" color="text.secondary">
                      No team members assigned yet
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Add Team Members Section */}
            <Paper sx={{ 
              p: 4,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Add Team Members
                </Typography>
                <Divider />
              </Box>

              <Grid container spacing={4}>
                {/* Search Section */}
                <Grid item xs={12} md={5}>
                  <Autocomplete
                    multiple
                    options={users.filter(u => u.role === 'team_member')}
                    getOptionLabel={(option) => option.fullName}
                    value={users.filter(u => selectedMembers.includes(u._id))}
                    onChange={(_, newValue) => {
                      const newMembers = newValue.map(u => u._id);
                      setSelectedMembers(newMembers);
                      
                      const matches = newValue.reduce((acc, user) => {
                        acc[user._id] = calculateSkillMatch(
                          user.skills || [],
                          project.skills || []
                        );
                        return acc;
                      }, {} as { [key: string]: number });
                      
                      setSkillMatches(prev => ({
                        ...prev,
                        [project._id!]: matches
                      }));
                    }}
                    renderInput={(params) => (
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
                              <Search color="action" />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                    renderOption={(props, user) => {
                      const match = calculateSkillMatch(user.skills || [], project.skills || []);
                      return (
                        <li {...props}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={3}>
                              <Avatar sx={{ 
                                bgcolor: 'primary.main',
                                width: 32,
                                height: 32,
                                fontSize: '0.9rem'
                              }}>
                                {getInitials(user.fullName)}
                              </Avatar>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography fontWeight={500}>{user.fullName}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {user.skills?.slice(0, 3).map(s => s.name).join(', ')}
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                            <Chip 
                              label={`${Math.round(match)}% match`}
                              variant="outlined"
                              sx={{
                                fontWeight: 600,
                                borderColor:
                                  match >= 75 ? theme.palette.success.main :
                                  match >= 50 ? theme.palette.warning.main : theme.palette.error.main,
                                color:
                                  match >= 75 ? theme.palette.success.dark :
                                  match >= 50 ? theme.palette.warning.dark : theme.palette.error.dark
                              }}
                            />
                              <LinearProgress 
                                variant="determinate" 
                                value={match}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: theme.palette.grey[200],
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: 
                                      match >= 75 ? theme.palette.success.main :
                                      match >= 50 ? theme.palette.warning.main : 
                                      theme.palette.error.main
                                  }
                                }}
                              /> 
                            </Grid>
                          </Grid>
                        </li>
                      );
                    }}
                  />
                </Grid>

                {/* Skill Analysis Section */}
                {selectedMembers.length > 0 && (
                  <Grid >
                    <Box sx={{ 
                      p: 4,
                      borderRadius: 3,
                      backgroundColor: theme.palette.grey[50]
                    }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Team Composition Analysis
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ width: '100%' }}>
                          {/* Left Grid */}
                    <Grid item xs={6}>
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

                        </Grid>

                        <Grid item xs={6}>
                            <List dense sx={{ maxHeight: 400, overflow: 'auto', width: '100%' }}>
                            {selectedMembers.map(memberId => {
                              const user = users.find(u => u._id === memberId);
                              const match = skillMatches[project._id!]?.[memberId] || 0;
                              const projectSkills = project.skills || [];
                              const userSkills = user?.skills || [];
                              const matchesCount = userSkills.filter(s => 
                                projectSkills.some(ps => getSkillIdentifier(ps) === getSkillIdentifier(s))
                              ).length;
                              const requiredSkillIds = new Set(projectSkills.map(getSkillIdentifier));
                              const userSkillIds = new Set(userSkills.map(getSkillIdentifier));
                              return (
                                <Paper 
                                  key={memberId} 
                                  sx={{ 
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    borderLeft: `4px solid ${
                                      match >= 75 ? theme.palette.success.main :
                                      match >= 50 ? theme.palette.warning.main : 
                                      theme.palette.error.main
                                    }`
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2,width:'100%' }}>
                                    <Avatar sx={{ 
                                      bgcolor: 'primary.main',
                                      width: 40,
                                      height: 40,
                                      fontSize: '1rem'
                                    }}>
                                      {getInitials(user?.fullName || '')}
                                    </Avatar>
                                    <Typography>{getInitials(user?.fullName || '')}</Typography>
                                    <Chip 
            label={`${matchesCount}/${projectSkills.length} skills matched`}
            variant='outlined'
            sx={{
              ml: 1.5,
              fontWeight: 600,
              borderColor:
                match >= 75 ? theme.palette.success.light :
                match >= 50 ? theme.palette.warning.light : theme.palette.error.light,
              color:
                match >= 75 ? theme.palette.success.dark :
                match >= 50 ? theme.palette.warning.dark : theme.palette.error.dark
            }}
          />
         <Chip 
                                  label={`${Math.round(match)}% match`}
                                  variant="outlined"
                                  sx={{
                                    fontWeight: 600,
                                    borderColor:
                                      match >= 75 ? theme.palette.success.main :
                                      match >= 50 ? theme.palette.warning.main : theme.palette.error.main,
                                    color:
                                      match >= 75 ? theme.palette.success.dark :
                                      match >= 50 ? theme.palette.warning.dark : theme.palette.error.dark
                                  }}
                                />
                                    
                                    {getSuitabilityConclusion(aiInsights[project._id!]?.[memberId], match)}
                                  </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* User Skills Column */}
        <Grid item xs={6}>
          <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
            User Skills ({userSkills.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {userSkills.length > 0 ? (
              userSkills.map(skill => {
                const isMatch = requiredSkillIds.has(getSkillIdentifier(skill));
                return (
                  <Tooltip key={getSkillIdentifier(skill)} title={skill.description || skill.name}>
                    <Chip
                      label={skill.name}
                      size="small"
                      color={isMatch ? 'success' : 'default'}
                      variant={isMatch ? 'filled' : 'outlined'}
                      icon={isMatch ? <CheckIcon fontSize="small" /> : undefined}
                      sx={{ 
                        '& .MuiChip-icon': { 
                          ml: 0.5,
                          fontSize: '0.9rem'
                        } 
                      }}
                    />
                  </Tooltip>
                );
              })
            ) : (
              <Typography variant="caption" color="text.disabled">
                No skills listed
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Project Requirements Column */}
        <Grid item xs={6}>
          <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
            Required Skills ({projectSkills.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {projectSkills.length > 0 ? (
              projectSkills.map(skill => {
                const isMatch = userSkillIds.has(getSkillIdentifier(skill));
                return (
                  <Tooltip key={getSkillIdentifier(skill)} title={skill.description || skill.name}>
                    <Chip
                      label={skill.name}
                      size="small"
                      color={isMatch ? 'success' : 'error'}
                      variant="outlined"
                      icon={isMatch ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                      sx={{ 
                        '& .MuiChip-icon': { 
                          ml: 0.5,
                          fontSize: '0.9rem'
                        } 
                      }}
                    />
                  </Tooltip>
                );
              })
            ) : (
              <Typography variant="caption" color="text.disabled">
                No specific skills required
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
                 <Box sx={{ mt: 2 }}>
                              {aiInsights[project._id!]?.[memberId] ? (
                                <Typography variant="body2" color="textSecondary">
                                  {aiInsights[project._id!][memberId]}
                                </Typography>
                              ) : (
                                <Button 
                                  variant="outlined"
                                  startIcon={<LightbulbIcon />}
                                  onClick={() => getAiInsights(memberId, project._id!)}
                                  sx={{ mt: 1 }}
                                >
                                  Generate AI Insights
                                </Button>
                              )}
                            </Box>
                                </Paper>
                              );
                            })}
                          </List>
                        </Grid>
                      </Grid>
                      <Divider />            
{/* Comparative Analysis Section - Only shows when 2+ members selected */}
{selectedMembers.length >= 2 && (
  <Box sx={{ 
    mt: 3,
    p: 3,
    border: `2px solid ${theme.palette.primary.light}`,
    borderRadius: 4,
    backgroundColor: 'background.paper',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      gap: 1.5
    }}>
      <LightbulbIcon sx={{ 
        color: 'primary.main', 
        fontSize: '1.8rem',
        transform: 'rotate(15deg)'
      }} />
      <Typography variant="h6" fontWeight={600}>
        AI Comparative Analysis
      </Typography>
    </Box>

    {comparativeAnalysis[project._id!] ? (
      <Paper sx={{
        p: 2.5,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'grey.50',
        whiteSpace: 'pre-wrap',
        position: 'relative'
      }}>
        <Box sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          display: 'flex',
          gap: 1,
          alignItems: 'center'
        }}>
          <Chip 
            label="AI Generated" 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <CheckIcon color="success" fontSize="small" />
        </Box>
        <Typography variant="body2" component="div" sx={{ 
          lineHeight: 1.6,
          '& strong': {
            color: 'primary.dark',
            fontWeight: 600
          },
          '& em': {
            backgroundColor: 'warning.light',
            fontStyle: 'normal',
            px: 0.5,
            borderRadius: 1
          }
        }}>
        {comparativeAnalysis[project._id!].split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line.replace(/(\d+\.|\-)/, match => 
                match === '-' ? '• ' : `${match} `)}
              <br />
            </React.Fragment>
          ))}
        </Typography>
      </Paper>
    ) : (
      <Box sx={{ 
        textAlign: 'center',
        py: 3,
        border: `2px dashed ${theme.palette.divider}`,
        borderRadius: 3
      }}>
        <Button
          variant="contained"
          startIcon={<LightbulbIcon />}
          onClick={() => getComparativeAnalysis(project._id!)}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 50,
            fontWeight: 600,
            boxShadow: theme.shadows[4],
            '&:hover': {
              boxShadow: theme.shadows[6],
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.2s'
          }}
        >
          Generate Comparative Analysis
        </Button>
        <Typography variant="caption" display="block" sx={{ 
          mt: 1.5,
          color: 'text.secondary'
        }}>
          Requires at least 2 selected members
        </Typography>
      </Box>
    )}
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
