import React from 'react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Link,
} from '@mui/material';
import bg from '../../assets/bg.jpeg';
import eywhitebg from '../../assets/eywhitebg.png';

const LandingPage: React.FC = () => (
  <Box
    sx={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#130F2B',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Enhanced Background Image */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'contrast(1)',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(19,15,43,0.4), rgba(19,15,43,0.3))',
        },
      }}
    />

    {/* Header */}
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        zIndex: 1,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
        <Box
          component="img"
          src={eywhitebg}
          alt="EY Logo"
          sx={{
            height: 100,
            mr: 2,
          }}
        />
      </Toolbar>
    </AppBar>

    {/* Full-screen Content */}
    <Box
      component="main"
      sx={{
        flex: 1,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 4,
        textAlign: 'center',
        color: 'common.white',
      }}
    >
      <Typography
        variant="h3"          // smaller than h2
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          mb: 3,
          fontWeight: 100,
          letterSpacing: '0.5px',
          textShadow: '0 4px 12px rgba(0,0,0,0.4)',
          maxWidth: 1200,
          lineHeight: 1.2,
        }}
      >
        Welcome To Internal Project Performance 
      </Typography>
      <Typography
        variant="h3"        
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          mb: 3,
          fontWeight: 100,
          letterSpacing: '0.5px',
          textShadow: '0 4px 12px rgba(0,0,0,0.4)',
          maxWidth: 1200,
          lineHeight: 1.2,
        }}
      >
        & Analytics Platform
      </Typography>
      <Typography
        variant="h6"          
        sx={{
          fontSize: { xs: '1rem', md: '1.25rem' },
          mb: 3,
          fontWeight: 100,
          lineHeight: 1.4,
          maxWidth: 800,
          opacity: 0.9,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        Transform project management with real-time analytics and AI-driven
        insights
      </Typography>

      <Button
        href="/login"
        sx={{
          height:50,
          width: 500,
          px: 6,
          py: 2,
          fontSize: '1.1rem',
          backgroundColor: '#ffffff',
          color: '#333333',
          fontWeight: 500,
          borderRadius: 0,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '1px solid #ffffff',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          },
        }}
      >
        Sign In
      </Button>

      <Box sx={{ mt: 4 }}>
        <Link
          href="#"
          sx={{
            color: 'common.white',
            '&:hover': { color: '#00C7D3' },
            display: 'block',
            mb: 1,
            fontSize: '0.9rem',
          }}
        >
          Having trouble signing in?
        </Link>
        <Link
          href="mailto:mysysupport@ey.com"
          sx={{
            color: '#00C7D3',
            fontWeight: 500,
            fontSize: '0.95rem',
          }}
        >
          Contact Support: mysysupport@ey.com
        </Link>
      </Box>
    </Box>
  </Box>
);

export default LandingPage;
