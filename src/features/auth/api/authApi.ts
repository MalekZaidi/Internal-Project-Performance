// src/features/auth/api/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACK_API_URL_AUTH,
    prepareHeaders: (headers) => {
      const token = Cookies.get('jwt');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({
        url: '/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = authApi;