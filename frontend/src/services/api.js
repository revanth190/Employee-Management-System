import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('emsa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('emsa_token');
      localStorage.removeItem('emsa_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// Accounts
export const accountApi = {
  getAll: () => api.get('/accounts'),
  getById: (id) => api.get(`/accounts/${id}`),
  getMe: () => api.get('/accounts/me'),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  updateMe: (data) => api.put('/accounts/me', data),
  deactivate: (id) => api.patch(`/accounts/${id}/deactivate`),
  activate: (id) => api.patch(`/accounts/${id}/activate`),
  delete: (id) => api.delete(`/accounts/${id}`),
  resetPassword: (id, data) => api.patch(`/accounts/${id}/reset-password`, data),
  changePassword: (data) => api.patch('/accounts/me/change-password', data),
  getByRole: (role) => api.get(`/accounts/role/${role}`),
  getTeam: () => api.get('/accounts/team'),
};

// Departments
export const departmentApi = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// KPIs
export const kpiApi = {
  create: (data) => api.post('/kpis', data),
  getMe: () => api.get('/kpis/me'),
  getByEmployee: (id) => api.get(`/kpis/employee/${id}`),
  getById: (id) => api.get(`/kpis/${id}`),
  update: (id, data) => api.put(`/kpis/${id}`, data),
  delete: (id) => api.delete(`/kpis/${id}`),
};

// Projects
export const projectApi = {
  getAll: () => api.get('/projects'),
  getMine: () => api.get('/projects/mine'),
  getAssigned: () => api.get('/projects/assigned'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Tasks
export const taskApi = {
  getAll: () => api.get('/tasks'),
  getMe: () => api.get('/tasks/me'),
  getByProject: (id) => api.get(`/tasks/project/${id}`),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Leave Requests
export const leaveApi = {
  submit: (data) => api.post('/leave-requests', data),
  getMe: () => api.get('/leave-requests/me'),
  getAll: () => api.get('/leave-requests'),
  getTeam: () => api.get('/leave-requests/team'),
  getById: (id) => api.get(`/leave-requests/${id}`),
  review: (id, data) => api.patch(`/leave-requests/${id}/review`, data),
};

// Performance Reviews
export const reviewApi = {
  create: (data) => api.post('/performance-reviews', data),
  getAll: () => api.get('/performance-reviews'),
  getMe: () => api.get('/performance-reviews/me'),
  getByEmployee: (id) => api.get(`/performance-reviews/employee/${id}`),
  getById: (id) => api.get(`/performance-reviews/${id}`),
  update: (id, data) => api.put(`/performance-reviews/${id}`, data),
  selfAppraisal: (id, data) => api.patch(`/performance-reviews/${id}/self-appraisal`, data),
};

// Audit Logs
export const auditApi = {
  getAll: () => api.get('/audit-logs'),
  getByAccount: (id) => api.get(`/audit-logs/account/${id}`),
};

export default api;
