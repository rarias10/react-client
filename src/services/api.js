import axios from 'axios'
const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const paths = {
  csrf: import.meta.env.VITE_CSRF_PATH || '/api/csrf',
  register: import.meta.env.VITE_REGISTER_PATH || '/api/register',
  login: import.meta.env.VITE_LOGIN_PATH || '/api/login'
}
const api = axios.create({ baseURL: base, withCredentials: true })
export const setCsrfHeader = (token) => { if (token) api.defaults.headers.common['X-CSRF-Token'] = token }
export default api
