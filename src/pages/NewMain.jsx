import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import styled from 'styled-components'
import MainHeader from '../components/Main/MainHeader'
import MainContacts from '../components/Main/MainContacts'
import { useNavigate } from 'react-router-dom'
import ChatContext from '../chatContext'
import { messageAPI } from '../api/messageApi'
import ChatRoom from '../components/Chat/ChatRoom'
import ChatWelcome from '../components/ChatWelcome'
import { io } from 'socket.io-client'
import { toastNormal } from '../utils/toastOptions'

// TODO: 
// 2. 新增 read / unread 狀態
// 3. 調整新增聊天室 UI
// 4. 手機版顯示切換 

function NewMain() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(ChatContext)
  const [chatTarget, setChatTarget] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const socket = useRef(null)
  const chatTargetRef = useRef(null)

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

  // 監聽 chatTarget 改變 emit room 通知
  useEffect(() => {
    // 新選的 id 不同
    if ((chatTargetRef.current?._id !== chatTarget?._id)) {
      // 原本是群組 -> 通知離開
      if (chatTargetRef.current?.type === 'room') {
        socket.current.emit('LEAVE_CHAT_ROOM', {
          roomId: chatTargetRef.current?._id,
          leaveUserId: currentUser._id,
          leaveUserName:  currentUser.username
        })
      }

      // 新加入是群組 -> 通知 JOIN
      if (chatTarget?.type === 'room') {
        socket.current.emit('ENTER_CHAT_ROOM', {
          roomId: chatTarget?._id,
          enterUserId: currentUser._id,
          enterUserName:  currentUser.username
        })
      }
    }

    chatTargetRef.current = chatTarget
  }, [chatTarget, currentUser])

  // 取得 DB 裡的歷史訊息
  useEffect(() => {
    if (currentUser && chatTarget) {
      const fetchMsg = async() => {
        const { data } = await messageAPI.getMessages({
          type: chatTarget.type,
          from: currentUser._id,
          to: chatTarget._id,
        })
        console.log('message', data)
        setMessages(formatMsg(data))
      }
      const formatMsg = (data) => {
        return data.messages.map(msg => ({
          message: msg.message,
          fromSelf: msg.sender === currentUser._id,
          sender: msg.sender, // TODO: 顯示 sender 頭貼
          time: msg.updatedAt,
        }))
      }
      fetchMsg()
    }
  }, [currentUser, chatTarget])

  const handleActive = useCallback((onlineUsers) => {
    setOnlineUsers(onlineUsers.map(({ userId }) => userId))
    console.log('online users', onlineUsers)
  }, [])

  const handleReceiveMsg = useCallback((data) => {
    const { type, message, senderId } = data
     // 一對一時正在聊天的人和傳訊的人相同才顯示
    if (type === 'room' || (type === 'user' && senderId === chatTargetRef.current?._id)) {
      toastNormal('new message' + message)
        setMessages(prevMessages  => [...prevMessages, {
          message,
          fromSelf: false,
          sender: senderId,
          time: new Date().toISOString()
        }])
      }
  }, [])

  const handleTypingNotify = useCallback(( { type, senderName, senderId, receiverId }) => {
    // 只有目標對象會收到
    //  &&  receiverId === chatTargetRef.current?._id
    if (type === 'room' || (type === 'user' && senderId === chatTargetRef.current?._id)) {
      toastNormal(`${senderName} is typing`) // TODO: 顯示在 message 頁面
    }
  }, [])

  const handleRoomNotify = useCallback(({ roomId, action, username }) => {
    if (chatTargetRef.current?.type === 'room' && chatTargetRef.current?._id === roomId) {
      toastNormal(`${username} ${action === 'JOIN' ? '已加入聊天' : '已離開聊天'}`)
    }
  }, [])

  useEffect(() => {
    if (isTyping && chatTargetRef.current) {
      socket.current.emit('USER_TYPING', {
        type: chatTargetRef.current.type,
        senderName: currentUser.username,
        senderId: currentUser._id,
        receiverId: chatTargetRef.current._id,
      })
    }
  }, [isTyping, currentUser])

  useEffect(() => {
    if (currentUser?._id) {
      socket.current = io(`${process.env.REACT_APP_SERVER_URL}`)
      socket.current.emit('USER_ONLINE', currentUser?._id)
      socket.current.on('ONLINE_USER_CHANGED', handleActive)
      socket.current.on('RECEIVE_MESSAGE', handleReceiveMsg)
      socket.current.on('TYPING_NOTIFY', handleTypingNotify)
      socket.current.on('CHAT_ROOM_NOTIFY', handleRoomNotify)
    }
  }, [currentUser, handleActive, handleReceiveMsg, handleTypingNotify, handleRoomNotify])

  const onContactSelect = (newChatTarget) => {
    setChatTarget(newChatTarget)
  }


  const onMessageSend = async (evt, newMessage) => {
    evt.preventDefault()
    const { data } = await messageAPI.postMessage({
        type: chatTargetRef.current?.type,
        from: currentUser._id,
        to: chatTargetRef.current?._id
      }, {
        message: newMessage,
      }
    )
    
    const formatMsg = data.messages.map(msg => ({
      message: msg.message,
      fromSelf: msg.sender === currentUser._id,
      sender: msg.sender,
      time: msg.updatedAt
    }))

    setMessages(formatMsg)

    // 用 socket 即時通知
    socket.current.emit('SEND_MESSAGE', {
      type: chatTargetRef.current?.type,
      message: newMessage,
      senderId: currentUser._id,
      receiverId: chatTargetRef.current?._id
    })
  }

  const onLogout = () => {
    socket.current.emit('USER_OFFLINE', currentUser._id) // 先更新才能切斷連線
    socket.current.disconnect()
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
              chatTarget={chatTarget}
              onlineUsers={onlineUsers}
              handleContactSelected={onContactSelect} />
              {
                chatTarget === null
                ? <ChatWelcome />
                : <ChatRoom
                    chatTarget={chatTarget}
                    handleContactSelected={onContactSelect}
                    onlineUsers={onlineUsers}
                    messages={messages}
                    handleMessageSend={onMessageSend}
                    isTyping={isTyping}
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