import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, CardContent, Alert, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomButton from "../../components/ui/CustomButton";
import CustomTextField from "../../components/ui/CustomTextField";
import LoginStyledCard from "../../components/ui/StyledCard";
import LoginContainer from "../../features/auth/components/login/LoginContainer";
import CustomLogo from "../../components/ui/CustomLogo";
import logo from "../../assets/eylogo.png";
import { fetchUserProfile, loginUser } from "../../features/auth/api/authSlice";
import { RootState, AppDispatch } from "../../stores/store";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        // Wait for the profile to be fetched before navigating
        const profileResult = await dispatch(fetchUserProfile());
        if (fetchUserProfile.fulfilled.match(profileResult)) {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <LoginContainer>
      <LoginStyledCard>
        <CustomLogo src={logo} alt="EY Logo" />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Sign In!
        </Typography>
        <CardContent>
          {error && <Alert severity="error" sx={{ marginBottom: "16px" }}>{error}</Alert>}

          <CustomTextField
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomTextField
            label="Password"
            type={showPassword ? "text" : "password"}
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

          <CustomButton onClick={handleLogin} disabled={loading}>
            {loading ? "Signing In..." : "SIGN IN"}
          </CustomButton>
        </CardContent>
      </LoginStyledCard>
    </LoginContainer>
  );
};

export default Login;

