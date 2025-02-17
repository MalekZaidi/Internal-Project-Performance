// src/components/CustomButton.tsx
import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  // Add any custom props if needed
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      fullWidth
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
