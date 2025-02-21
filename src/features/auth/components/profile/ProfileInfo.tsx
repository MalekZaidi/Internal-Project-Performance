import { Grid, Typography } from '@mui/material';
import AvatarStyled from '../../../../components/ui/AvatarStyled';
import CustomButton from '../../../../components/ui/CustomButton';

interface ProfileInfoProps {
    fullName: string;
    role?: string;
    address: string;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}

const ProfileInfo = ({ fullName, role, address, isEditing, setIsEditing }: ProfileInfoProps) => {
    return (
        <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                <AvatarStyled src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" />
            </Grid>
            <Grid item xs={12} sm={8}>
                <Typography variant="h5" fontWeight="bold">{fullName}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>{role}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>{address}</Typography>
                <CustomButton onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                </CustomButton>
            </Grid>
        </Grid>
    );
};

export default ProfileInfo;
