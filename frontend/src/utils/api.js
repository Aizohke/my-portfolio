import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — auto logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // Redirect only if currently on admin page
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;

// ─── Public API calls ────────────────────────────────────────────────────────
export const publicAPI = {
  getProjects:    () => API.get('/projects'),
  getProject:     (id) => API.get(`/projects/${id}`),
  getBlogPosts:   () => API.get('/blog'),
  getBlogPost:    (id) => API.get(`/blog/${id}`),
  getSkills:      () => API.get('/skills'),
  getExperience:  () => API.get('/experience'),
  getSettings:    () => API.get('/settings'),
  sendContact:    (data) => API.post('/contact', data),
};

// ─── Admin API calls ─────────────────────────────────────────────────────────
export const adminAPI = {
  // Auth
  login:          (data) => API.post('/auth/login', data),
  logout:         () => API.post('/auth/logout'),
  getMe:          () => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/password', data),

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
  getAllExperience: () => API.get('/experience/all'),
  createExperience:(data) => API.post('/experience', data),
  updateExperience:(id, data) => API.put(`/experience/${id}`, data),
  deleteExperience:(id) => API.delete(`/experience/${id}`),

  // Settings
  getSettings:    () => API.get('/settings'),
  updateSetting:  (key, value) => API.put(`/settings/${key}`, { value }),
  bulkSettings:   (settings) => API.post('/settings/bulk', { settings }),

  // Upload
  uploadImage:    (formData) => API.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage:    (publicId) => API.delete(`/upload/${encodeURIComponent(publicId)}`),
};
