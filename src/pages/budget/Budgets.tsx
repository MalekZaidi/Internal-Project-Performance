import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  MenuItem,
  Container,
  Box,
  Alert,
  CircularProgress,
  LinearProgress,
  Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../stores/store';
import { Position } from '../../features/users/types/user-position.enum';
import { fetchProjects, setSelectedProject } from '../../features/project-management/stores/projectStore';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
interface PositionRate {
  position: Position;
  hourlyRate: number;
}

interface BudgetResponse {
  rates: PositionRate[];
  currentBudget: number;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Component Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Alert severity="error">Component crashed - Please check the console for details</Alert>;
    }
    return this.props.children;
  }
}

const PositionRates = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading: projectsLoading, error: projectsError, selectedProjectId } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [positions, setPositions] = useState<Array<{
    id: number;
    position: Position;
    hourlyRate: number;
  }>>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newPosition, setNewPosition] = useState<Position>(Position.FULLSTACK);
  const [currentBudget, setCurrentBudget] = useState(0);

  const selectedProject = projects.find(p => p._id === selectedProjectId);
  const initialBudget = selectedProject?.initialBudget || 0;

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const fetchBudgetRates = async () => {
    if (!selectedProjectId) return;
    
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/budgets/${selectedProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const data: BudgetResponse = JSON.parse(text);
      setCurrentBudget(data.currentBudget);

      if (data?.rates) {
        setPositions(data.rates.map((rate, index) => ({
          id: index + 1,
          position: rate.position,
          hourlyRate: rate.hourlyRate
        })));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budget data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetRates();
  }, [selectedProjectId]);

  const handleAddPosition = () => {
    if (positions.some(p => p.position === newPosition)) {
      setError('This position already exists in the list');
      return;
    }

    setPositions(prev => [
      ...prev,
      {
        id: prev.length + 1,
        position: newPosition,
        hourlyRate: 0
      }
    ]);
  };
  const budgetData = [
    { name: 'Used Budget', value: currentBudget },
    { name: 'Remaining Budget', value: Math.max(initialBudget - currentBudget, 0) }
  ];

  const rateData = positions.map(position => ({
    position: position.position.replace('_', ' '),
    rate: position.hourlyRate
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleSave = async () => {
    if (!selectedProjectId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const rates = positions.map(pos => ({
        position: pos.position,
        hourlyRate: pos.hourlyRate
      }));

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/budgets/${selectedProjectId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ rates }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save rates');
      }

      fetchBudgetRates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePosition = (positionId: number) => {
    setPositions(prev => prev.filter(p => p.id !== positionId));
  };

  if (!user) {
    return null;
  }

  const budgetPercentage = initialBudget > 0 
    ? Math.min((currentBudget / initialBudget) * 100, 100)
    : 0;

  return (
    <ErrorBoundary>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {(error || projectsError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || projectsError}
            </Alert>
          )}

          <Typography variant="h4" gutterBottom>
            Project Budget Overview
          </Typography>

          {user?.role === 'admin' && (
            <TextField
              select
              label="Select Project"
              value={selectedProjectId || ''}
              onChange={(e) => dispatch(setSelectedProject(e.target.value))}
              sx={{ mb: 3, minWidth: 300 }}
              disabled={isLoading || projectsLoading}
              fullWidth
              variant="outlined"
            >
              {projectsLoading && (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              )}
              {projects.map(project => (
                <MenuItem key={project._id} value={project._id}>
                  {project.projectName}
                </MenuItem>
              ))}
            </TextField>
          )}

{selectedProjectId && (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Budget Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Budget Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)} TND`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Hourly Rates by Position
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" />
                <YAxis
                  label={{
                    value: 'TND/hour',
                    angle: -90,
                    position: 'insideLeft'
                  }}
                />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)} TND`}
                />
                <Legend />
                <Bar dataKey="rate" fill="#8884d8" name="Hourly Rate" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body1">
                Initial Budget: {initialBudget.toFixed(2)} TND
              </Typography>
              <Typography variant="body1">
                Current Usage: {currentBudget.toFixed(2)} TND
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Remaining: {(initialBudget - currentBudget).toFixed(2)} TND
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, maxWidth: 400, minWidth: 300 }}>
              <LinearProgress 
                variant="determinate" 
                value={budgetPercentage}
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: '#eee',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5
                  }
                }}
                color={budgetPercentage > 90 ? 'error' : 'primary'}
              />
              <Typography 
                variant="caption" 
                display="block" 
                textAlign="right"
                sx={{ mt: 0.5 }}
              >
                {budgetPercentage.toFixed(1)}% Utilized
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )}

          {user?.role === 'admin' && (
            <>
              <Typography variant="h4" gutterBottom>
                Hourly Rate Configuration
              </Typography>

              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Add New Position</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    select
                    label="Position"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value as Position)}
                    sx={{ minWidth: 250 }}
                    variant="outlined"
                    size="small"
                  >
                    {Object.values(Position).map(pos => (
                      <MenuItem key={pos} value={pos}>
                        {pos.charAt(0).toUpperCase() + pos.slice(1).replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    onClick={handleAddPosition}
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={isLoading}
                  >
                    Add Position
                  </Button>
                </Box>
              </Paper>

              {positions.map((position) => (
                <Paper key={position.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {position.position.replace('_', ' ').toUpperCase()}
                    </Typography>
                    
                    <TextField
                      type="number"
                      value={position.hourlyRate}
                      onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value));
                        setPositions(prev => prev.map(p => 
                          p.id === position.id ? {...p, hourlyRate: value} : p
                        ));
                      }}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>TND</Typography>,
                        inputProps: { min: 0 }
                      }}
                      sx={{ width: 150 }}
                    />

                    <IconButton 
                      color="error" 
                      onClick={() => handleDeletePosition(position.id)}
                      disabled={isLoading}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ px: 5, py: 1.5 }}
                  onClick={handleSave}
                  disabled={isLoading || !selectedProjectId || positions.length === 0}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Save All Changes'
                  )}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </ErrorBoundary>
  );
};

export default PositionRates;