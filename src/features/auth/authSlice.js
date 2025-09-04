// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setCsrfHeader, paths } from '../../services/api';

// Get CSRF token and set default header on axios instance
export const fetchCsrf = createAsyncThunk(
  'auth/fetchCsrf',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(paths.csrf);
      const token = data?.csrfToken;
      if (token && typeof token === 'string' && token.length > 10) {
        setCsrfHeader(token);
        return token;
      }
      return rejectWithValue({ error: 'invalid_csrf_token' });
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
    } catch (csrfError) {
      console.warn('CSRF token fetch failed:', csrfError);
      // Continue anyway - server will reject if CSRF is required
    }
    try {
      const { data } = await api.post(paths.register, payload);
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
    } catch (csrfError) {
      console.warn('CSRF token fetch failed:', csrfError);
    }
    try {
      const { data } = await api.post(paths.login, payload);
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
