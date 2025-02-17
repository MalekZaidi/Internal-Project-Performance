import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

interface StyleProps {
  collapsed: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  appBar: {
    backgroundColor: '#333333',
    zIndex: 1300,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Roboto, sans-serif',
  },
  logo: {
    height: 40,
  },
  title: {
    marginLeft: theme.spacing(2),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  formControl: {
    minWidth: 120,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
    '& .MuiSvgIcon-root': {
      color: 'white',
    },
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
    paddingX: theme.spacing(1),
    width: 'auto',
    minWidth: 150,
    flexGrow: 1,
    '& .MuiInputBase-root': {
      width: '100%',
      marginLeft: theme.spacing(1),
    },
    '& .MuiSvgIcon-root': {
      color: 'black',
    },
  },
  iconButton: {
    color: 'inherit',
  },
  sidebar: {
    width: (props: StyleProps) => (props.collapsed ? 60 : 200),
    flexShrink: 0,
    backgroundColor: '#333333',
    color: 'white',
    paddingTop: theme.spacing(8),
    overflowX: 'hidden',
    transition: 'width 0.3s',
  },
  listItemButton: {
    py: theme.spacing(2),
    px: theme.spacing(1.5),
    '&:hover': {
      backgroundColor: '#ffe600',
      color: '#333333',
    },
  },
  listItemIcon: {
    color: 'white',
    minWidth: (props: StyleProps) => (props.collapsed ? 'auto' : 56),
  },
  listItemText: {
    color: 'white',
    fontFamily: 'Roboto, sans-serif',
  },
  divider: {
    marginY: theme.spacing(2),
    backgroundColor: 'white',
  },
}));

export default useStyles;
