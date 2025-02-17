import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import logo from '../../../assets/eylogo.png';

const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#222',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '90%',
  maxWidth: 400,
  padding: '32px',
  textAlign: 'center',
  borderRadius: '8px',
  backgroundColor: '#fff',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const Logo = styled('img')({
  width: '80px',
  marginBottom: '16px',
});

const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'a' && password === 'a') {
      localStorage.setItem('auth', 'true'); // Store login state
      setIsAuthenticated(true);
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      alert('Invalid credentials! Try a / a');
    }
  };

  return (
    <LoginContainer>
      <StyledCard>
        <Logo src={logo} alt="EY Logo" />

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login
        </Typography>

        <CardContent>
          <TextField
            fullWidth
            label="Email address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              style: {
                fontSize: '14px',
              },
            }}
            inputProps={{
              style: {
                fontSize: '14px',
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              style: {
                fontSize: '14px',
              },
            }}
            inputProps={{
              style: {
                fontSize: '14px',
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#222',
              color: 'white',
              fontSize: '14px',
              '&:hover': {
                backgroundColor: '#ffe600',
                color: '#222',
              },
            }}
            onClick={handleLogin}
          >
            SIGN IN
          </Button>
        </CardContent>
      </StyledCard>
    </LoginContainer>
  );
};

export default Login;
