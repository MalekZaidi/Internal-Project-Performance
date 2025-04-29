import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/api/authSlice";
import projectReducer from '../features/project-management/stores/projectStore';
import usersReducer from '../features/users/api/usersSlice'
import { skillsApi } from "../features/skills/api/skillsApi";
import { usersApi } from "../features/users/api/usersApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    users: usersReducer,
    // Add the skills API reducer
    [skillsApi.reducerPath]: skillsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,

  },
  // Add the skills API middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(skillsApi.middleware)
      .concat(usersApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
