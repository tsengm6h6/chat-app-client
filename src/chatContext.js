import React, { createContext, useState } from 'react'
const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [chatTarget, setChatTarget] = useState(null)

  return (
    <ChatContext.Provider value={{ 
      currentUser, 
      setCurrentUser,
      chatTarget,
      setChatTarget
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContext