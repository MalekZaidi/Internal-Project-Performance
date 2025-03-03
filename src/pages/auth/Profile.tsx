import { useEffect, useState } from 'react';
import { 
    Box, Typography, Avatar, Card, CardContent, CircularProgress, 
    Grid, TextField, Tabs, Tab, Divider 
} from '@mui/material';
import { styled } from '@mui/system';
import { fetchUserProfile } from '../../features/auth/api/authService';
import CustomButton from '../../components/ui/CustomButton';

const ProfileContainer = styled(Box)({
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: '#F5F5F5',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
});

const CardStyled = styled(Card)({
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    padding: '20px',
});

const AvatarStyled = styled(Avatar)({
    width: 120,
    height: 120,
    border: '4px solid #FFE600',
});

const SectionTitle = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '12px',
    fontSize: '1.1rem',
});

const TabsStyled = styled(Tabs)({
    borderBottom: '2px solid #ddd',
    '& .MuiTabs-indicator': {
        backgroundColor: '#FFE600',
        height: '3px',
        borderRadius: '3px',
    },
});

const TabStyled = styled(Tab)({
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    '&.Mui-selected': {
        color: '#333',
    },
});

const UserProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [editableFields, setEditableFields] = useState<any>({
        id :"",
        email: '',
        fullName: '',
        phone: '',
        mobile: '',
        address: '',
    });

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const profileData = await fetchUserProfile();
                setUser(profileData);
                setEditableFields({
                    id:profileData._id,
                    role:profileData.role,  
                    email: profileData.login,
                    fullName: profileData.fullName,
                    phone: '(097) 234-5678',
                    mobile: '(098) 765-4321',
                    address: 'Bay Area, San Francisco, CA',
                });
            } catch (error) {
                console.error('Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };
        getUserProfile();
    }, []);

    const handleSaveChanges = () => {
        console.log('Updated fields:', editableFields);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <ProfileContainer>
                <CircularProgress />
            </ProfileContainer>
        );
    }

    return (
        <ProfileContainer>
            <Grid container spacing={4} maxWidth="1000px">
                {/* Profile Info (Avatar + Details) */}
                <Grid item xs={12}>
                    <CardStyled>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                                <AvatarStyled src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h5" fontWeight="bold">{editableFields.fullName}</Typography>
                                <Typography variant="body2" color="text.secondary" mb={1}>{user?.role}</Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>{editableFields.address}</Typography>
                                <CustomButton onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </CustomButton>
                            </Grid>
                        </Grid>
                    </CardStyled>
                </Grid>

                <Grid item xs={12}>
                    <CardStyled>
                        <TabsStyled value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
                            <TabStyled label="Profile" />
                            <TabStyled label="Preferences" />
                            <TabStyled label="Security" />
                        </TabsStyled>

                        <CardContent>
                            {activeTab === 0 && (
                                <>
                                    <SectionTitle variant="h6">User Details</SectionTitle>
                                    {['id','fullName', 'email','role','phone', 'mobile', 'address'].map((field) => (
                                        <Grid container spacing={2} key={field} alignItems="center">
                                            <Grid item xs={4}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={8}>
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
                                            <CustomButton variant="contained" color="primary" onClick={handleSaveChanges}>
                                                Save Changes
                                            </CustomButton>
                                        </Box>
                                    )}
                                </>
                            )}

                            {activeTab === 1 && (
                                <Typography variant="body2" color="text.secondary">
                                    Preferences settings go here.
                                </Typography>
                            )}

                            {activeTab === 2 && (
                                <Typography variant="body2" color="text.secondary">
                                    Security settings go here.
                                </Typography>
                            )}
                        </CardContent>
                    </CardStyled>
                </Grid>
                {/* Skills Section */}
                <Grid  item xs={12}>
                    <CardStyled>
                        <CardContent>
                            <SectionTitle variant="h6">Assignments & Skills</SectionTitle>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Below are your assigned skills and ongoing assignments.
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" fontWeight="bold">Skills:</Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>React, JavaScript, UI/UX Design</Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" fontWeight="bold">Current Assignment:</Typography>
                            <Typography variant="body2" color="text.secondary">Building a responsive dashboard UI</Typography>
                        </CardContent>
                    </CardStyled>
                </Grid>

                {/* Tabs + Content */}

            </Grid>
        </ProfileContainer>
    );
};

export default UserProfile;
