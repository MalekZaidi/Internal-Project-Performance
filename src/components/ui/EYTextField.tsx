import { styled, TextField } from "@mui/material";

export const EYTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
      color: '#222222',
    },
    '& .MuiInputLabel-root': {
      color: '#222222', 
      '&.Mui-focused': {
        color: '#222222', 
      },
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#dddddd',
      },
      '&:hover fieldset': {
        borderColor: '#222',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#222',
        borderWidth: '2px',
      },
    },
    '& .MuiFormHelperText-root': {
      color: '#666666',
    },
  }));