// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setCsrfHeader, paths } from '../../services/api';

// Get CSRF token and set default header on axios instance
export const fetchCsrf = createAsyncThunk(
  'auth/fetchCsrf',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(paths.csrf); // GET /api/csrf (withCredentials=true via api instance)
      const token = data?.csrfToken;
      if (token) setCsrfHeader(token);             // sets default 'X-CSRF-Token' header
      return token;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { error: 'csrf_failed' });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, thunkAPI) => {
    try {
      // Properly dispatch the CSRF fetch through Redux
      await thunkAPI.dispatch(fetchCsrf()).unwrap();
    } catch {
      // If fetching the token fails, we can still try; server will 403 if truly missing
    }
    try {
      const { data } = await api.post(paths.register, payload, { withCredentials: true });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || { error: 'Registration failed' });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      await thunkAPI.dispatch(fetchCsrf()).unwrap();
    } catch {}
    try {
      const { data } = await api.post(paths.login, payload, { withCredentials: true });
      return data; // { ok: true, user: {...} }
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || { error: 'Login failed' });
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  status: 'idle',
  error: null,
  csrfToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutLocal(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (b) => {
    b
      // CSRF
      .addCase(fetchCsrf.fulfilled, (s, a) => {
        s.csrfToken = a.payload || null;
      })

      // Register
      .addCase(registerUser.pending,   (s)    => { s.status = 'loading'; s.error = null; })
      .addCase(registerUser.fulfilled, (s)    => { s.status = 'succeeded'; s.error = null; })
      .addCase(registerUser.rejected,  (s, a) => { s.status = 'failed'; s.error = a.payload; })

      // Login
      .addCase(loginUser.pending,   (s)    => { s.status = 'loading'; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.status = 'succeeded'; s.isAuthenticated = true; s.user = a.payload?.user ?? null; s.error = null; })
      .addCase(loginUser.rejected,  (s, a) => { s.status = 'failed'; s.error = a.payload; });
  },
});

export const { logoutLocal } = authSlice.actions;
export default authSlice.reducer;
