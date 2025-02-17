import React from 'react';
import { Box, Typography, Card, CardContent, Grid, IconButton } from '@mui/material';
import { Assignment, CheckCircle, Error, Warning } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // Sample data (replace with actual dynamic data)
  const totalProjects = 120;
  const offTrackProjects = 15;
  const completedProjects = 90;
  const atRiskProjects = 10;

  return (
    <Box sx={{ width: '100%', padding: '24px', boxSizing: 'border-box' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Total Projects Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#e0e0e0', padding: 2 }}>
                <Assignment sx={{ fontSize: 40, color: '#1976d2' }} />
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6">Total Projects</Typography>
                <Typography variant="body1">{totalProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Off Track Projects Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#f44336', padding: 2 }}>
                <Error sx={{ fontSize: 40, color: 'white' }} />
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6" color="error">Projects Off Track</Typography>
                <Typography variant="body1">{offTrackProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed Projects Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#4caf50', padding: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6" color="success.main">Completed Projects</Typography>
                <Typography variant="body1">{completedProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* At Risk Projects Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#ff9800', padding: 2 }}>
                <Warning sx={{ fontSize: 40, color: 'white' }} />
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6" color="warning.main">At-Risk Projects</Typography>
                <Typography variant="body1">{atRiskProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
