import React, { createContext, useRef, useEffect, useContext } from 'react'
import ChatContext from './chatContext'
// import { io } from 'socket.io-client'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  
  const { currentUser } = useContext(ChatContext)

  // const socket = io(`${process.env.REACT_APP_SERVER_URL}`)

  const socketRef = useRef(null)
  // const connect = () => {
  //   socket.current = io(`${process.env.REACT_APP_SERVER_URL}`)
  // }

  // useEffect(() => {
  //   if (currentUser?._id && socket) {
  //     socketRef.current = socket
  //     // socketRef.current.emit('USER_ONLINE', currentUser?._id)
  //     // socket.current.on('ONLINE_USER_CHANGED', handleActive)
  //     // socket.current.on('RECEIVE_MESSAGE', handleReceiveMsg)
  //     // socket.current.on('TYPING_NOTIFY', handleTypingNotify)
  //     // socket.current.on('CHAT_ROOM_NOTIFY', handleRoomNotify)
  //   }
  // }, [socket, currentUser])


  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext