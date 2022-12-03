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

function NewMain() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(ChatContext)
  // const [chatTarget, setChatTarget] = useState(null)
  const [chatType, setChatType] = useState(null)
  const [chatRoomUsers, setChatRoomUsers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const chatTarget = useRef(null)
  const socket = useRef(null)

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
          to: chatTarget.current._id,
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
  }, [currentUser, chatTarget, chatType])

  useEffect(() => {
    console.log('chat type', chatType)
    if (chatType === 'room') {
      socket.current.emit('ENTER_CHAT_ROOM', {
        roomId: chatTarget.current._id,
        enterUserId: currentUser._id
      })
    }
  }, [chatType, currentUser])

  const handleActive = useCallback((onlineUsers) => {
    setOnlineUsers(onlineUsers.map(({ userId }) => userId))
    console.log('online users', onlineUsers)
  }, [])

  const handleReceiveMsg = useCallback((data) => {
    const { type, message, senderId } = data
     // 一對一時正在聊天的人和傳訊的人相同才加入顯示
    if (type === 'room' || (type === 'user' && senderId === chatTarget.current?._id)) {
        setMessages(prevMessages  => [...prevMessages, {
          message,
          fromSelf: false,
          sender: senderId,
          time: new Date().toISOString()
        }])
      }
  }, [])

  const handleTypingNotify = useCallback(() => {
    // 只有目標對象會收到，TODO: 顯示在 message 頁面
    const userName = chatTarget.current.username
    toastNormal(`${userName} is typing`)
  }, [])

  useEffect(() => {
    if (isTyping) {
      socket.current.emit('USER_TYPING', {
        type: chatType,
        senderId: currentUser._id,
        receiverId: chatTarget.current._id,
      })
    }
  }, [isTyping, currentUser, chatTarget, chatType])

  useEffect(() => {
    if (currentUser?._id) {
      socket.current = io(`${process.env.REACT_APP_SERVER_URL}`)
      socket.current.emit('USER_ONLINE', currentUser?._id)
      socket.current.on('ONLINE_USER_CHANGED', handleActive)
      socket.current.on('RECEIVE_MESSAGE', handleReceiveMsg)
      socket.current.on('TYPING_NOTIFY', handleTypingNotify)
      socket.current.on('NEW_USER_JOIN_GROUP_CHAT', ({ joinId }) => {
        console.log('Join room' + '' + joinId)
      })
      socket.current.on('USER_LEAVE_CHAT_ROOM',({ leaveId }) => {
        console.log('Leave room' + '' + leaveId)
      })
    }
  }, [currentUser, handleActive, handleReceiveMsg, handleTypingNotify])

  const onContactSelect = (payload) => {
    // TODO: 不同 ＆ 原本是 room
    if (payload?._id !== chatTarget.current?._id) {
      // 換房間
      socket.current.emit('LEAVE_CHAT_ROOM', {
        roomId: chatTarget.current?._id,
        leaveUserId: currentUser._id
      })
    }
    console.log('selected', payload)
    chatTarget.current = payload
    setChatType(payload.roomname ? 'room' : 'user')
    // setChatRoomUsers(
    //   payload.roomname
    //     ? payload.users
    //       .filter(user => user !== currentUser._id) // 濾掉目前使用者
    //       .map(user => ({ userId: user, isOnline: false })) // 其他人都 offline
    //     : []
    // )
  }

  const onMessageSend = async (evt, newMessage) => {
    evt.preventDefault()
    const { data } = await messageAPI.postMessage({
        type: chatType,
        from: currentUser._id,
        to: chatTarget.current._id
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

    // TODO: 用 socket 才能同時收到，而不是從 db 撈才有
    socket.current.emit('SEND_MESSAGE', {
      type: chatType,
      message: newMessage,
      senderId: currentUser._id,
      receiverId: chatTarget.current._id
    })
  }

  const onLogout = () => {
    socket.current.emit('USER_OFFLINE', currentUser._id)
    // socket.disconnect() // 切斷連線
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
                  chatTarget={chatTarget.current}
                  chatRoomUsers={chatRoomUsers}
                  onlineUsers={onlineUsers}
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