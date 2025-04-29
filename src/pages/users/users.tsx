import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  TableSortLabel,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUsers } from '../../features/users/api/usersSlice';
import { AppDispatch, RootState } from '../../stores/store';
import CustomButton from '../../components/ui/CustomButton';
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Role } from '../../features/users/types/user-role.enum';

type User = {
  _id: string;
  fullName: string;
  login: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
};

type Order = 'asc' | 'desc';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector(selectUsers);
  const { loading, error } = useSelector((state: RootState) => state.users);
  const theme = useTheme();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const isAdmin = currentUser?.role === 'admin';

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof User>('fullName');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleExpandRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users
    .filter((u) => (roleFilter ? u.role === roleFilter : true))
    .filter((u) => (statusFilter ? u.isActive === (statusFilter === 'active') : true))
    .sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return (aVal === bVal ? 0 : aVal ? -1 : 1) * (order === 'asc' ? 1 : -1);
      }

      return String(aVal).localeCompare(String(bVal)) * (order === 'asc' ? 1 : -1);
    });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueRoles = [...new Set(users.map((u) => u.role))];
  const statusOptions = ['active', 'inactive'];

  const handleAddUser = () => navigate('/users/add');
  const handleEditUser = (id: string) => navigate(`/users/edit/${id}`);

  const roleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN: return 'primary';
      case Role.PROJECT_MANAGER: return 'secondary';
      default: return 'default';
    }
  };

  const statusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ContentLayout>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        width : 1000,
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          User Management
        </Typography>
        {isAdmin && (
          <CustomButton 
            onClick={handleAddUser}
            variant="contained"
          >
            Add New User
          </CustomButton>
        )}
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ 
        mb: 3, 
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <FilterAltIcon color="action" />
          <Typography variant="subtitle1" color="text.secondary">
            Filter Users
          </Typography>
        </Stack>
        
        <Divider sx={{ mb: 2 }} />
        
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="Role"
            >
              <MenuItem value="">All Roles</MenuItem>
              {uniqueRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', backgroundColor: theme.palette.error.light }}>
          <Typography color="error" fontWeight="bold">
            Error loading users: {error}
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden'
        }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableRow>
                  <TableCell width={50} />
                  <TableCell sortDirection={orderBy === 'fullName' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'fullName'}
                      direction={orderBy === 'fullName' ? order : 'asc'}
                      onClick={() => handleSort('fullName')}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>User</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'login' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'login'}
                      direction={orderBy === 'login' ? order : 'asc'}
                      onClick={() => handleSort('login')}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>Email</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'role' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'role'}
                      direction={orderBy === 'role' ? order : 'asc'}
                      onClick={() => handleSort('role')}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>Role</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'isActive' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'isActive'}
                      direction={orderBy === 'isActive' ? order : 'asc'}
                      onClick={() => handleSort('isActive')}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" width={150}>
                    <Typography variant="subtitle2" fontWeight={600}>Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <React.Fragment key={user._id}>
                      <TableRow hover sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleExpandRow(user._id)}
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {expandedRows[user._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                              {user.fullName.charAt(0)}
                            </Avatar>
                            <Typography fontWeight={500}>{user.fullName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{user.login}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            size="small"
                            color={roleColor(user.role)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.isActive ? 'Active' : 'Inactive'} 
                            size="small"
                            color={statusColor(user.isActive)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details" arrow>
                            <IconButton 
                              onClick={() => navigate(`/users/${user._id}`)}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {isAdmin && (
                            <Tooltip title="Edit User" arrow>
                              <IconButton 
                                onClick={() => handleEditUser(user._id)}
                                size="small"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} sx={{ py: 0, backgroundColor: theme.palette.grey[50] }}>
                          <Collapse in={expandedRows[user._id]} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 3 }}>
                              <Stack direction="row" spacing={4}>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Created:</strong> {formatDate(user.createdAt)}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Last Login:</strong> {formatDate(user.lastLogin)}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Account Status:</strong> {user.isActive ? 'Active' : 'Inactive'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>User ID:</strong> {user._id}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No users found matching your filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ 
              borderTop: `1px solid ${theme.palette.divider}`,
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: theme.palette.text.secondary
              }
            }}
          />
        </Paper>
      )}
    </ContentLayout>
  );
};

export default UserList;