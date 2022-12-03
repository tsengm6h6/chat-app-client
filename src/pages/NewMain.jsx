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
  const [chatTarget, setChatTarget] = useState(null)
  const [chatUserId, setChatUserId] = useState(null)
  // const [chatType, setChatType] = useState(null)
  const [chatRoomUsers, setChatRoomUsers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const socket = useRef(null)
  const chatTargetRef = useRef()
  const chatUserIdRef = useRef()

  console.log('main re-render', chatUserId)
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

  useEffect(() => {
    chatTargetRef.current = chatTarget
  }, [chatTarget, chatUserId])

  useEffect(() => {
    chatUserIdRef.current = chatUserId
  }, [chatUserId])

  // 取得 user message
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

  // useEffect(() => {
  //   console.log('chat type', chatTarget.type)
  //   if (chatTarget.type === 'room') {
  //     socket.current.emit('ENTER_CHAT_ROOM', {
  //       roomId: chatTarget._id,
  //       enterUserId: currentUser._id
  //     })
  //   }
  // }, [chatTarget, currentUser])

  // useEffect(() => {
  //   // TODO: id 不同 ＆ 原本是 room
  //   if ((prevChatTarget.current?._id !== chatTarget?._id)) {
  //     // 原本是群組 -> 離開
  //     if (prevChatTarget.current?.type === 'room') {
  //       socket.current.emit('LEAVE_CHAT_ROOM', {
  //         roomId: prevChatTarget.current?._id,
  //         leaveUserId: currentUser._id
  //       })
  //     }

  //     // 新加入是群組 -> JOIN
  //     if (chatTarget.type === 'room') {
  //       socket.current.emit('ENTER_CHAT_ROOM', {
  //         roomId: chatTarget._id,
  //         enterUserId: currentUser._id
  //       })
  //     }
  //   }
  // }, [chatTarget, currentUser, chatUserId])

  const handleActive = useCallback((onlineUsers) => {
    setOnlineUsers(onlineUsers.map(({ userId }) => userId))
    console.log('online users', onlineUsers)
  }, [])

  const handleReceiveMsg = useCallback((data) => {
    console.log('recevive', chatUserIdRef.current)
    const { type, message, senderId } = data
     // 一對一時正在聊天的人和傳訊的人相同才加入顯示
    if (type === 'room' || (type === 'user' && senderId === chatUserIdRef.current)) {
        setMessages(prevMessages  => [...prevMessages, {
          message,
          fromSelf: false,
          sender: senderId,
          time: new Date().toISOString()
        }])
      }
  }, [])

  const handleTypingNotify = useCallback(({ typingId }) => {
    console.log('target', chatTarget, chatTarget)
    // 只有目標對象會收到，TODO: 顯示在 message 頁面
    const userName = chatTarget?.username || ''
    toastNormal(`${userName} is typing`)
    console.log('userName', userName)
  }, [])

  // useEffect(() => {
  //   if (isTyping) {
  //     socket.current.emit('USER_TYPING', {
  //       type: chatTarget?.type,
  //       senderId: currentUser._id,
  //       receiverId: chatTarget?._id,
  //     })
  //   }
  // }, [isTyping, currentUser])

  useEffect(() => {
    if (currentUser?._id) {
      socket.current = io(`${process.env.REACT_APP_SERVER_URL}`)
      socket.current.emit('USER_ONLINE', currentUser?._id)
      socket.current.on('ONLINE_USER_CHANGED', handleActive)
      socket.current.on('RECEIVE_MESSAGE', handleReceiveMsg)
      socket.current.on('TYPING_NOTIFY', handleTypingNotify)
      socket.current.on('NEW_USER_JOIN_GROUP_CHAT', ({ joinId, username }) => {
        console.log(`Join room ${joinId}`)
        toastNormal(`${username} 已加入聊天`)
      })
      socket.current.on('USER_LEAVE_CHAT_ROOM',({ leaveId, username }) => {
        console.log(`Leave room ${leaveId}`)
        toastNormal(`${username} 已離開聊天`)
      })
    }
  }, [currentUser, handleActive, handleReceiveMsg, handleTypingNotify])

  const onContactSelect = (newChatTarget) => {
    console.log('selected', newChatTarget)
    setChatUserId(newChatTarget._id)
    setChatTarget(newChatTarget)

    console.log('new-target', newChatTarget._id)
    console.log('ref target', chatUserIdRef)

    // TODO: id 不同 ＆ 原本是 room
    if ((chatUserIdRef.current !== newChatTarget._id)) {
      // 原本是群組 -> 離開
      if (chatTargetRef.current?.type === 'room') {
        socket.current.emit('LEAVE_CHAT_ROOM', {
          roomId: chatUserIdRef.current,
          leaveUserId: currentUser._id,
          leaveUserName:  currentUser.username
        })
      }

      // 新加入是群組 -> JOIN
      if (newChatTarget.type === 'room') {
        socket.current.emit('ENTER_CHAT_ROOM', {
          roomId: newChatTarget._id,
          enterUserId: currentUser._id,
          enterUserName:  currentUser.username
        })
      }
    }
    
    // setChatType(payload.roomname ? 'room' : 'user')
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
        type: chatTarget?.type,
        from: currentUser._id,
        to: chatTarget?._id
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
      type: chatTarget?.type,
      message: newMessage,
      senderId: currentUser._id,
      receiverId: chatTarget?._id
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
              chatTarget === null
              ? <ChatWelcome />
              : <ChatRoom
                  chatType={chatTarget.type}
                  chatTarget={chatTarget}
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