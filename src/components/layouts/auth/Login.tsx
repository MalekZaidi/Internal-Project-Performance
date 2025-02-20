import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Card, CardContent, Alert } from '@mui/material';
import { styled } from '@mui/system';
import logo from '../../../assets/eylogo.png';
import CustomButton from '../../ui/CustomButton';
import { login } from '../../../features/auth/api/authService';

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
  const [error, setError] = useState<string | null>(null);  // Added state for error

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      setIsAuthenticated(true);
      navigate('/dashboard');  // Redirect to dashboard
    } catch (error) {
      setError('Invalid credentials!');  // Set error message
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
          {error && <Alert severity="error" sx={{ marginBottom: '16px' }}>{error}</Alert>}  {/* Display error message */}

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

          <CustomButton onClick={handleLogin}>SIGN IN</CustomButton>
        </CardContent>
      </StyledCard>
    </LoginContainer>
  );
};

export default Login;
