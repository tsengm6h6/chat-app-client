import api from './index'

export const roomAPI = {
  // getUserRooms: ({ userId }) => api.get(`api/room/rooms?user=${userId}`),
  postRoom: (payload) => api.post('api/room', payload)
}