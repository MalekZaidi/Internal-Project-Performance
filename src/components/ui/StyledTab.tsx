import { styled } from '@mui/system';
import {Tab} from '@mui/material'
export const TabStyled = styled(Tab)({
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    '&.Mui-selected': {
        color: '#333',
    },
});

export default TabStyled;
