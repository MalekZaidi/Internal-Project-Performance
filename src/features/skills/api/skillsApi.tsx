import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Skill } from '../types/skillTypes';

export const skillsApi = createApi({
  reducerPath: 'skillsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BACK_API_URL_SKILLS,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Skill'],
  endpoints: (builder) => ({
    // Get all skills
    getSkills: builder.query<Skill[], void>({
      query: () => '/',
      providesTags: ['Skill']
    }),

    // Search ESCO skills
    searchSkills: builder.query<Skill[], string>({
      query: (query) => `/search?q=${query}`,
    }),

    // Create custom skill
    createCustomSkill: builder.mutation<Skill, { name: string; category?: string }>({
      query: (body) => ({
        url: '/custom',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Skill']
    }),

    // Get skill by ID
    getSkillById: builder.query<Skill, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Skill', id }]
    })
  }),
});

export const { 
  useGetSkillsQuery,
  useSearchSkillsQuery,
  useCreateCustomSkillMutation,
  useGetSkillByIdQuery
} = skillsApi;