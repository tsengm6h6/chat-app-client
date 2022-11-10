import api from './index'

export const messageAPI = {
  getMessages: ({ from, to }) => api.get(`api/message/messages?from=${from}&to=${to}`),
  postMessage: (payload) => api.post('api/message', payload)
}