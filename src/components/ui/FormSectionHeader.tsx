import { Divider, Typography } from "@mui/material";

export const FormSectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <>
      <Typography variant="h6" gutterBottom sx={{ 
        fontWeight: 600,
        color: '#222222',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {icon}
        {title}
      </Typography>
      <Divider sx={{ mb: 2, borderColor: '#eeeeee' }} />
    </>
  );