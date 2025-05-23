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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProject, fetchProjects, selectProjects } from '../../features/project-management/stores/projectStore';
import { AppDispatch, RootState } from '../../stores/store';
import CustomButton from '../../components/ui/CustomButton';
import { ContentLayout } from '../../components/layouts/dashboard/ContentLayout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DeleteIcon from '@mui/icons-material/Delete';
type Project = {
  _id: string;
  projectName: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  initialBudget: number;
  description?: string;
};

type Order = 'asc' | 'desc';

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const projects = useSelector(selectProjects);
  const { loading, error } = useSelector((state: RootState) => state.projects);
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Project>('startDate');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleSort = (property: keyof Project) => {
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

  const filteredProjects = projects
    .filter((p) => (statusFilter ? p.status === statusFilter : true))
    .filter((p) => (priorityFilter ? p.priority === priorityFilter : true))
    .sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * (order === 'asc' ? 1 : -1);
      }

      return String(aVal).localeCompare(String(bVal)) * (order === 'asc' ? 1 : -1);
    });

  const paginatedProjects = filteredProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueStatuses = [...new Set(projects.map((p) => p.status))];
  const uniquePriorities = [...new Set(projects.map((p) => p.priority))];

  const handleAddProject = () => navigate('/projects/add');

  const handleDeleteProject = (id: string) => {
    // Optional: Confirm deletion with the user.
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id));
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'InProgress': return 'warning';
      case 'Onhold': return 'error';
      default: return 'primary';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      default: return 'success';
    }
  };

  const formatDate = (dateString: string) => {
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
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Project Management
        </Typography>
        {isAdmin && (
          <CustomButton 
            onClick={handleAddProject}
            variant="contained"
          >
            Add New Project
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
            Filter Projects
          </Typography>
        </Stack>
        
        <Divider sx={{ mb: 2 }} />
        
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              {uniqueStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              label="Priority"
            >
              <MenuItem value="">All Priorities</MenuItem>
              {uniquePriorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
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
            Error loading projects: {error}
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
                  <TableCell sortDirection={orderBy === 'projectName' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'projectName'}
                      direction={orderBy === 'projectName' ? order : 'asc'}
                      onClick={() => handleSort('projectName')}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>Project</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>Goal</Typography>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'startDate' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'startDate'}
                      direction={orderBy === 'startDate' ? order : 'asc'}
                      onClick={() => handleSort('startDate')}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>Start Date</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'endDate' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'endDate'}
                      direction={orderBy === 'endDate' ? order : 'asc'}
                      onClick={() => handleSort('endDate')}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>End Date</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>Priority</Typography>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'initialBudget' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'initialBudget'}
                      direction={orderBy === 'initialBudget' ? order : 'asc'}
                      onClick={() => handleSort('initialBudget')}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>Budget</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" width={100}>
                    <Typography variant="subtitle2" fontWeight={600}>Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProjects.length > 0 ? (
                  paginatedProjects.map((project) => (
                    <React.Fragment key={project._id}>
                      <TableRow hover sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleExpandRow(project._id!)}
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {expandedRows[project._id!] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>{project.projectName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                            {project.goal}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(project.startDate)}</TableCell>
                        <TableCell>{formatDate(project.endDate)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={project.status} 
                            size="small"
                            color={statusColor(project.status)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={project.priority} 
                            size="small"
                            color={priorityColor(project.priority)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>
                            ${project.initialBudget.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details" arrow>
                            <IconButton 
                              onClick={() => navigate(`/projects/${project._id}`)}
                              size="small"

                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Project" arrow>
                  <IconButton
                    onClick={() => handleDeleteProject(project._id!)}
                    size="small"
                    sx={{ marginLeft: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={9} sx={{ py: 0, backgroundColor: theme.palette.grey[50] }}>
                          <Collapse in={expandedRows[project._id!]} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 3 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Description:</strong> {project.description || 'No description provided.'}
                              </Typography>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No projects found matching your filters
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
            count={filteredProjects.length}
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

export default Projects;