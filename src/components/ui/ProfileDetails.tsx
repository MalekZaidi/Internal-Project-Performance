import { Box, Grid, Typography, TextField, Divider } from '@mui/material';
import CustomButton from './CustomButton';

const fields = ['id', 'fullName', 'email', 'role', 'phone', 'mobile', 'address'];

const ProfileDetails = ({ isEditing, editableFields, setEditableFields, handleSaveChanges }: any) => (
  <>
    <Typography fontWeight="bold" mb={2}>User Details</Typography>
    {fields.map((field) => (
      <Grid container spacing={2} key={field} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Typography variant="body2" fontWeight="bold">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              value={editableFields[field]}
              onChange={(e) =>
                setEditableFields({ ...editableFields, [field]: e.target.value })
              }
              size="small"
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {editableFields[field]}
            </Typography>
          )}
        </Grid>
        <Divider sx={{ my: 2, width: '100%' }} />
      </Grid>
    ))}
    {isEditing && (
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <CustomButton variant="contained" onClick={handleSaveChanges}>
          Save Changes
        </CustomButton>
      </Box>
    )}
  </>
);

export default ProfileDetails;
