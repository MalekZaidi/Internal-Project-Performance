import { Box, Grid, Typography, TextField, Divider, MenuItem } from '@mui/material';
import CustomButton from './CustomButton';
import { Position } from '../../features/users/types/user-position.enum';

const fields = ['id', 'fullName', 'email', 'role', 'position', 'phone', 'mobile', 'address'];

interface ProfileDetailsProps {
  isEditing: boolean;
  editableFields: any;
  setEditableFields: (fields: any) => void;
  handleSaveChanges: () => void;
}

const ProfileDetails = ({
  isEditing,
  editableFields,
  setEditableFields,
  handleSaveChanges
}: ProfileDetailsProps) => (
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
            field === 'position' ? (
              <TextField
                select
                fullWidth
                variant="outlined"
                value={editableFields[field] || ''}
                onChange={(e) => 
                  setEditableFields({ ...editableFields, [field]: e.target.value })
                }
                size="small"
              >
                {Object.values(Position).map((position) => (
                  <MenuItem key={position} value={position}>
                    {position}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                value={editableFields[field]}
                onChange={(e) =>
                  setEditableFields({ ...editableFields, [field]: e.target.value })
                }
                size="small"
                disabled={field === 'id' || field === 'role'} // Disable non-editable fields
              />
            )
          ) : (
            <Typography variant="body2" color="text.secondary">
              {editableFields[field] || 'Not specified'}
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