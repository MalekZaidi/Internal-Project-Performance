import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  // custom ey button 
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      sx={{
        mt: 2,
        backgroundColor: '#222',
        color: 'white',
        '&:hover': {
          backgroundColor: '#ffe600',
          color: '#222',
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
