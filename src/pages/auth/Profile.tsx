import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { fetchUserProfile } from '../../features/auth/api/authService';
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';
import ProfileHeader from '../../components/ui/ProfileHeader';
import ProfileTabs from '../../components/ui/ProfileTabs';
import ProfileDetails from '../../components/ui/ProfileDetails';
import SkillsSection from '../../components/ui/SkillSection';
import { useGetUserQuery } from '../../features/users/api/usersApi';

const CardStyled = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  padding: '20px',
  width: '100%',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}));

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editableFields, setEditableFields] = useState<any>({
    id: '',
    email: '',
    fullName: '',
    phone: '',
    mobile: '',
    address: '',
    role: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        setUser(profileData);
        setEditableFields({
          id: profileData._id,
          role: profileData.role,
          email: profileData.login,
          fullName: profileData.fullName,
          phone: '(097) 234-5678',
          mobile: '(098) 765-4321',
          address: 'Bay Area, San Francisco, CA',
        });
      } catch (err) {
        console.error('Error loading profile', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);
  const { data: currentUser, refetch: refetchUser } = useGetUserQuery(user?._id || '', {
    skip: !user?._id
  });
  const handleSaveChanges = () => {
    console.log('Updated fields:', editableFields);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <ContentLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
        <Grid item xs={12}>
          <CardStyled>
            <ProfileHeader
              fullName={editableFields.fullName}
              role={editableFields.role}
              address={editableFields.address}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
            />
          </CardStyled>
        </Grid>

        <Grid item xs={12}>
          <CardStyled>
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <CardContent>
              {activeTab === 0 && (
                <ProfileDetails
                  isEditing={isEditing}
                  editableFields={editableFields}
                  setEditableFields={setEditableFields}
                  handleSaveChanges={handleSaveChanges}
                />
              )}
              {activeTab === 1 && <Box p={2}>Preferences settings go here.</Box>}
              {activeTab === 2 && <Box p={2}>Security settings go here.</Box>}
            </CardContent>
          </CardStyled>
        </Grid>

                  

        <Grid item xs={12}>
          <CardStyled>
            <CardContent>
            <SkillsSection 
                userId={editableFields.id} 
                userSkills={currentUser?.skills || []} 
                refetchUser={refetchUser}
              />
            </CardContent>
          </CardStyled>
        </Grid>
      </Grid>
    </ContentLayout>
  );
};

export default UserProfile;
