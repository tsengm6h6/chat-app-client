import api from './index'

export const userAPI = {
  setAvatarImage: (uid, payload) => api.post(`/api/users/setting/${uid}`, payload),
  getUsers: () => api.get('/api/users')
}