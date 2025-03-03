import { styled } from '@mui/system';

const Logo = styled('img')(({ theme }) => ({
  width: '80px',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    width: '60px',
  },
}));

const CustomLogo = ({ src, alt }: { src: string; alt: string }) => {
  return <Logo src={src} alt={alt} />;
};

export default CustomLogo;
