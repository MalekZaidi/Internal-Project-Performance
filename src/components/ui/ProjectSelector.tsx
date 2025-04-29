// src/ui/ProjectSelector.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../stores/store";
import { setSelectedProject } from "../../features/project-management/stores/projectStore";
import {
  Box,
  TextField,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

type Project = { _id: string; projectName: string };

const ProjectSelector: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const projects = useSelector((state: RootState) => state.projects.projects);

  const selectedProjectId = useSelector<RootState, string | null>(
    (state) => state.projects.selectedProjectId
  );

  // Find the full Project object for the Autocomplete value:
  const selectedProject = projects.find(p => p._id === selectedProjectId) ?? null;

  const handleChange = (_: any, project: Project | null) => {
    dispatch(setSelectedProject(project?._id ?? ""));
  };
  const handleProjectChange = (event: SelectChangeEvent) => {
    const projectId = event.target.value;
    dispatch(setSelectedProject(projectId));
  };
  // Hide entirely if no rights
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user || (user.role !== "project_manager" && user.role !== "team_member")) {
    return null;
  }

  return (
    <Box
      sx={{
        flexShrink: 0,
        // responsive width: small on xs, growing on sm/md
        width: {
          xs: 120,
          sm: 160,
          md: 220,
        },
        mx: { xs: 1, sm: 2 }, // some horizontal margin
      }}
    >
      <Autocomplete
        size="small"
        options={projects}
        getOptionLabel={(opt) => opt.projectName}
        value={selectedProject }
        onChange={handleChange}
        disableClearable
        popupIcon={null} // optional: you can re-add a white icon if you like
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Project"
            InputLabelProps={{ shrink: true }}
            sx={{
              // White text + white border
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: theme.palette.grey[300] },
                "&.Mui-focused fieldset": { borderColor: theme.palette.grey[400] },
              },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiSvgIcon-root": { color: "white" },
              "& .MuiAutocomplete-option": {
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default ProjectSelector;
