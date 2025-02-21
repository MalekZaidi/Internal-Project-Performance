import React from 'react';
import { Box, Typography, Card, CardContent, Grid, IconButton } from '@mui/material';
import { Assignment, CheckCircle, Error, Warning } from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import BarChart from '../../components/ui/BarChart';


ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Dashboard: React.FC = () => {
  const totalProjects = 120;
  const offTrackProjects = 15;
  const completedProjects = 90;
  const atRiskProjects = 10;

  const data = {
    labels: ['Off Track', 'Completed', 'At Risk'],
    datasets: [
      {
        data: [offTrackProjects, completedProjects, atRiskProjects],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCD56'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const dataset = tooltipItem.dataset;
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / totalProjects) * 100).toFixed(2);
            return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', padding: '24px', boxSizing: 'border-box' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid display={'flex'} item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#e0e0e0', padding: 2 }}>
                <Assignment sx={{ fontSize: 40, color: '#333333' }} />
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6">Total Projects</Typography>
                <Typography variant="body1">{totalProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid display={'flex'} item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#f44336', padding: 2 }}>
                <Error sx={{ fontSize: 40, color: 'white' }} />
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6" color="error">
                  Projects Off Track
                </Typography>
                <Typography variant="body1">{offTrackProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid display={'flex'} item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#4caf50', padding: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6" color="success.main">
                  Completed Projects
                </Typography>
                <Typography variant="body1">{completedProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid display={'flex'} item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ backgroundColor: '#ff9800', padding: 2 }}>
                <Warning sx={{ fontSize: 40, color: 'white' }} />
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6" color="warning.main">
                  At-Risk Projects
                </Typography>
                <Typography variant="body1">{atRiskProjects}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid  item xs={12} sm={6} md={6}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Budget Comparison
              </Typography>
              <BarChart />
            </CardContent>
          </Card>
        </Grid>
        {/* Doughnut Chart */}
        <Grid display={'flex'} item xs={12} sm={6} md={6}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Project Status Breakdown
              </Typography>
              <Doughnut data={data} options={options} />
            </CardContent>
          </Card>
        </Grid>


      </Grid>
    </Box>
  );
};

export default Dashboard;
