import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import CustomButton from '../../components/ui/CustomButton';

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid #FFE600',
  [theme.breakpoints.down('sm')]: {
    width: 80,
    height: 80,
  },
}));

const ProfileHeader = ({ fullName, role, address, isEditing, onToggleEdit }: any) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} sm={4} display="flex" justifyContent="center">
      <AvatarStyled src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" />
    </Grid>
    <Grid item xs={12} sm={8}>
      <Typography variant="h5" fontWeight="bold">{fullName}</Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>{role}</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>{address}</Typography>
      <CustomButton onClick={onToggleEdit}>
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </CustomButton>
    </Grid>
  </Grid>
);

export default ProfileHeader;
