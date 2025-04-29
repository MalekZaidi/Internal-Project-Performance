import { Select, styled } from "@mui/material";

export const  EYSelect = styled(Select)(({ theme }) => ({
    '& .MuiSelect-icon': {
      color: '#666666',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#222 !important',
      borderWidth: '2px',
    },
    '& .MuiOutlinedInput-root': {
      color: '#222222',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#222',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#222',
      },
    },
  }));