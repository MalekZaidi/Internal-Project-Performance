import { Box } from '@mui/material';
import { styled } from '@mui/system';

const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#222',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(4),
  },
}));

export default LoginContainer;
