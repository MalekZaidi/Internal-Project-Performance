import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { RootState } from '../../../stores/store';
import { Role } from '../types/user-role.enum';
import { Skill } from '../../skills/types/skillTypes';
export interface User {
  _id: string;
  fullName: string;
  login: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
  __v?: number;
  skills: Skill[];
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL_USERS}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();

      return data.map((user: any) => ({
        _id: user._id,
        fullName: user.fullName,
        login: user.login,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        __v: user.__v,
        skills: user.skills || [] 
      }));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteUser = createAsyncThunk<string, string>(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL_USERS}/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      // Return the deleted user's id as a confirmation to update the state
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export const selectUsers = (state: RootState) => state.users.users;