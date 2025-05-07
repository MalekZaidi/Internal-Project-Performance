"use client"

import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../stores/store"
import { useDispatch } from "react-redux"
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Grid,
  Paper,
  Tooltip,
  Fab,
  Zoom,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  Person,
  Description as DescriptionIcon,
  ErrorOutline,
  Assignment,
  CheckCircleOutline,
  RadioButtonUnchecked,
  HourglassEmpty,
  Block,
  Close,
  ArrowBack,
  ArrowForward,
  Save,
  FlagOutlined,
  Search,
  FilterList,
  TableRows,
} from "@mui/icons-material"
import type { Task } from "../../features/task-management/types/taskTypes"
import {
  useCreateTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../../features/task-management/api/taskApi"
import type { User } from "../../features/project-management/stores/projectStore"
import { useGetUsersQuery } from "../../features/users/api/usersApi"
import { format, parseISO, isValid, addDays } from "date-fns"
import CustomButton from '../../components/ui/CustomButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { ToggleButton, ToggleButtonGroup, ViewColumn, TableRows } from "@mui/icons-material";
import { ViewColumn, ViewList } from "@mui/icons-material";


// Define task status options
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", icon: <RadioButtonUnchecked fontSize="small" /> },
  { value: "in-progress", label: "In Progress", icon: <HourglassEmpty fontSize="small" /> },
  { value: "completed", label: "Completed", icon: <CheckCircleOutline fontSize="small" /> },
  { value: "blocked", label: "Blocked", icon: <Block fontSize="small" /> },
]

// Define priority options
const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "#4caf50" },
  { value: "medium", label: "Medium", color: "#ff9800" },
  { value: "high", label: "High", color: "#f44336" },
]

const TaskPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useDispatch<AppDispatch>()
  const selectedProjectId = useSelector((state: RootState) => state.projects.selectedProjectId)
  const { data: tasks = [], isLoading, isError, refetch } = useGetTasksQuery(
    selectedProjectId || null,
    { skip: !selectedProjectId } // Skip query if no project selected
  );  
   const { data: users = [] } = useGetUsersQuery()
  const [createTask] = useCreateTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const [openModal, setOpenModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({
    taskName: "",
    description: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    assignedTo: "",
    status: "pending",
    priority: "medium",
  }) 
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  useEffect(() => {
    // Reset tasks when project changes
    setLocalTasks(selectedProjectId ? tasks : []);
  }, [tasks, selectedProjectId])
  const currentUser = useSelector((state: RootState) => state.auth.user);
 
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
  
    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;
    const taskId = result.draggableId;
    const oldIndex = result.source.index;
    const newIndex = result.destination.index;
  
    // Find the moved task
    const movedTask = localTasks.find(t => t._id === taskId);
    if (!movedTask) return;
  
    // Create new tasks array
    const newTasks = [...localTasks];
    
    // Remove from old position
    const sourceTasks = newTasks.filter(t => t.status === sourceStatus);
    const movedTaskIndex = sourceTasks.findIndex(t => t._id === taskId);
    if (movedTaskIndex > -1) {
      newTasks.splice(newTasks.indexOf(sourceTasks[movedTaskIndex]), 1);
    }
  
    // Update task status and order
    const updatedTask = { 
      ...movedTask, 
      status: destStatus,
      order: newIndex 
    };
  
    // Add to new position
    const destTasks = newTasks.filter(t => t.status === destStatus);
    const insertIndex = destTasks.reduce((acc, task, index) => 
      task.order <= newIndex ? index + 1 : acc, 0
    );
    
    newTasks.splice(insertIndex, 0, updatedTask);
  
    // Update orders for all tasks in destination column
    newTasks
      .filter(t => t.status === destStatus)
      .forEach((task, index) => {
        task.order = index;
      });
  
    try {
      // Optimistic update
      setLocalTasks(newTasks);
  
      // Update backend
      await updateTask({
        id: taskId,
        data: {
          status: destStatus,
          order: newIndex
        }
      }).unwrap()
  
      // Update orders for other tasks in destination column
      await Promise.all(
        newTasks
          .filter(t => t.status === destStatus && t._id !== taskId)
          .map(task => updateTask({
            id: task._id,
            data: { order: task.order }
          }))
      );
  
      refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
      setLocalTasks(tasks); // Revert on error
    }
  };
  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    next: "board" | "list"
  ) => {
    if (next) setViewMode(next);
  };

  // Group tasks by status for the board view
