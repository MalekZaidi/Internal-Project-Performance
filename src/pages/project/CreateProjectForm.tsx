import React, { useState } from 'react';
import { Box, TextField, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createProject } from '../../features/project-management/stores/projectStore'; // Example action for creating a project
import CustomButton from '../../components/ui/CustomButton';

const CreateProjectForm: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      projectName,
      projectDescription,
      projectDeadline: `${startDate} - ${endDate}`, // Concatenate startDate and endDate into projectDeadline
      status,
      totalBudget,
    };
    dispatch(createProject(newProject)); // Dispatch the action to create a project
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        margin: 'auto',
        padding: '16px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: '16px', textAlign: 'center' }}>Create New Project</Typography>
      <Grid container spacing={2}>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Project Name"
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            fullWidth
            sx={{ marginBottom: '12px' }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Project ID (Auto-generated)"
            variant="outlined"
            value="AUTO123"  // Replace with auto-generated ID logic if needed
            fullWidth
            sx={{ marginBottom: '12px' }}
            disabled
          />
        </Grid>
        {/* Right Column */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Description"
            variant="outlined"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            fullWidth
            sx={{ marginBottom: '12px' }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            type="date"
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            sx={{ marginBottom: '12px' }}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            sx={{ marginBottom: '12px' }}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: '12px' }} required>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="on-hold">On Hold</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Total Budget"
            type="number"
            variant="outlined"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            fullWidth
            sx={{ marginBottom: '12px' }}
            required
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <CustomButton onClick={handleSubmit}>
          Create Project
        </CustomButton>
      </Box>
    </Box>
  );
};

export default CreateProjectForm;
