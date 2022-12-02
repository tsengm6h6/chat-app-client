import React, { createContext, useState, useEffect } from 'react'
import { userAPI } from './api/userApi'

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userContacts, setUserContacts] = useState([])
  const [userRooms, setUserRooms] = useState([])
  const [chatTarget, setChatTarget] = useState(null)

  useEffect(() => {
    const fetchContacts = async() => {
      const { data } = await userAPI.getUserContacts({ userId: currentUser._id })
      const { rooms, users } = data.data
      setUserContacts(users.length > 0 ? users : [])
      setUserRooms(rooms.length > 0 ? rooms : [])
    }
    
    if (currentUser?._id) {
      fetchContacts()
    }
    
  }, [currentUser])

  return (
    <ChatContext.Provider value={{ 
      currentUser, 
      setCurrentUser,
      userContacts,
      setUserContacts,
      userRooms,
      setUserRooms,
      chatTarget,
      setChatTarget
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContext