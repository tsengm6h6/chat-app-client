import React, { useState, useEffect, useContext, useRef } from 'react'
import styled from 'styled-components'
import MainHeader from '../components/Main/MainHeader'
import MainContacts from '../components/Main/MainContacts'
import { useNavigate } from 'react-router-dom'
import ChatContext from '../chatContext'
import ChatRoom from '../components/Chat/ChatRoom'
import ChatWelcome from '../components/ChatWelcome'
import { userOnline } from '../socket/emit'
import { WsContext } from '../wsContext'
import { toastNormal } from '../utils/toastOptions'
import { messageAPI } from '../api/messageApi'
import { updateMessageStatus } from '../socket/emit'
import { useCallback } from 'react'

function NewMain() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])

  const { currentUser, setCurrentUser, chatTarget, userRooms, setUserRooms, userContacts, setUserContacts, fetchRooms } = useContext(ChatContext)
  const { value: { globalNotify, messageFromSocket, messageStatusToUpdate }, setValue } = useContext(WsContext)

  const userRoomsRef = useRef([])
  const userContactRef = useRef([])
  const chatTargetRef = useRef([])

  useEffect(() => {
    userRoomsRef.current = userRooms
  }, [userRooms])

  useEffect(() => {
    userContactRef.current = userContacts
  }, [userContacts])

  useEffect(() => {
    chatTargetRef.current = chatTarget
  }, [chatTarget])


  // 導航守衛
  useEffect(() => {
    if (!currentUser) {
      const existedUser = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_KEY))
      if (existedUser) {
        setCurrentUser(existedUser)
        userOnline(existedUser._id)
      } else {
        navigate('/login')
      }
    } else if (currentUser.avatarImage === '') {
      navigate('/setting')
    }
  }, [navigate, currentUser, setCurrentUser])

   // globalNotify
   useEffect(() => {
    if (globalNotify !== '') {
      toastNormal(globalNotify)
      fetchRooms()
      setValue(prevState => ({
        ...prevState,
        globalNotify: ''
      }))
    }
  }, [globalNotify, setValue, fetchRooms])

  // update msg status
  useEffect(() => {
    if (messageStatusToUpdate) {
      const { type, readerId } = messageStatusToUpdate
      const updateUnread = type === 'user' ? (readerId && readerId === chatTarget?._id) : true
      if (updateUnread) {
        setMessages(prevState => {
          return prevState.map(msg => msg.sender !== readerId
            ? { ...msg, unread: false }
            : { ...msg }  
          )
        })
      }
    }
  }, [messageStatusToUpdate, chatTarget])

  const updateContactLatestMessage = useCallback(({ type, contactId, message, time }) => {
    const mapper = (prev) => prev.map(user => {
      return user._id === contactId 
        ? { 
          ...user, 
          latestMessage: message, 
          latestMessageSender: contactId, 
          latestMessageUpdatedAt: time 
        }
        : user
    })
    type === 'room' ? setUserRooms(prev => mapper(prev)) : setUserContacts(prev => mapper(prev))
  }, [setUserRooms, setUserContacts])

  const updateContactUnreadCount = useCallback((contactId, unreadCount = 0, type = 'user') => {
    type === 'room' 
    ? setUserRooms(prev => prev.map(room => {
      return room._id === contactId 
        ? { 
          ...room, 
          unreadCount
        }
        : room
    }))
    : setUserContacts(prev => prev.map(user => {
      return user._id === contactId 
        ? { 
          ...user, 
          unreadCount
        }
        : user
    }))
  }, [setUserContacts, setUserRooms])

  const updateChattingMessage = useCallback(({ senderId, message, time }) => {
    setMessages(prev => [...prev, {
      message,
      fromSelf: false,
      sender: senderId,
      time,
      unread: false // 已讀
    }])
  }, [])

  useEffect(() => {
    const { type, message, senderId, receiverId, time } = messageFromSocket

    if (type === 'room') {
      // contact 更新一筆訊息
      updateContactLatestMessage({ type, contactId: receiverId, message, time })
      
      if (receiverId === chatTarget?._id) { // 正在該聊天室中
        console.log('-- current room add message --')
        updateChattingMessage({ senderId, message, time })
        messageAPI.updateReadStatus({ receiverId: currentUser?._id })
        updateMessageStatus({ 
          type: 'room',
          readerId: currentUser?._id,
          messageSender: chatTarget?._id
        })
      }
    } else if (type === 'user') {
      
      // contact 更新一筆訊息
      updateContactLatestMessage({ type, contactId: senderId, message, time })

      if (senderId === chatTarget?._id) { // 正在對話中
        updateChattingMessage({ senderId, message, time })
        messageAPI.updateReadStatus({ receiverId: currentUser?._id })
        updateMessageStatus({ 
          type: 'user',
          readerId: currentUser?._id,
          messageSender: chatTarget?._id
        })
      }
    }
  }, [messageFromSocket, updateChattingMessage, updateContactLatestMessage, updateContactUnreadCount, chatTarget, currentUser, setUserRooms, setUserContacts])

  useEffect(() => {
    const { type, senderId, receiverId } = messageFromSocket
    let contact = {}
    if (type === 'room' && receiverId !== chatTargetRef.current?._id) {
      contact = userRoomsRef.current.find(room => room._id === receiverId)
      updateContactUnreadCount(receiverId, contact?.unreadCount + 1, type)
    } else if (type === 'user' && senderId !== chatTargetRef.current?._id) {
      contact = userContactRef.current.find(user => user._id === senderId)
      updateContactUnreadCount(senderId, contact?.unreadCount + 1, type)
    }
  }, [messageFromSocket, updateContactUnreadCount])

  return (
    <MainContainer>
      {
        currentUser &&
        <>
          <MainHeader/>
          <div className={`chat-container ${chatTarget?._id ? 'target-selected' : ''}`}>
            <MainContacts updateContactUnreadCount={updateContactUnreadCount}  />
              {
                chatTarget === null
                ? <ChatWelcome />
                : <ChatRoom 
                    messages={messages} 
                    setMessages={setMessages}
                    updateContactLatestMessage={updateContactLatestMessage} />
              }
          </div>
        </>
      }
    </MainContainer>
  )
}

const MainContainer = styled.div `
  width: 100%;
  height: 100%;

  .chat-container {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: calc(100vh - 60px);
    overflow: hidden;
    background: #00000076;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

    @media screen and (min-width: 768px){
      padding: 1.5rem 1rem;
      flex-direction: row;
    }
  }
`

export default NewMain