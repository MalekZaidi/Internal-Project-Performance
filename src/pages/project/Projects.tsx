import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/ui/CustomButton';
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';

const Projects: React.FC = () => {
  const navigate = useNavigate();

  const handleAddProject = () => {
     navigate('/projects/add'); 

  };

  return (
    // <Box sx={{ padding: '16px' }}>  
    <ContentLayout>
      <Typography variant="h4" sx={{ marginBottom: '16px' }}>Projects</Typography>
      <CustomButton onClick={handleAddProject}>
        Add New Project
      </CustomButton>
      </ContentLayout>
    // </Box>
  );
};

export default Projects;
