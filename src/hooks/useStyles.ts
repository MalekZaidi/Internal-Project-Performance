import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
  appBar: {
    backgroundColor: '#333333',
  },
  logo: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#FFFFFF33',
    '&:hover': {
      backgroundColor: '#FFFFFF50',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#FFE600',
      color: '#333333',
    },
  },
}));

export default useStyles;
