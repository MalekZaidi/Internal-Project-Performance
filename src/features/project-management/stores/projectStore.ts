// src/features/project-management/stores/projectStore.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  projectName: string;
  projectDescription: string;
  projectDeadline: string;
}

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
  },
});

export const { createProject } = projectSlice.actions;
export default projectSlice.reducer;
