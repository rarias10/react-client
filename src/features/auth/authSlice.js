import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api, { setCsrfHeader } from '../../services/api'
import { paths } from '../../services/api'

export const fetchCsrf = createAsyncThunk('auth/fetchCsrf', async () => {
  const { data } = await api.get(paths.csrf)
  setCsrfHeader(data.csrfToken)
  return data.csrfToken
})

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try { await fetchCsrf()(null, { dispatch: () => {}, getState: () => {} }) } catch {}
  try {
    const { data } = await api.post(paths.register, payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data || { error: 'Registration failed' })
  }
})

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try { await fetchCsrf()(null, { dispatch: () => {}, getState: () => {} }) } catch {}
  try {
    const { data } = await api.post(paths.login, payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data || { error: 'Login failed' })
  }
})

const initialState = { isAuthenticated: false, user: null, status: 'idle', error: null, csrfToken: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { logoutLocal(state){ state.isAuthenticated=false; state.user=null } },
  extraReducers: (b) => {
    b.addCase(fetchCsrf.fulfilled,(s,a)=>{ s.csrfToken=a.payload })
     .addCase(registerUser.pending,(s)=>{ s.status='loading'; s.error=null })
     .addCase(registerUser.fulfilled,(s)=>{ s.status='succeeded' })
     .addCase(registerUser.rejected,(s,a)=>{ s.status='failed'; s.error=a.payload })
     .addCase(loginUser.pending,(s)=>{ s.status='loading'; s.error=null })
     .addCase(loginUser.fulfilled,(s,a)=>{ s.status='succeeded'; s.isAuthenticated=true; s.user=a.payload?.user??null })
     .addCase(loginUser.rejected,(s,a)=>{ s.status='failed'; s.error=a.payload })
  }
})
export const { logoutLocal } = authSlice.actions
export default authSlice.reducer
