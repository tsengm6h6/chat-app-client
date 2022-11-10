import api from './index'

export const authAPI = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload)
}