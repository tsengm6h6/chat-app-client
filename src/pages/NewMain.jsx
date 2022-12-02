import React, { useState, useEffect, useContext, useRef } from 'react'
import styled from 'styled-components'
import MainHeader from '../components/Main/MainHeader'
import MainContacts from '../components/Main/MainContacts'
import { useNavigate } from 'react-router-dom'
import ChatContext from '../chatContext'
import { messageAPI } from '../api/messageApi'
import ChatRoom from '../components/Chat/ChatRoom'
import ChatWelcome from '../components/ChatWelcome'
import { io } from 'socket.io-client'
import { toastError, toastNormal } from '../utils/toastOptions'

function NewMain() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(ChatContext)
  const [chatTarget, setChatTarget] = useState(null)
  const [chatType, setChatType] = useState(null)
  const [chatRoomUsers, setChatRoomUsers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const ws = useRef(null)
  // 導航守衛
  useEffect(() => {
    if (!currentUser) {
      const existedUser = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_KEY))
      if (existedUser) {
        setCurrentUser(existedUser)
      } else {
        navigate('/login')
      }
    } else if (currentUser.avatarImage === '') {
      navigate('/setting')
    } 
  }, [navigate, currentUser, setCurrentUser])

  // 取得 user message
  // 取得 DB 裡的歷史訊息
  useEffect(() => {
    if (currentUser && chatType) {
      const fetchMsg = async() => {
        const { data } = await messageAPI.getMessages({
          type: chatType,
          from: currentUser._id,
          to: chatTarget._id
        })
        console.log('message', data)
        setMessages(formatMsg(data))
      }
      const formatMsg = (data) => {
        return data.messages.map(msg => ({
          message: msg.message,
          fromSelf: msg.sender === currentUser._id, // TODO: 直接紀錄 sender
          time: msg.updatedAt
        }))
      }
      fetchMsg()
    }
  }, [currentUser, chatTarget, chatType])

  // 連接 websocket & 監聽 event
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_SERVER_URL}`)
    socket.on('connect', () => {
      console.log(`socket connect ${socket.id}`)
      ws.current = socket
      if (currentUser) {
        socket.emit('user-online', currentUser._id) // 登記現有 user 上線
      }
      console.log(chatType)
      if (chatType === 'room') {
        socket.emit('enter-room', {
          room: chatTarget._id,
          userId: currentUser._id,
          user: currentUser.username
        })
      }
    })

    const receiceMessageHandler = ({ type, message, from, to }) => {
      // 一對一時正在聊天的人和傳訊的人相同才加入顯示
      if (type === 'room' || (type === 'user' && chatTarget?._id === from)) {
        setMessages(prevMessages  => [...prevMessages, {
          message,
          fromSelf: false,
          time: new Date().toISOString()
        }])
      }
    }

    const typingHandler = ({ type, message, from }) => {
      // 聊天對象和傳訊的人相同才顯示
      if (type === 'room' || (type === 'user' && chatTarget?._id === from)) {
        toastNormal(message)
     }
    }

    const joinRoomHandler = ({ message, joinId }) => {
      // toastNormal(message)
      setChatRoomUsers(prev => prev.map(user => user.userId === joinId ? {...user, isOnline: true }: user))
    }

    const leaveRoomHandler = ({ message, leaveId }) => {
      // toastError(message)
      setChatRoomUsers(prev => prev.map(user => user.userId === leaveId ? {...user, isOnline: false }: user))
    }

    const handleOnlineOfflineNotify = ({ type, userId, onlineUsersId }) => {
      // TODO:
      console.log(`${userId} is ${type}`)
      setOnlineUsers(onlineUsersId)
    }

    socket.on('online-notify', handleOnlineOfflineNotify)
    socket.on('offline-notify', handleOnlineOfflineNotify)
    socket.on('client-receive-msg',receiceMessageHandler)
    socket.on('user-join-room', joinRoomHandler)
    socket.on('user-leave-room', leaveRoomHandler)
    socket.on('receive-typing', typingHandler)

    return () => {
      socket.off('online-notify', handleOnlineOfflineNotify)
      socket.on('offline-notify', handleOnlineOfflineNotify)
      socket.off('client-receive-msg',receiceMessageHandler)
      socket.off('user-join-room', joinRoomHandler)
      socket.off('user-leave-room', leaveRoomHandler)

      if (chatType === 'room') { // 通知別人有人離開
        socket.emit('leave-room', ({
          room: chatTarget._id,
          userId: currentUser._id,
          user: currentUser.username
        }))
      }
      socket.disconnect() // 切斷連線
    }
  }, [ws, currentUser, chatTarget, chatType])

   // TODO: isTyping 顯示
   useEffect(() => {
    if (isTyping) {
      ws.current.emit('user-typing', {
        user: currentUser.username,
        type: chatType,
        from: currentUser._id,
        to: chatTarget._id,
      })
    }
  }, [isTyping, currentUser, chatTarget, chatType])
  // 取得 currentUser 的 contacts & rooms -> context 裡面取
  // 紀錄 chatTarget & chatType when contacts clicked

  const onContactSelect = (payload) => {
    console.log('selected', payload)
    setChatTarget(payload)
    setChatType(payload.roomname ? 'room' : 'user')
    setChatRoomUsers(
      payload.roomname
        ? payload.users
          .filter(user => user !== currentUser._id) // 濾掉目前使用者
          .map(user => ({ userId: user, isOnline: false })) // 其他人都 offline
        : []
    )
  }

  const onMessageSend = async (evt, newMessage) => {
    evt.preventDefault()
    const { data } = await messageAPI.postMessage({
        type: chatType,
        from: currentUser._id,
        to: chatTarget._id
      }, {
        message: newMessage,
      }
    )
    // TODO: 用 socket 才能同時收到，而不是從 db 撈才有
    ws.current.emit('input-message', {
      type: chatType,
      message: newMessage,
      from: currentUser._id,
      to: chatTarget._id
    })
    const formatMsg = data.messages.map(msg => ({
      message: msg.message,
      fromSelf: msg.sender === currentUser._id,
      time: msg.updatedAt
    }))

    setMessages(formatMsg)
  }

  const onLogout = () => {
    ws.current.emit('logout', currentUser._id)
    localStorage.removeItem(process.env.REACT_APP_LOCAL_KEY)
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <MainContainer>
      {
        currentUser &&
        <>
          <MainHeader handleLogout={onLogout} />
          <div className="chat-container">
            <MainContacts
              onlineUsers={onlineUsers}
              handleContactSelected={onContactSelect} />
            {
              chatType === null
              ? <ChatWelcome />
              : <ChatRoom
                  chatType={chatType}
                  chatTarget={chatTarget}
                  chatRoomUsers={chatRoomUsers}
                  messages={messages}
                  handleMessageSend={onMessageSend}
                  handleTyping={setIsTyping} />
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