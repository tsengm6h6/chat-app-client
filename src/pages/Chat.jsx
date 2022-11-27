import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import ChatHeader from '../components/Chat/ChatHeader'
import ChatInput from '../components/Chat/ChatInput'
import ChatMessages from '../components/Chat/ChatMessages'
// import { io } from 'socket.io-client'
import { messageAPI } from '../api/messageApi'

function Chat() {
  const navigate = useNavigate()
  const { friendId: chatUserId } = useParams()
  const [currentUser, setCurrentUser] = useState(null)
  const [messages, setMessages] = useState([])
  // const ws = useRef(null)


  // useEffect(() => {
  //   if (currentUser) {
  //     const socket = io(`${process.env.REACT_APP_SERVER_URL}`)
  //     socket.on('connect', () => {
  //       console.log(`socket connect ${socket.id}`)
  //       socket.emit('add-user', currentUser._id)
  //     })
  //     ws.current = socket

  //     return () => {
  //       if (socket.readyState === 1) { // <-- This is important
  //         socket.close()
  //       }
  //     }
  //   }
  // }, [currentUser])

  useEffect(() => {
    const getLocalStorageUser = async () => {
      const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_KEY))
      if (!user) {
        navigate('/login')
      } else if (user.avatarImage === '') {
        navigate('/setting')
      } else {
        setCurrentUser(user)
      }
    }
    getLocalStorageUser()
  }, [navigate])


  useEffect(() => {
    if (currentUser) {
      const fetchMsg = async() => {
        const { data } = await messageAPI.getMessages({
          from: currentUser._id,
          to: chatUserId
        })
        const formatMsg = data.messages.map(msg => ({
          message: msg.message,
          fromSelf: msg.sender === currentUser._id,
          time: msg.updatedAt
        }))
        setMessages(formatMsg)
      }
      fetchMsg()
    }
  }, [currentUser, chatUserId])

  const onMessageSend = async (evt, newMessage) => {
    evt.preventDefault()
    const { data } = await messageAPI.postMessage({
      message: newMessage,
      from: currentUser._id,
      to: chatUserId
    })
    const formatMsg = data.messages.map(msg => ({
      message: msg.message,
      fromSelf: msg.sender === currentUser._id,
      time: msg.updatedAt
    }))
    // TODO: 用 socket 才能同時收到，而不是從 db 撈才有
    // 即時的訊息要看怎麼帶入時間
    setMessages(formatMsg)
  }

  return (
      <ChatWrapper>
        { currentUser && (
          <>
            <ChatHeader chatUserId={chatUserId} />
            <ChatMessages messages={messages} />
            <ChatInput handleMessageSend={onMessageSend} />
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