import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../features/project-management/stores/projectStore';

const store = configureStore({
  reducer: {
    projects: projectReducer,
  },
});

export default store;
