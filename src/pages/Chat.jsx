import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const ws = useRef(null)

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_SERVER_URL}`)
    socket.on('connect', () => {
      console.log(`socket connect ${socket.id}`)
      ws.current = socket
      if (currentUser) {
        socket.emit('add-user', currentUser._id)
      }
    })

    const handler = ({ message, from }) => {
      if (chatTarget?._id === from) { // 如果正在聊天的人和傳訊的人相同才加入顯示
        setMessages(prevMessages  => [...prevMessages, {
          message,
          fromSelf: false,
          time: new Date().toISOString()
        }])
      }
    }

    socket.on('client-receive-msg',handler)
    return () => {
      socket.off('client-receive-msg',handler)
      socket.disconnect()
    }
  }, [ws, currentUser, chatTarget])

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


  useEffect(() => {
    if (currentUser) {
      const fetchMsg = async() => {
        const { data } = await messageAPI.getMessages({
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
      fetchMsg()
    }
  }, [currentUser, chatTarget])

  const onMessageSend = async (evt, newMessage) => {
    evt.preventDefault()
    const { data } = await messageAPI.postMessage({
      message: newMessage,
      from: currentUser._id,
      to: chatTarget._id
    })
    // TODO: 用 socket 才能同時收到，而不是從 db 撈才有
    ws.current.emit('input-message', {
      message: newMessage,
      from: currentUser._id,
      to: chatTarget._id
    })
    const formatMsg = data.messages.map(msg => ({
      message: msg.message,
      fromSelf: msg.sender === currentUser._id,
      time: msg.updatedAt
    }))
    // 即時的訊息要看怎麼帶入時間
    setMessages(formatMsg)
  }

  return (
      <ChatWrapper>
        { currentUser && (
          <>
            <ChatHeader />
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