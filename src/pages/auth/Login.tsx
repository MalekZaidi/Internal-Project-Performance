import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CardContent, Alert } from '@mui/material';
import CustomButton from '../../components/ui/CustomButton';
import CustomTextField from '../../components/ui/CustomTextField';
import CustomStyledCard from '../../components/ui/StyledCard';
import LoginContainer from '../../features/auth/components/login/LoginContainer';
import CustomLogo from '../../components/ui/CustomLogo'
import logo from '../../assets/eylogo.png';
import { login } from '../../features/auth/api/authService';

const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await login(email, password);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <LoginContainer>
      <CustomStyledCard>
        <CustomLogo src={logo} alt="EY Logo" />

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login
        </Typography>

        <CardContent>
          {error && <Alert severity="error" sx={{ marginBottom: '16px' }}>{error}</Alert>}

          <CustomTextField
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <CustomButton onClick={handleLogin} fullWidth>
            SIGN IN
          </CustomButton>
        </CardContent>
      </CustomStyledCard>
    </LoginContainer>
  );
};

export default Login;
