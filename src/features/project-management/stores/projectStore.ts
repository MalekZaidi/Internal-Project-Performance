import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { RootState } from '../../../stores/store';
import { Skill } from '../../skills/types/skillTypes';

export interface User {
  _id: string;
  fullName: string;
  login: string;
  role: string;
}

export interface Project {
  _id?: string;
  projectName: string;
  description: string;
  goal: string;
  priority: string;
  startDate: string;
  endDate: string;
  initialBudget: number;
  status: string;
  skillIds?: string[];
  escoUris?: string[];
  skills?: Skill[];            // For populated skills
  assignedProjectManager?: User | string; // Can be either user object or ID
  assignedTeamMembers?: User[] | string[]; // Can be either array of user objects or IDs
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState & { selectedProjectId: string | null } = {
  projects: [],
  loading: false,
  error: null,
  selectedProjectId: null,
};


// 🔁 Fetch All Projects
export const fetchProjects = createAsyncThunk<Project[]>(
  'projects/fetchProjects',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user; 
      
      let url = `${import.meta.env.VITE_BACK_API_URL_PROJECTS}`;
      
      if (user?.role === 'project_manager') {
        url += `?managerId=${user._id}`;
      } else if (user?.role === 'team_member') {
        url += `?memberId=${user._id}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch projects');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// ➕ Create Project
export const addProject = createAsyncThunk<Project, Omit<Project, '_id'>>(
  'projects/addProject',
  async (projectData, { rejectWithValue }) => {
    try {
      // Prepare the data for the API
      const payload = {
        ...projectData,
        // Ensure team members are sent as IDs if they're objects
        assignedTeamMembers: Array.isArray(projectData.assignedTeamMembers) 
          ? projectData.assignedTeamMembers.map(member => 
              typeof member === 'string' ? member : member._id
            )
          : [],
        // Ensure project manager is sent as ID if it's an object
        assignedProjectManager: typeof projectData.assignedProjectManager === 'string'
          ? projectData.assignedProjectManager
          : projectData.assignedProjectManager?._id || ''
      };

      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL_PROJECTS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwt')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(errorRes.message || 'Failed to create project');
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// In projectStore.ts
export const addTeamMembers = createAsyncThunk<
  Project,
  { projectId: string; members: string[] }
>(
  'projects/addTeamMembers',
  async ({ projectId, members }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user;
      
      // Remove duplicates before sending
      const uniqueMembers = [...new Set(members)];
      
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL_PROJECTS}/${projectId}/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwt')}`,
        },
        body: JSON.stringify({ members: uniqueMembers }),
      });

      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(errorRes.message || 'Failed to add team members');
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);




export const deleteProject = createAsyncThunk<string, string>(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL_PROJECTS}/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      // Return the deleted user's id as a confirmation to update the state
      return projectId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const projectSlice = createSlice({
  name: 'projects',
initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload);
      })
      .addCase(addTeamMembers.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      }).addCase(deleteProject.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
              state.loading = false;
              state.projects = state.projects.filter((project) => project._id !== action.payload);
            })
            .addCase(deleteProject.rejected, (state, action: PayloadAction<any>) => {
              state.loading = false;
              state.error = action.payload;
            });
        },
      });
export const { setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
export const selectProjects = (state: RootState) => state.projects.projects;