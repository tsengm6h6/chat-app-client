import React, { createContext, useState, useEffect } from 'react'
import { userAPI } from './api/userApi'
import { roomAPI } from './api/roomApi'

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
      setUserContacts(users.length > 0 ? users.map(user => ({ ...user, type: 'user'})) : [])
      setUserRooms(rooms.length > 0 ? rooms.map(room => ({ ...room, type: 'room'})) : [])
    }
    
    if (currentUser?._id) {
      fetchContacts()
    }
    
  }, [currentUser])

  const fetchRooms = async() => {
    const { data: { data } } = await roomAPI.getUserRooms({ userId: currentUser._id })
    setUserRooms(data.length > 0 ? data.map(room => ({ ...room, type: 'room'})) : [])
  }


  return (
    <ChatContext.Provider value={{ 
      currentUser, 
      setCurrentUser,
      userContacts,
      setUserContacts,
      fetchRooms,
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