// In groupTasksByStatus
const groupTasksByStatus = (tasks: Task[]) => {
  return tasks.reduce((acc, task) => {
    // Normalize status to lowercase
    const status = (task.status || 'pending').toLowerCase();
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    acc[status].sort((a, b) => a.order - b.order);
    return acc;
  }, {} as Record<string, Task[]>);
};

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!currentTask.taskName) newErrors.taskName = "Task name is required"
      if (!currentTask.description) newErrors.description = "Description is required"
    } else if (step === 1) {
      if (!currentTask.startDate) newErrors.startDate = "Start date is required"
      if (!currentTask.endDate) newErrors.endDate = "End date is required"

      if (currentTask.startDate && currentTask.endDate) {
        const start = new Date(currentTask.startDate)
        const end = new Date(currentTask.endDate)
        if (end < start) {
          newErrors.endDate = "End date must be after start date"
        }
      }
    } else if (step === 2) {
      if (!currentTask.assignedTo) newErrors.assignedTo = "Assignee is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!currentTask.taskName) newErrors.taskName = "Task name is required"
    if (!currentTask.description) newErrors.description = "Description is required"
    if (!currentTask.startDate) newErrors.startDate = "Start date is required"
    if (!currentTask.endDate) newErrors.endDate = "End date is required"
    if (!currentTask.assignedTo) newErrors.assignedTo = "Assignee is required"

    if (currentTask.startDate && currentTask.endDate) {
      const start = new Date(currentTask.startDate)
      const end = new Date(currentTask.endDate)
      if (end < start) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const taskData = {
        ...currentTask,
        project: selectedProjectId,
      }

      if (editMode && currentTask._id) {
        await updateTask({ id: currentTask._id, ...taskData }).unwrap()
        setSnackbarMessage("Task updated successfully!")
      } else {
        await createTask(taskData).unwrap()
        setSnackbarMessage("Task created successfully!")
      }

      setSnackbarOpen(true)
      handleCloseModal()
      refetch()
    } catch (error) {
      console.error("Failed to save task:", error)
      setSnackbarMessage("Failed to save task. Please try again.")
      setSnackbarOpen(true)
    }
  }

  const handleEdit = (task: Task) => {
    setCurrentTask({
      ...task,   
      startDate: safeFormatDate(new Date(task.startDate), "yyyy-MM-dd"),
      endDate: safeFormatDate(new Date(task.endDate), "yyyy-MM-dd"),
      status: task.status || "pending",
      priority: task.priority || "medium",
    })
    setEditMode(true)
    setActiveStep(0)
    setOpenModal(true)
  }

  const handleDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId).unwrap()
        setSnackbarMessage("Task deleted successfully!")
        setSnackbarOpen(true)
        refetch()
      } catch (error) {
        console.error("Failed to delete task:", error)
        setSnackbarMessage("Failed to delete task. Please try again.")
        setSnackbarOpen(true)
      }
    }
  }

  const safeFormatDate = (dateString: string | undefined, dateFormat: string) => {
    if (!dateString) return "N/A"
    try {
      const date = parseISO(dateString)
      return isValid(date) ? format(date, dateFormat) : "Invalid Date"
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditMode(false)
    setActiveStep(0)
    setCurrentTask({
      taskName: "",
      description: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      assignedTo: "",
      status: "pending",
      priority: "medium",
    })
    setErrors({})
  }

  // Get status chip color and icon
  const getStatusChip = (status?: string) => {
    switch (status) {
      case "pending":
        return <Chip icon={<RadioButtonUnchecked fontSize="small" />} label="pending" variant="outlined" size="small" />
      case "in-progress":
        return (
          <Chip
            icon={<HourglassEmpty fontSize="small" />}
            label="In Progress"
            color="primary"
            variant="outlined"
            size="small"
          />
        )
      case "completed":
        return <Chip icon={<CheckCircleOutline fontSize="small" />} label="Completed" color="success" size="small" />
      case "blocked":
        return <Chip icon={<Block fontSize="small" />} label="Blocked" color="error" size="small" />
      default:
        return <Chip icon={<RadioButtonUnchecked fontSize="small" />} label="pending" variant="outlined" size="small" />
    }
  }

  // Get priority indicator
  const getPriorityIndicator = (priority?: string) => {
    const priorityOption = PRIORITY_OPTIONS.find((option) => option.value === priority) || PRIORITY_OPTIONS[1]

    return (
      <Tooltip title={`Priority: ${priorityOption.label}`}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FlagOutlined sx={{ color: priorityOption.color, fontSize: "1rem" }} />
          <Typography variant="body2" sx={{ color: priorityOption.color }}>
            {priorityOption.label}
          </Typography>
        </Box>
      </Tooltip>
    )
  }
  const sourceTasks = viewMode === 'board' ? localTasks : tasks

  // Filter and search tasks
  const filteredTasks = sourceTasks.filter((task) => {
    // Apply status filter if selected
    if (filterStatus && task.status !== filterStatus) {
      return false
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = task.taskName.toLowerCase().includes(query)
      const matchesDescription = task.description.toLowerCase().includes(query)
      const assigneeName =
        typeof task.assignedTo === "string" ? task.assignedTo : (task.assignedTo as User)?.fullName || ""
      const matchesAssignee = assigneeName.toLowerCase().includes(query)

      return matchesName || matchesDescription || matchesAssignee
    }

    return true
  })
// 1️⃣ Build empty buckets
// 1️⃣ Build empty buckets for every status
// 1️⃣ Create an empty bucket for each status.value
const emptyBuckets: Record<string, Task[]> = {};
for (const { value } of STATUS_OPTIONS) {
  emptyBuckets[value] = [];
}

// 2️⃣ Fill them with your filtered tasks
const groupedTasks = { ...emptyBuckets };
for (const task of filteredTasks) {
  // assume task.status is exactly one of STATUS_OPTIONS.value
  const status = task.status || "pending";
  groupedTasks[status].push(task);
}

// 3️⃣ Sort each bucket by order
for (const key of Object.keys(groupedTasks)) {
  groupedTasks[key].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}



// 2️⃣ Merge with whatever groupTasksByStatus() gives you


  // Get user avatar
  const getUserAvatar = (userId: string) => {
    const user = users.find((u) => u._id === userId)
    if (!user) return null

    const initials = user.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    return (
      <Tooltip title={user.fullName}>
        <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem", bgcolor: stringToColor(user.fullName) }}>
          {initials}
        </Avatar>
      </Tooltip>
    )
  }

  // Generate color from string
  const stringToColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = "#"
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += ("00" + value.toString(16)).substr(-2)
    }

    return color
  }

  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <TextField
              label="Task Name"
              value={currentTask.taskName || ""}
              onChange={(e) => setCurrentTask({ ...currentTask, taskName: e.target.value })}
              error={!!errors.taskName}
              helperText={errors.taskName}
              fullWidth
              InputProps={{
                startAdornment: <Assignment fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              placeholder="Enter a descriptive task name"
            />

            <TextField
              label="Description"
              value={currentTask.description || ""}
              onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              fullWidth
              InputProps={{
                startAdornment: <DescriptionIcon fontSize="small" sx={{ mr: 1, mt: 1, color: "text.secondary" }} />,
              }}
              placeholder="Describe the task in detail"
            />

            <TextField
              select
              label="Priority"
              value={currentTask.priority || "medium"}
              onChange={(e) => setCurrentTask({ ...currentTask, priority: e.target.value })}
              fullWidth
              InputProps={{
                startAdornment: <FlagOutlined fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FlagOutlined sx={{ mr: 1, color: option.color }} />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )
      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={currentTask.startDate || ""}
                  onChange={(e) => setCurrentTask({ ...currentTask, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  fullWidth
                  InputProps={{
                    startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={currentTask.endDate || ""}
                  onChange={(e) => setCurrentTask({ ...currentTask, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  fullWidth
                  InputProps={{
                    startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              select
              label="Status"
              value={currentTask.status || "pending"}
              onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
              fullWidth
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {React.cloneElement(option.icon, { sx: { mr: 1 } })}
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )
      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          
          {currentUser?.role === 'team_member' ? (
        <TextField
          label="Assigned To"
          value={currentUser.fullName}
          disabled
          fullWidth
          InputProps={{
            startAdornment: <Person fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
      ) : (
        <TextField
          select
          label="Assign To"
          value={currentTask.assignedTo || ""}
          onChange={(e) => setCurrentTask({ ...currentTask, assignedTo: e.target.value })}
          error={!!errors.assignedTo}
          helperText={errors.assignedTo}
          fullWidth
          InputProps={{
            startAdornment: <Person fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        >
          {users.filter(user => user.role !== 'project_manager').map((user) => (
            <MenuItem key={user._id} value={user._id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getUserAvatar(user._id)}
                {user.fullName}
              </Box>
            </MenuItem>
          ))}
        </TextField>
      )}

            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Task Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Name:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">{currentTask.taskName}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Priority:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  {getPriorityIndicator(currentTask.priority)}
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  {getStatusChip(currentTask.status)}
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Timeline:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {safeFormatDate(currentTask.startDate, "MMM d, yyyy")} -{" "}
                    {safeFormatDate(currentTask.endDate, "MMM d, yyyy")}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Assignee:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {currentTask.assignedTo && getUserAvatar(currentTask.assignedTo as string)}
                    <Typography variant="body2">
                      {currentTask.assignedTo
                        ? users.find((u) => u._id === currentTask.assignedTo)?.fullName || "Unknown"
                        : "Not assigned"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ p: 3, width:'100%' }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Create, manage, and track tasks for your projects 
          </Typography>
        </Box>

      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
<ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, newMode) => newMode && setViewMode(newMode)}
        aria-label="view mode"
      >
        <ToggleButton value="board" aria-label="board view">
          <ViewColumn sx={{ mr: 1 }} />
          Board
        </ToggleButton>
        <ToggleButton value="list" aria-label="list view">
          <TableRows sx={{ mr: 1 }} />
          List
        </ToggleButton>
      </ToggleButtonGroup>
      </Box> 
      {!selectedProjectId && (
  <Alert severity="info" sx={{ mb: 3 }} icon={<ErrorOutline />}>
    Please select a project to view and manage tasks
  </Alert>
)}
    { viewMode === 'board' && (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
{viewMode === 'board' && (
  <Box sx={{ p: 2 }}>
    <Typography variant="caption">
      Debug: {localTasks.length} tasks loaded
    </Typography>
    <pre>{JSON.stringify(groupedTasks, null, 2)}</pre>
  </Box>
)}
            {STATUS_OPTIONS.map(({ value, label, icon }) => (
            
             <Grid item xs={12} md={3} key={value}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            {icon}
            <Typography variant="subtitle1">{label}</Typography>
            <Chip label={groupedTasks[value].length} size="small" />
          </Box>
                
                <Droppable            droppableId={value}            // must exactly match the key
            isDropDisabled={false}         // explicit boolean
            isCombineEnabled={false}  ignoreContainerClipping ={false}     // explicit boolean
          >

                  {(provided) => (
                   <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ minHeight: 200, p:1, bgcolor:'grey.100' }}
              >
                      {groupedTasks[value]?.map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(prov, snap) => (
                      <Paper
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        elevation={snap.isDragging ? 8 : 1}
                        sx={{
                          mb: 1,
                          p: 2,
                          ...prov.draggableProps.style,
                        }}
                      >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2">{task.taskName}</Typography>
                                {getPriorityIndicator(task.priority)}
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {task.description}
                              </Typography>
                              
                              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {typeof task.assignedTo === 'string' 
                                    ? getUserAvatar(task.assignedTo)
                                    : getUserAvatar((task.assignedTo as User)?._id || '')}
                                  <Typography variant="caption">
                                    {safeFormatDate(task.startDate, 'MMM dd')} - {safeFormatDate(task.endDate, 'MMM dd')}
                                  </Typography>
                                </Box>
                                <IconButton size="small" onClick={() => handleEdit(task)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Box>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>  )} 
    

      <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "divider" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              value={filterStatus || ""}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {React.cloneElement(option.icon, { sx: { mr: 1 } })}
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <CustomButton
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
              disabled={!selectedProjectId}
              fullWidth={isMobile}
            >
              New Task
            </CustomButton>
          </Grid>
        </Grid>
      </Paper>  

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load tasks
        </Alert>
      )}
  {viewMode === 'list' && (
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6">Tasks</Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} found
              </Typography>
            </Box>
          }
          sx={{ pb: 1 }}
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredTasks.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                textAlign: "center",
              }}
            >
              <Assignment sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6">No tasks found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedProjectId
                  ? searchQuery || filterStatus
                    ? "Try adjusting your search or filters"
                    : "Create a new task to get started"
                  : "Select a project to view tasks"}
              </Typography>
              {selectedProjectId && !searchQuery && !filterStatus && (
                <CustomButton variant="contained" startIcon={<Add />} onClick={() => setOpenModal(true)} sx={{ mt: 3 }}>
                  New Task
                </CustomButton>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Dates</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task._id} hover>
                      <TableCell sx={{ fontWeight: "medium" }}>{task.taskName}</TableCell>
                      <TableCell
                        sx={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      >
                        {task.description}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                              Start:
                            </Typography>
                            <Typography variant="body2">{safeFormatDate(task.startDate, "MMM d, yyyy")}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                              End:
                            </Typography>
                            <Typography variant="body2">{safeFormatDate(task.endDate, "MMM d, yyyy")}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {typeof task.assignedTo === "string"
                            ? getUserAvatar(task.assignedTo)
                            : getUserAvatar((task.assignedTo as User)?._id || "")}
                          <Typography variant="body2">
                            {typeof task.assignedTo === "string"
                              ? users.find((u) => u._id === task.assignedTo)?.fullName || task.assignedTo
                              : (task.assignedTo as User)?.fullName || "Unknown"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getPriorityIndicator(task.priority)}</TableCell>
                      <TableCell>{getStatusChip(task.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(task)} size="small" sx={{ mr: 1 }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(task._id)} size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>   )}

      {/* Floating Action Button for mobile */}
      {isMobile && selectedProjectId && (
        <Zoom in={true}>
          <Fab color="primary" sx={{ position: "fixed", bottom: 16, right: 16 }} onClick={() => setOpenModal(true)}>
            <Add />
          </Fab>
        </Zoom>
      )}

      {/* Enhanced Task Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#333333',
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{editMode ? "Edit Task" : "Create New Task"}</Typography>
          <IconButton onClick={handleCloseModal} size="small" sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Task Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Timeline & Status</StepLabel>
            </Step>
            <Step>
              <StepLabel>Assignment</StepLabel>
            </Step>
          </Stepper>

          {getStepContent(activeStep)}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, justifyContent: "space-between" }}>
          <CustomButton onClick={handleCloseModal} variant="outlined" startIcon={<Close />}>
            Cancel
          </CustomButton>

          <Box>
            {activeStep > 0 && (
              <CustomButton onClick={handleBack}  startIcon={<ArrowBack />}>
                Back
              </CustomButton>
            )}

            {activeStep < 2 ? (
              <CustomButton onClick={handleNext} variant="contained" endIcon={<ArrowForward />}>
                Next
              </CustomButton>
            ) : (
              <CustomButton onClick={handleSubmit} variant="contained" color="success" startIcon={<Save />}>
                {editMode ? "Update Task" : "Create Task"}
              </CustomButton>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  )
}

export default TaskPage
