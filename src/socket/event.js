import { socket } from './index'

export const socketEvent = ({ setValue }) => {
  console.log('socket event')
  socket.on('ONLINE_USER_CHANGED', (onlineUsers) => {
    setValue(prevState => ({ ...prevState, onlineUsers: onlineUsers.map(({ userId }) => userId) }))
  })

  socket.off('RECEIVE_MESSAGE').on('RECEIVE_MESSAGE', ({ type, message, senderId, receiverId, time }) => {
    //  只存 socket 來的 message，無腦存、剩下的交給頁面判斷
    setValue(prevState => (
      { ...prevState, 
        messageFromSocket: { type, message, senderId, receiverId, time }
      }
    ))
  })

  socket.on('TYPING_NOTIFY', ({ type, message, senderId, receiverId }) => {
    setValue(prevState => (
      { ...prevState, 
        typingNotify: { type, message, senderId, receiverId }
        // type === user && senderId === target.id 才顯示 message
      }
    ))
  })

  socket.off('CHAT_ROOM_NOTIFY').on('CHAT_ROOM_NOTIFY', ({ message }) => {
    console.log('enter room', message)
    setValue(prevState => (
      { ...prevState,
        roomNotify: message // receiver type === room 就顯示
      }
    ))
  })

  socket.on('INVITED_TO_ROOM', ({ message }) => {
    setValue(prevState => ({
        ...prevState,
        globalNotify: message
      }
    ))
  })
}