import api from './index'

export const messageAPI = {
  getMessages: ({ type, from, to }) => api.get(`api/message/messages?type=${type}&from=${from}&to=${to}`),
  postMessage: ({ type, from, to }, message) => api.post(`api/message?type=${type}&from=${from}&to=${to}`, message)
}