import axios from 'axios';

// use '/api' by default when behind nginx
const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export const paths = {
  csrf: import.meta.env.VITE_CSRF_PATH || '/csrf',
  register: import.meta.env.VITE_REGISTER_PATH || '/register',
  login: import.meta.env.VITE_LOGIN_PATH || '/login',
};

const api = axios.create({
  baseURL: base,
  withCredentials: true,
});

export const setCsrfHeader = (token) => {
  if (token) {
    api.defaults.headers.common['X-CSRF-Token'] = token;
  }
};

export default api;
