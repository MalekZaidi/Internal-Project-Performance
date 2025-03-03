import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '8px',
  backgroundColor: '#fff',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    maxWidth: '90%',
  },
}));

const CustomStyledCard = (props: CardProps) => {
  return <StyledCard {...props} />;
};

export default CustomStyledCard;
