import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  IconButton,
  useTheme 
} from '@mui/material';
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
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const totalProjects = 120;
  const offTrackProjects = 15;
  const completedProjects = 90;
  const atRiskProjects = 10;

  const statusData = {
    labels: ['Off Track', 'Completed', 'At Risk'],
    datasets: [
      {
        data: [offTrackProjects, completedProjects, atRiskProjects],
        backgroundColor: [
          theme.palette.error.main,
          theme.palette.success.main,
          theme.palette.warning.main
        ],
        borderColor: theme.palette.background.paper,
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (tooltipItem: any) => {
            const currentValue = tooltipItem.raw;
            const percentage = ((currentValue / totalProjects) * 100).toFixed(1);
            return ` ${currentValue} projects (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ 
      width: '100%', 
      p: { xs: 2, md: 4 },
      backgroundColor: theme.palette.background.default
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 700,
        color: theme.palette.text.primary,
        mb: 4
      }}>
        Project Overview Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Metric Cards */}
        {[
          {
            title: 'Total Projects',
            value: totalProjects,
            icon: <Assignment fontSize="large" />,
            color: theme.palette.primary.main
          },
          {
            title: 'Off Track',
            value: offTrackProjects,
            icon: <Error fontSize="large" />,
            color: theme.palette.error.main
          },
          {
            title: 'Completed',
            value: completedProjects,
            icon: <CheckCircle fontSize="large" />,
            color: theme.palette.success.main
          },
          {
            title: 'At Risk',
            value: atRiskProjects,
            icon: <Warning fontSize="large" />,
            color: theme.palette.warning.main
          }
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              height: '100%',
              borderRadius: 4,
              boxShadow: theme.shadows[4],
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                py: 3,
                background: `linear-gradient(135deg, ${metric.color}20 0%, ${theme.palette.background.paper} 100%)`
              }}>
                <IconButton sx={{ 
                  backgroundColor: `${metric.color}20`,
                  mr: 3,
                  p: 2,
                  borderRadius: 3
                }}>
                  {React.cloneElement(metric.icon, { 
                    sx: { color: metric.color } 
                  })}
                </IconButton>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    {metric.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color={metric.color}>
                    {metric.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            height: '100%',
            borderRadius: 4,
            boxShadow: theme.shadows[4]
          }}>
            <CardContent sx={{ 
              height: 400,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Budget Comparison
              </Typography>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <BarChart />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{
            height: '100%',
            borderRadius: 4,
            boxShadow: theme.shadows[4]
          }}>
            <CardContent sx={{ 
              height: 400,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Project Status Breakdown
              </Typography>
              <Box sx={{ 
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Doughnut 
                  data={statusData} 
                  options={chartOptions} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;