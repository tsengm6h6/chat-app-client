import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toastError, toastNormal } from '../utils/toastOptions'
import styled from 'styled-components'
import ChatHeader from '../components/Chat/ChatHeader'
import ChatInput from '../components/Chat/ChatInput'
import ChatMessages from '../components/Chat/ChatMessages'
import { io } from 'socket.io-client'
import { messageAPI } from '../api/messageApi'
import ChatContext from '../chatContext'

function Chat() {
  const navigate = useNavigate()
  const { currentUser, chatTarget, setCurrentUser } = useContext(ChatContext)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [chatType, setChatType] = useState('')
  const ws = useRef(null)
  const [searchParams] = useSearchParams()

  // 檢查當下聊天模式：1 對 1 or Room
  useEffect(()=> {
    console.log(searchParams.get('user'))
    console.log(searchParams.get('room'))
    const type = searchParams.get('user') ? 'user' : 'room' // 判斷 chatTarget 是 user 還是 room
    setChatType(type)
  }, [searchParams])

  // 連線 socket & 監聽 event
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_SERVER_URL}`)
    socket.on('connect', () => {
      console.log(`socket connect ${socket.id}`)
      ws.current = socket
      if (currentUser) {
        socket.emit('add-user', currentUser._id) // 登記現有 user 上線
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

    const joinRoomHandler = (message) => {
      toastNormal(message)
    }

    const leaveRoomHandler = (message) => {
      toastError(message)
    }

    socket.on('client-receive-msg',receiceMessageHandler)
    socket.on('user-join-room', joinRoomHandler)
    socket.on('user-leave-room', leaveRoomHandler)
    socket.on('receive-typing', typingHandler)

    return () => {
      socket.off('client-receive-msg',receiceMessageHandler)
      socket.off('user-join-room', joinRoomHandler)
      socket.off('user-leave-room', leaveRoomHandler)

      if (chatType === 'room') { // 通知別人有人離開
        socket.emit('leave-room', ({
          room: chatTarget._id,
          user: currentUser.username
        }))
      }
      socket.disconnect() // 切斷連線
    }
  }, [ws, currentUser, chatTarget, chatType])

  // isTyping 顯示
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

  // 導航守衛
  useEffect(() => {
    if (!currentUser) {
      const existedUser = localStorage.getItem(process.env.REACT_APP_LOCAL_KEY)
      if (existedUser) {
        setCurrentUser(existedUser)
      } else {
        navigate('/login')
      }
    } else if (currentUser.avatarImage === '') {
      navigate('/setting')
    } 
  }, [navigate, currentUser, setCurrentUser])

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
          fromSelf: msg.sender === currentUser._id,
          time: msg.updatedAt
        }))
      }
      fetchMsg()
    }
  }, [currentUser, chatTarget, chatType])

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

  return (
      <ChatWrapper>
        { currentUser && (
          <>
            <ChatHeader />
            <ChatMessages messages={messages} />
            <ChatInput handleTyping={setIsTyping} handleMessageSend={onMessageSend} />
          </>
        )}
      </ChatWrapper>
  )
}

const ChatWrapper = styled.div `
  background-color: #131324;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export default Chat