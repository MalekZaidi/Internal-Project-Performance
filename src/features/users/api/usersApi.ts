import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../api/usersSlice';
import Cookies from "js-cookie";

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BACK_API_URL_USERS,
    prepareHeaders: (headers) => {
      const token = Cookies.get("jwt");
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/',
      providesTags: ['User']
    }),
    getUser: builder.query<User, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }]
    }),
    assignSkill: builder.mutation<User, { userId: string; escoUri: string }>({
      query: ({ userId, escoUri }) => ({
        url: `/${userId}/skills/assign-from-search`,
        method: 'POST',
        body: { escoUri }
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }]
    }), removeSkill: builder.mutation<User, { userId: string; skillId: string }>({
        query: ({ userId, skillId }) => ({
          url: `/${userId}/skills/${skillId}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }]
      }), 
      updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
        query: ({ id, data }) => ({
          url: `/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['User'],
      }),
      confirmCvData: builder.mutation<User, { 
        userId: string; 
        data: { 
          skillIds: string[];
          educations: any[];
          certifications: any[];
        }
      }>({
        query: ({ userId, data }) => ({
          url: `/${userId}/confirm-cv-data2`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }]
      })
    }),

});

export const { useConfirmCvDataMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useAssignSkillMutation,  useRemoveSkillMutation,useUpdateUserMutation
} = usersApi;