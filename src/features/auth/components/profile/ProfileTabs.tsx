import { Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';

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

interface ProfileTabsProps {
    activeTab: number;
    setActiveTab: (value: number) => void;
}

const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
    return (
        <TabsStyled value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
            <TabStyled label="Profile" />
            <TabStyled label="Preferences" />
            <TabStyled label="Security" />
        </TabsStyled>
    );
};

export default ProfileTabs;
