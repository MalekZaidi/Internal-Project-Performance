import { useState } from 'react';
import { 
    Box, Typography, Avatar, Card, CardContent, Grid, TextField, Tabs, Tab, Button, Divider 
} from '@mui/material';
import { styled } from '@mui/system';
import CustomButton from '../../components/ui/CustomButton';

const ProfileContainer = styled(Box)({
    width: '100vw',
    backgroundColor: '#eee',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
});

const CardStyled = styled(Card)({
    borderRadius: '8px',
    background: '#fff',
});

const AvatarStyled = styled(Avatar)({
    width: 150,
    height: 150,
    margin: '0 auto 16px',
});

const StyledTabs = styled(Tabs)({
    borderBottom: '2px solid #eee', // Yellow tab indicator
});

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 'bold',
    borderBottom: '2px solid #FFE600', // Yellow tab indicator

    
}));

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
    return value === index ? <Box sx={{ mt: 3 }}>{children}</Box> : null;
};

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false); // Toggle form visibility
    const [profileData, setProfileData] = useState({
        name: 'Malek Zaidi',
        email: 'malek.zaidi@esprit.tn',
        dateOfBirth: '1990-01-25',
        address: 'La Marsa, Tunis',
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const tabs = ["Profile", "Preferences", "Security"];


    return (
        <ProfileContainer>
            <Grid container spacing={3} sx={{ maxWidth: '900px' }}>
                
                {/* Avatar & Basic Info Card */}
                <Grid item xs={12} md={4}>
                    <CardStyled>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <AvatarStyled src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" />
                            <Typography variant="h5" fontWeight="bold">{profileData.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{profileData.email}</Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>{profileData.address}</Typography>
                            {!isEditing ? (
                                <CustomButton onClick={handleEditProfile}>Edit Profile</CustomButton>
                            ) : null}
                        </CardContent>
                    </CardStyled>
                </Grid>

                {/* Profile Details & Tabs Card */}
                <Grid item xs={12} md={8}>
                    <CardStyled>
                        <CardContent>
                            {/* Tabs Navigation */}
                  <Tabs value={activeTab} onChange={handleTabChange} centered>
                            <StyledTab 
                                label="Profile" 
                                sx={{ color: activeTab === 0 ? '#ffe600' : 'inherit' }} 
                            />
                            <StyledTab 
                                label="Preferences"
                                 
                                sx={{ color: activeTab === 1 ? '#FFE600' : 'inherit' }} 
                            />
                            <StyledTab 
                                label="Security" 
                                sx={{ color: activeTab === 2 ? '#FFE600' : 'inherit' }} 
                            />
                        </Tabs>

                            {/* Profile Tab Content */}
                            <TabPanel value={activeTab} index={0}>
                                <Typography variant="h6" fontWeight="bold">Profile Information</Typography>
                                
                                {!isEditing ? (
                                    <>
                                        <Typography variant="body2"><b>Full Name:</b> {profileData.name}</Typography>
                                        <Typography variant="body2"><b>Email:</b> {profileData.email}</Typography>
                                        <Typography variant="body2"><b>Date of Birth:</b> {profileData.dateOfBirth}</Typography>
                                        <Typography variant="body2"><b>Address:</b> {profileData.address}</Typography>
                                    </>
                                ) : (
                                    <Grid container spacing={2} mt={1}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Full Name</Typography>
                                            <TextField fullWidth defaultValue={profileData.name} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Email</Typography>
                                            <TextField fullWidth defaultValue={profileData.email} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Date of Birth</Typography>
                                            <TextField fullWidth type="date" defaultValue={profileData.dateOfBirth} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Address</Typography>
                                            <TextField fullWidth defaultValue={profileData.address} />
                                        </Grid>
                                    </Grid>
                                )}

                                {isEditing ? (
                                    <Box sx={{ mt: 3 }}>
                                        <CustomButton onClick={() => setIsEditing(false)}>Save Changes</CustomButton>
                                        <Button onClick={handleCancelEdit} sx={{ ml: 2 }}>Cancel</Button>
                                    </Box>
                                ) : null}
                            </TabPanel>

                            {/* Preferences Tab Content */}
                            <TabPanel value={activeTab} index={1}>
                                <Typography variant="h6" fontWeight="bold">Preferences</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Customize your app preferences here.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2">Language</Typography>
                                <TextField fullWidth value="English" />
                            </TabPanel>

                            {/* Security Tab Content */}
                            <TabPanel value={activeTab} index={2}>
                                <Typography variant="h6" fontWeight="bold">Security Settings</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Change your password or manage your security settings.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2">Password</Typography>
                                <TextField fullWidth type="password" value="********" />
                                <CustomButton >Update Password</CustomButton>
                            </TabPanel>
                        </CardContent>
                    </CardStyled>
                </Grid>

                {/* Skills & Assignments Card */}
                <Grid item xs={12} md={6}>
                    <CardStyled>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">Assignments & Skills</Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Below are your assigned skills and ongoing assignments.
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" fontWeight="bold">Skills:</Typography>
                            <Typography variant="body2" color="text.secondary">React, JavaScript, UI/UX Design</Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" fontWeight="bold">Current Assignment:</Typography>
                            <Typography variant="body2" color="text.secondary">Building a responsive dashboard UI</Typography>
                        </CardContent>
                    </CardStyled>
                </Grid>

            </Grid>
        </ProfileContainer>
    );
};

export default UserProfile;
