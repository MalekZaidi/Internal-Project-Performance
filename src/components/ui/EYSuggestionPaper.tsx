import { Paper, styled } from "@mui/material";

export const  EYSuggestionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f9f9f9',
  color: '#222222',
  border: '1px solid #dddddd',
  flex: 1,
  minWidth: 0,
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: '#222',
    backgroundColor: '#f0f0f0',
  },
}));
