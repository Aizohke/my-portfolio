import axios from 'axios';
import { getToken } from './clerkToken';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 20000,
});

// Attach Clerk token to EVERY request — fetched fresh each time so it never expires
API.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // No token — public request, continue without auth header
  }
  return config;
});

// Handle 401 — only redirect if token is truly missing, not on upload/other failures
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const is401 = error.response?.status === 401;
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const isLoginPage = window.location.pathname === '/admin/login';

    // Only redirect on 401 for admin routes, and only if not already on login
    if (is401 && isAdminRoute && !isLoginPage) {
      // Check if Clerk still has user signed in before redirecting
      const token = await getToken().catch(() => null);
      if (!token) {
        window.location.href = '/admin/login';
      }
      // If Clerk has a token but backend returned 401, it's a backend config issue
      // Don't redirect — just reject so the UI can show an error toast
    }
    return Promise.reject(error);
  }
);

export default API;

// ─── Public API calls ────────────────────────────────────────────────────────
export const publicAPI = {
  getProjects:   () => API.get('/projects'),
  getProject:    (id) => API.get(`/projects/${id}`),
  getBlogPosts:  () => API.get('/blog'),
  getBlogPost:   (id) => API.get(`/blog/${id}`),
  getSkills:     () => API.get('/skills'),
  getExperience: () => API.get('/experience'),
  getSettings:   () => API.get('/settings'),
  sendContact:   (data) => API.post('/contact', data),
};

// ─── Admin API calls ─────────────────────────────────────────────────────────
export const adminAPI = {
  // Auth
  getMe:          () => API.get('/auth/me'),

  // Projects
  getAllProjects:  () => API.get('/projects/all'),
  createProject:  (data) => API.post('/projects', data),
  updateProject:  (id, data) => API.put(`/projects/${id}`, data),
  deleteProject:  (id) => API.delete(`/projects/${id}`),
  toggleProject:  (id) => API.patch(`/projects/${id}/toggle`),

  // Blog
  getAllPosts:     () => API.get('/blog/all'),
  createPost:     (data) => API.post('/blog', data),
  updatePost:     (id, data) => API.put(`/blog/${id}`, data),
  deletePost:     (id) => API.delete(`/blog/${id}`),

  // Skills
  getAllSkills:    () => API.get('/skills/all'),
  createSkill:    (data) => API.post('/skills', data),
  updateSkill:    (id, data) => API.put(`/skills/${id}`, data),
  deleteSkill:    (id) => API.delete(`/skills/${id}`),

  // Experience
  getAllExperience:  () => API.get('/experience/all'),
  createExperience: (data) => API.post('/experience', data),
  updateExperience: (id, data) => API.put(`/experience/${id}`, data),
  deleteExperience: (id) => API.delete(`/experience/${id}`),

  // Settings
  getSettings:    () => API.get('/settings'),
  updateSetting:  (key, value) => API.put(`/settings/${key}`, { value }),
  bulkSettings:   (settings) => API.post('/settings/bulk', { settings }),

  // Upload
  uploadImage:    (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // uploads can be slow
  }),
  deleteImage:    (publicId) => API.delete(`/upload/${encodeURIComponent(publicId)}`),
};
