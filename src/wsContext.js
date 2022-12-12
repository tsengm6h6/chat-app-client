import React, { createContext, useState, useEffect } from 'react'
import { initSocket } from './socket/index'

export const WsContext = createContext({
  onlineUsers: [],
  messageFromSocket: {},
  typingNotify: {}, // 需判斷 id
  roomNotify: '',
  globalNotify: ''
})

export const WsContextProvider = ({ children }) => {

  const [value, setValue] = useState({
    onlineUsers: [],
    messageFromSocket: {},
    typingNotify: {}, // 需判斷 id
    roomNotify: '',
    globalNotify: ''
  })

  useEffect(() => {
    initSocket({ setValue })
  }, [])

  return (
    <WsContext.Provider value={{ value, setValue } }>
      {children}
    </WsContext.Provider>
  )
}