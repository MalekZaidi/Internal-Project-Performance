import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CardContent, Alert, IconButton } from '@mui/material';
import CustomButton from '../../components/ui/CustomButton';
import CustomTextField from '../../components/ui/CustomTextField';
import LoginStyledCard from '../../components/ui/StyledCard';
import LoginContainer from '../../features/auth/components/login/LoginContainer';
import CustomLogo from '../../components/ui/CustomLogo'
import logo from '../../assets/eylogo.png';
import { login } from '../../features/auth/api/authService';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    try {
      await login(email, password);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    
    <LoginContainer>
      <LoginStyledCard>
        <CustomLogo src={logo} alt="EY Logo" />

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Sign In !
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
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            ),
          }}
        />

          <CustomButton onClick={handleLogin} >
            SIGN IN
          </CustomButton>
        </CardContent>
      </LoginStyledCard>
    </LoginContainer>
  );
};

export default Login;
