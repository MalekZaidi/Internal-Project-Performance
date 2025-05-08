// src/features/task-management/api/taskApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/taskTypes';
import { RootState } from '../../../stores/store';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACK_API_URL_TASKS || '/api/tasks',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], string | null>({
      query: (projectId) => ({
        url: `/getall/${projectId}`,
        params: { projectId }
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Task' as const, _id })), 'Task']
          : ['Task'],
    }),
    createTask: builder.mutation<Task, CreateTaskPayload>({
      query: (newTask) => ({
        url: '/',
        method: 'POST',
        body: newTask
      }),
      invalidatesTags: ['Task']
    }),
    updateTask: builder.mutation<Task, { id: string; data: UpdateTaskPayload }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }]
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Task', id }]
    })
  })
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = taskApi;