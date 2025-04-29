import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Paper,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  styled,
  Chip,
  Autocomplete,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AppDispatch, RootState } from '../../stores/store';
import { addProject, Project } from '../../features/project-management/stores/projectStore';
import { selectUsers } from '../../features/users/api/usersSlice';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import CustomButton from '../../components/ui/CustomButton';
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';
import { useGetSkillsQuery, useSearchSkillsQuery } from '../../features/skills/api/skillsApi';
import { Skill } from '../../features/skills/types/skillTypes';
import SearchIcon from '@mui/icons-material/Search';
// Styled components with dark accents
const EYCard = styled(Card)(({ theme }) => ({
  maxWidth: 1200,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  backgroundColor: '#ffffff',
  color: '#222222',
  border: '1px solid #222',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

const EYTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: '#222222',
  },
  '& .MuiInputLabel-root': {
    color: '#222222', // Updated color for the label
    '&.Mui-focused': {
      color: '#222222', // Ensures label remains #222222 when focused
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#dddddd',
    },
    '&:hover fieldset': {
      borderColor: '#222',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#222',
      borderWidth: '2px',
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#666666',
  },
}));

const EYSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-icon': {
    color: '#666666',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#222 !important',
    borderWidth: '2px',
  },
  '& .MuiOutlinedInput-root': {
    color: '#222222',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#222',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#222',
    },
  },
}));

const EYInputLabel = styled(InputLabel)(({ theme }) => ({
  color: '#222222',
  '&.Mui-focused': {
    color: '#222222',
  },
  '&.MuiFormLabel-filled': {
    color: '#222222',
  },
  '&.MuiInputLabel-shrink': {
    color: '#222222',
  },
}));




const EYSuggestionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f9f9f9',
  color: '#222222',
  border: '1px solid #dddddd',
  flex: 1,
  minWidth: 0,
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: '#222',
    backgroundColor: '#f0f0f0',
  },
}));


// Validation Schema
const schema = yup.object().shape({
  projectName: yup
    .string()
    .required('Project name is required')
    .min(10, 'Project name must be at least 10 characters')
    .max(50, 'Project name cannot exceed 50 characters'),

  description: yup
    .string()
    .required('Description is required')
    .min(100, 'Description must be at least 100 characters')
    .max(300, 'Description cannot exceed 300 characters'),

  goal: yup
    .array()
    .of(
      yup
        .string()
        .min(10, 'Each goal must be at least 10 characters')
        .max(70, 'Each goal cannot exceed 70 characters')
        .required('Goal cannot be empty')
    )
    .min(1, 'At least one goal is required')
    .required('Goals are required'),

  startDate: yup
    .string()
    .required('Start date is required')
    .test('is-date', 'Invalid start date', value => !isNaN(Date.parse(value!))),

  endDate: yup
    .string()
    .required('End date is required')
    .test('is-date', 'Invalid end date', value => !isNaN(Date.parse(value!)))
    .test('is-after-start', 'End date must be after start date', function (value) {
      const { startDate } = this.parent;
      return new Date(value!) > new Date(startDate);
    }),

  initialBudget: yup
    .number()
    .typeError('Must be a valid number')
    .required('Budget is required')
    .positive('Budget must be positive'),

  priority: yup
    .string()
    .required('Priority is required')
    .oneOf(['Low', 'Medium', 'High'], 'Invalid priority'),

  status: yup
    .string()
    .required('Status is required')
    .oneOf(['Started', 'InProgress', 'Completed', 'Onhold'], 'Invalid status'),

  assignedProjectManager: yup
    .string()
    .required('Project manager is required'),

  
});

type FormData = yup.InferType<typeof schema>;

const CreateProjectForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector(selectUsers);
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    setValue,
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      projectName: '',
      description: '',
      goal: [''],
      startDate: '',
      endDate: '',
      initialBudget: 0,
      priority: 'Medium',
      status: 'Started',
      assignedProjectManager: '', // string, not undefined
    
    },
  });

  const [goals, setGoals] = useState<string[]>(['']);
  const projectName = useWatch({ control, name: 'projectName' });
  const formValues = watch();

  // SKILLS

  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Skill[]>([]);
  const { data: existingSkills = [] } = useGetSkillsQuery();
  const { data: searchedSkills = [] } = useSearchSkillsQuery(skillSearchQuery, {
    skip: skillSearchQuery.length < 2
  });
  const handleSkillSelect = (skill: Skill) => {
    // Map API's 'uri' field to 'escoUri' in our state
    const processedSkill = skill.uri ? { 
      ...skill, 
      escoUri: skill.uri 
    } : skill;
  
    const isDuplicate = selectedSkills.some(s => 
      (s._id && s._id === processedSkill._id) || 
      (s.escoUri && s.escoUri === processedSkill.escoUri)
    );
    
    if (!isDuplicate) {
      setSelectedSkills([...selectedSkills, processedSkill]);
    }
  };
  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(s => s._id !== skillId));
  };

  // SKILLS


  // Filter users by role
  const projectManagers = users.filter(user => user.role === 'project_manager');
  // Check if form is complete and valid
  const isFormComplete = isValid && isDirty;

  const fetchDescriptionSuggestions = async (projectName: string, goals: string[]) => {
    if (!projectName || goals.some(g => g.length < 10)) return;
    
    setIsLoadingSuggestions(true);
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Only return valid JSON. Do not include explanations.',
            },
            {
              role: 'user',
              content: `Given the project name "${projectName}" and the following goals: ${goals.join(
                ', '
              )}, suggest 3 relevant project descriptions between 100-300 characters. Respond ONLY with a JSON like: { "descriptions": ["...", "...", "..."] }`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const rawContent = response.data.choices?.[0]?.message?.content;
      if (rawContent) {
        const parsed = JSON.parse(rawContent);
        if (parsed.descriptions) {
          setDescriptionSuggestions(parsed.descriptions);
        }
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // useEffect(() => {
  //   const debounceTimer = setTimeout(() => {
  //     fetchDescriptionSuggestions(projectName, goals.filter(g => g.length >= 10));
  //   }, 1000);

  //   return () => clearTimeout(debounceTimer);
  // }, [projectName, goals]);

  const handleGoalChange = (value: string, index: number) => {
    const updated = [...goals];
    updated[index] = value;
    setGoals(updated);
    setValue('goal', updated);
  };

  const handleAddGoal = () => {
    const newGoals = [...goals, ''];
    setGoals(newGoals);
    setValue('goal', newGoals);
  };

  const handleRemoveGoal = (index: number) => {
    if (goals.length <= 1) return;
    
    const updated = [...goals];
    updated.splice(index, 1);
    setGoals(updated);
    setValue('goal', updated);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const skillIds = selectedSkills
        .filter(skill => !skill.escoUri)
        .map(skill => skill._id)
        .filter((id): id is string => !!id);
  
      const escoUris = selectedSkills
        .filter(skill => skill.escoUri)
        .map(skill => skill.escoUri)
        .filter((uri): uri is string => !!uri);
  
      const payload = {
        ...data,
        goal: data.goal.join(', '),

        skillIds: skillIds.length > 0 ? skillIds : undefined,
        escoUris: escoUris.length > 0 ? escoUris : undefined,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };
  
      await dispatch(addProject(payload)).unwrap();
      navigate('/projects', { state: { success: true } });
    } catch (error) {
      console.error('Project creation failed:', error);
    }
  };

  return (
    <ContentLayout> 
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          textAlign: 'center',
          color: '#222222',
          mb: 4,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Create New Project
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Project Name */}
            <Grid item xs={12} md={6}>
              <Controller
                name="projectName"
                control={control}
                render={({ field }) => (
                  <EYTextField
                    {...field}
                    label="Project Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.projectName}
                    helperText={errors.projectName?.message}
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="10-50 characters">
                          <DescriptionIcon sx={{ color: '#666666' }} />
                        </Tooltip>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Goals Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                color: '#222222',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <LightbulbIcon sx={{ color: '#222222' }} />
                Project Goals
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#eeeeee' }} />
              
              {goals.map((goal, index) => (
                <Stack key={index} direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <EYTextField
                    label={`Goal ${index + 1}`}
                    value={goal}
                    fullWidth
                    onChange={(e) => handleGoalChange(e.target.value, index)}
                    error={!!errors.goal?.[index]}
                    helperText={errors.goal?.[index]?.message || '10-70 characters'}
                  />
                  {goals.length > 1 && (
                    <IconButton 
                      onClick={() => handleRemoveGoal(index)}
                      sx={{ 
                        color: '#666666',
                        '&:hover': {
                          color: '#222222'
                        }
                      }}
                      aria-label="remove goal"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                </Stack>
              ))}

              <CustomButton
                startIcon={<AddCircleOutlineIcon sx={{ color: 'white' }} />}
                onClick={handleAddGoal}
                variant="contained"
              >
                Add Goal
              </CustomButton>
            </Grid>

            {/* Description Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                color: '#222222',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DescriptionIcon sx={{ color: '#222222' }} />
                Project Description
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#eeeeee' }} />
              
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <EYTextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={5}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.description}
                    helperText={errors.description?.message || '100-300 characters'}
                  />
                )}
              />

              {isLoadingSuggestions ? (
                <Typography variant="body2" sx={{ mt: 2, color: '#666666' }}>
                  Generating suggestions...
                </Typography>
              ) : descriptionSuggestions.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    color: '#222222'
                  }}>
                    <LightbulbIcon sx={{ mr: 1, color: '#222222' }} />
                    AI-generated description suggestions:
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    {descriptionSuggestions.map((desc, index) => (
                      <EYSuggestionPaper
                        key={index}
                        elevation={0}
                        onClick={() => setValue('description', desc)}
                      >
                        <Typography variant="body2">{desc}</Typography>
                      </EYSuggestionPaper>
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>

            {/* Team Assignment Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                color: '#222222',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <PeopleIcon sx={{ color: '#222222' }} />
                Team Assignment
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#eeeeee' }} />
            </Grid>

            {/* Project Manager Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.assignedProjectManager}>
              <EYInputLabel id="assignedProjectManager">Project Manager</EYInputLabel>
                <Controller
                  name="assignedProjectManager"
                  control={control}
                  render={({ field }) => (
                    <EYSelect
                      {...field}
                      label="Project Manager" labelId='assignedProjectManager' id='assignedProjectManager'
                      renderValue={(selected) => {
                        const manager = projectManagers.find(m => m._id === selected);
                        return manager ? `${manager.fullName} (${manager.login})` : '';
                      }}
                    >
                      {projectManagers.map((manager) => (
                        <MenuItem key={manager._id} value={manager._id}>
                          <ListItemText 
                            primary={manager.fullName} 
                            secondary={manager.login}
                          />
                        </MenuItem>
                      ))}
                    </EYSelect>
                  )}
                />
                <FormHelperText sx={{ color: errors.assignedProjectManager ? '#f44336' : '#666666' }}>
                  {errors.assignedProjectManager?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Team Members Selection */}

            <Grid item xs={12}>
  <Typography variant="h6" gutterBottom sx={{ 
    fontWeight: 600,
    color: '#222222',
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }}>
    <BadgeIcon sx={{ color: '#222222' }} />
    Required Skills
  </Typography>
  <Divider sx={{ mb: 2, borderColor: '#eeeeee' }} />

  {/* Selected Skills Chips */}
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
  {selectedSkills.map(skill => (
    <Chip
      key={skill._id || skill.escoUri}
      label={skill.name}
      onDelete={() => handleRemoveSkill(skill._id || skill.escoUri!)}
      sx={{ 
        backgroundColor: '#f0f0f0',
        '& .MuiChip-deleteIcon': {
          color: '#666',
          '&:hover': { color: '#222' }
        }
      }}
    />
  ))}
</Box>

  {/* Skill Selection Section */}
  <Grid container spacing={2}>
    {/* ESCO Skill Search */}
    <Grid item xs={12} md={6}>
      <Autocomplete
        options={searchedSkills}
        getOptionLabel={(option) => option.name}
        inputValue={skillSearchQuery}
        onInputChange={(_, newValue) => setSkillSearchQuery(newValue)}
        renderInput={(params) => (
          <EYTextField
            {...params}
            label="Search ESCO Skills"
            placeholder="Type at least 2 characters..."
            helperText="Search the ESCO database for skills"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <SearchIcon sx={{ color: '#666666', mr: 1 }} />
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1">{option.name}</Typography>
              {option.description && (
                <Typography variant="caption" color="text.secondary">
                  {option.description}
                </Typography>
              )}
            </Box>
          </li>
        )}
        onChange={(_, value) => value && handleSkillSelect(value)}
      />
    </Grid>

    {/* Existing Skills Dropdown */}
            {/* Existing Skills Dropdown */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Existing Skills</InputLabel>
                <Select
                  multiple
                  value={selectedSkills.map(skill => skill._id)} // Store IDs for Select value
                  onChange={(e) => {
                    const selectedIds = e.target.value as string[];
                    const selected = existingSkills.filter(skill => 
                      selectedIds.includes(skill._id)
                    );
                    setSelectedSkills(selected);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const skill = existingSkills.find(s => s._id === id);
                        return (
                          <Chip 
                            key={id} 
                            label={skill?.name || id} 
                            onDelete={() => handleRemoveSkill(skill?._id || '')}
                            sx={{ 
                              backgroundColor: '#f0f0f0',
                              '& .MuiChip-deleteIcon': {
                                color: '#666',
                                '&:hover': { color: '#222' }
                              }
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {existingSkills.map((skill) => (
                    <MenuItem key={skill._id} value={skill._id}>
                      <Checkbox checked={selectedSkills.some(s => s._id === skill._id)} />
                      <ListItemText 
                        primary={skill.name}
                        secondary={skill.category} 
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
  </Grid>
</Grid>
            {/* Dates Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                color: '#222222',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DescriptionIcon sx={{ color: '#222222' }} />
                Project Timeline
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#eeeeee' }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <EYTextField
                    {...field}
                    label="Start Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    InputProps={{
                      sx: { '& input': { color: '#222222' } }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <EYTextField
                    {...field}
                    label="End Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                    InputProps={{
                      sx: { '& input': { color: '#222222' } }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Project Details Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                color: '#222222',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DescriptionIcon sx={{ color: '#222222' }} />
                Project Details
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#eeeeee' }} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="initialBudget"
                control={control}
                render={({ field }) => (
                  <EYTextField
                    {...field}
                    label="Initial Budget ($)"
                    type="number"
                    fullWidth
                    error={!!errors.initialBudget}
                    helperText={errors.initialBudget?.message}
                    InputProps={{
                      startAdornment: <span style={{ color: '#222222' }}>$</span>,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth error={!!errors.priority}>
              <EYInputLabel id="priority">Priority</EYInputLabel>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <EYSelect {...field} labelId='priority' id='priority' label="Priority" sx={{ color: '#222222' }}>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </EYSelect>
                  )}
                />
                <FormHelperText sx={{ color: errors.priority ? '#f44336' : '#666666' }}>
                  {errors.priority?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth error={!!errors.status}>
              <EYInputLabel id="status">Status</EYInputLabel>
              <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <EYSelect {...field} labelId="status-label" id="status" label="Status" sx={{ color: '#222222' }}>
                      <MenuItem value="Started">Started</MenuItem>
                      <MenuItem value="InProgress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Onhold">On Hold</MenuItem>
                    </EYSelect>
                  )}
                />
                <FormHelperText sx={{ color: errors.status ? '#f44336' : '#666666' }}>
                  {errors.status?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CustomButton
                  type="submit"
                  disabled={!isFormComplete || isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </CustomButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </ContentLayout>
  );
};

export default CreateProjectForm;