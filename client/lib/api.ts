import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { displayName?: string; avatarUrl?: string }) =>
    api.put('/auth/profile', data),
};

// Teams API
export const teamsAPI = {
  create: (data: { name: string; description?: string }) =>
    api.post('/teams', data),
  get: (teamId: string) => api.get(`/teams/${teamId}`),
  update: (teamId: string, data: { name?: string; description?: string }) =>
    api.put(`/teams/${teamId}`, data),
  delete: (teamId: string) => api.delete(`/teams/${teamId}`),
  invite: (teamId: string, userId: string) =>
    api.post(`/teams/${teamId}/invite`, { userId }),
  removeMember: (teamId: string, userId: string) =>
    api.delete(`/teams/${teamId}/members/${userId}`),
  leave: (teamId: string) => api.post(`/teams/${teamId}/leave`),
  getMembers: (teamId: string) => api.get(`/teams/${teamId}/members`),
};

// Raids API
export const raidsAPI = {
  start: (data: { teamId: string; bossId: string }) =>
    api.post('/raids/start', data),
  complete: (raidId: string, data: { score: number; timeTakenMinutes: number; notes?: string }) =>
    api.put(`/raids/${raidId}/complete`, data),
  get: (raidId: string) => api.get(`/raids/${raidId}`),
  getTeamRaids: (teamId: string, status?: string) =>
    api.get(`/raids/team/${teamId}`, { params: { status } }),
  uploadPhoto: (raidId: string, data: { photoUrl: string; storagePath: string }) =>
    api.post(`/raids/${raidId}/photo`, data),
  abandon: (raidId: string) => api.put(`/raids/${raidId}/abandon`),
};

// Leaderboard API
export const leaderboardAPI = {
  get: (period: string, type: string, limit?: number) =>
    api.get(`/leaderboard/${period}/${type}`, { params: { limit } }),
  getUserRank: (userId: string) => api.get(`/leaderboard/rank/${userId}`),
};

// Ingredients API
export const ingredientsAPI = {
  getAll: (params?: { category?: string; rarity?: string; isPremium?: boolean }) =>
    api.get('/ingredients', { params }),
  getPantry: () => api.get('/ingredients/pantry'),
  addToPantry: (data: { ingredientId: string; quantity?: number }) =>
    api.post('/ingredients/pantry', data),
};

// Users API
export const usersAPI = {
  getStats: () => api.get('/users/stats'),
};
