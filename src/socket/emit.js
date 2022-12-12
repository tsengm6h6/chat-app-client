import { socket } from './index'

export const userOnline = (userId) => {
  console.log('user online')
  socket.emit('USER_ONLINE', userId)
}

export const userOffline = (userId) => {
  console.log('user offline')
  socket.emit('USER_OFFLINE', userId)
  socket.disconnect()
}

export const sendMessage = ({ type, message, senderId, receiverId, time }) => {
  socket.emit('SEND_MESSAGE', { type, message, senderId, receiverId, time })
}

export const userTyping = ({ type, message, senderId, receiverId }) => {
  socket.emit('USER_TYPING', { type, message, senderId, receiverId })
}

export const enterRoom = ({ roomId, message }) => {
  socket.emit('ENTER_CHAT_ROOM', { roomId, message })
}

export const leaveRoom = ({ roomId, message }) => {
  socket.emit('LEAVE_CHAT_ROOM', { roomId, message })
}

export const roomCreated = ({ roomname, creator, invitedUser }) => {
  socket.emit('ROOM_CREATED', { roomname, creator, invitedUser })
}