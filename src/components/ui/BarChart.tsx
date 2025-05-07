import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart: React.FC = () => {
  const theme = useTheme();

  const data = {
    labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5'],
    datasets: [
      {
        label: 'Initial Budget',
        data: [50000, 60000, 80000, 20000, 40000],
        backgroundColor: '#333333',
        borderColor: '#333333',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Actual Budget',
        data: [55000, 58000, 75000, 22000, 39000],
        backgroundColor: '#666666',
        borderColor: theme.palette.secondary.main,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary
        }
      },
      title: {
        display: true,
        text: 'Budget Comparison (Initial vs. Actual)',
        color: theme.palette.text.primary,
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback: (value: string | number) => `$${Number(value).toLocaleString()}`
        }
      }
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;