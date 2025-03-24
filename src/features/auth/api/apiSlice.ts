import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../stores/store';
import { logout } from './authService';

// Define the base query with headers
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACK_API_URL_AUTH as string,  // Correct environment variable reference
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Correctly type `baseQueryWithLogout`
const baseQueryWithLogout: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log('Token expired, logging out...');
    api.dispatch(logout());
  }

  return result;
};

// Create the API slice
export const apiSlice = createApi({
  baseQuery: baseQueryWithLogout,
  endpoints: (builder) => ({}),
});
