import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
}

const stored = typeof window !== 'undefined' ? window.localStorage.getItem('auth') : null;

const initialState: AuthState = stored
  ? JSON.parse(stored)
  : {
      accessToken: null,
      refreshToken: null,
      username: null,
    };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ access: string; refresh: string; username?: string }>
    ) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.username = action.payload.username ?? null;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'auth',
          JSON.stringify({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            username: state.username,
          })
        );
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.username = null;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

