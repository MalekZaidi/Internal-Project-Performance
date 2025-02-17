// src/pages/project/Projects.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/ui/CustomButton';

const Projects: React.FC = () => {
  const navigate = useNavigate();

  const handleAddProject = () => {
    navigate('/projects/add'); // Redirect to Add Project page
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h4" sx={{ marginBottom: '16px' }}>Projects</Typography>
      <CustomButton onClick={handleAddProject}>
        Add New Project
      </CustomButton>
      {/* Rest of your projects page content */}
    </Box>
  );
};

export default Projects;
