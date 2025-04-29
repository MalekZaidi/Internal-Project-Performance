// features/users/pages/CreateUserForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from "js-cookie";

import {
  Box,
  Grid,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Chip,
  CircularProgress,
  useTheme,
  Typography,
} from '@mui/material';
import CustomButton from '../../components/ui/CustomButton';
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';
import { Role } from '../../features/users/types/user-role.enum';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { AppDispatch, RootState } from '../../stores/store';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { FormSectionHeader } from '../../components/ui/FormSectionHeader';
import { EYTextField } from '../../components/ui/EYTextField';
import { EYInputLabel } from '../../components/ui/EYInputLabel';
import { EYSelect } from '../../components/ui/EYSelect';
// Validation Schema
const userSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(10, 'Must be at least 10 characters')
    .max(25, 'Cannot exceed 25 characters'),
  login: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      'Must contain at least one letter and one number'
    ),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(Object.values(Role), 'Invalid role'),
});

type UserFormData = yup.InferType<typeof userSchema>;

const CreateUserForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isAdmin = currentUser?.role === Role.ADMIN;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      login: '',
      password: '',
      role: Role.TEAM_MEMBER,
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_API_URL_USERS}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`,
          },
        }
      );

      if (response.status === 201) {
        enqueueSnackbar('User created successfully', { variant: 'success' });
        navigate('/users');
      }
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Error creating user', {
        variant: 'error',
      });
    }
  };

  if (!isAdmin) {
    return (
      <ContentLayout>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="error">
            You don't have permission to access this page
          </Typography>
        </Box>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <Box sx={{ maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          fontWeight: 700,
          textAlign: 'center',
          color: '#222222',
          mb: 4,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Create New User
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <FormSectionHeader
                icon={<PersonIcon sx={{ color: '#222222' }} />}
                title="Personal Information"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <EYTextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="login"
                control={control}
                render={({ field }) => (
                  <EYTextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.login}
                    helperText={errors.login?.message}
                  />
                )}
              />
            </Grid>

            {/* Security Section */}
            <Grid item xs={12}>
              <FormSectionHeader
                icon={<LockIcon sx={{ color: '#222222' }} />}
                title="Security"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <EYTextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.role}>
                <EYInputLabel>Role</EYInputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <EYSelect
                      {...field}
                      label="Role"
                      sx={{ color: '#222222' }}
                    >
                      {Object.values(Role).map((role) => (
                        <MenuItem key={role} value={role}>
                          {role.replace(/_/g, ' ')}
                        </MenuItem>
                      ))}
                    </EYSelect>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Submit Section */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <CustomButton
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/users')}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Create User'
                  )}
                </CustomButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </ContentLayout>
  );
};

export default CreateUserForm;