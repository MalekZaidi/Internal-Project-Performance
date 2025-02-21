import { Card, CardContent, Divider, Typography } from '@mui/material';
import { styled } from '@mui/system';

const CardStyled = styled(Card)({
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    padding: '20px',
});

const SkillsSection = () => {
    return (
        <CardStyled>
            <CardContent>
                <Typography variant="h6" fontWeight="bold">Assignments & Skills</Typography>
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
    );
};

export default SkillsSection;
