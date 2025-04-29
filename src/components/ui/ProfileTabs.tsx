import { Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';

const TabsStyled = styled(Tabs)(({ theme }) => ({
    borderBottom: '2px solid #ddd',
    '& .MuiTabs-indicator': {
        backgroundColor: '#FFE600',
        height: '3px',
        borderRadius: '3px',
    },
}));

const TabStyled = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    '&.Mui-selected': {
        color: '#333',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9rem',
    },
}));

const ProfileTabs = ({ activeTab, setActiveTab }: { activeTab: number, setActiveTab: (val: number) => void }) => (
    <TabsStyled value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)} variant="scrollable" scrollButtons>
        <TabStyled label="Profile" />
        <TabStyled label="Preferences" />
        <TabStyled label="Security" />
    </TabsStyled>
);

export default ProfileTabs;
