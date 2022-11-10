import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import { messageAPI } from '../api/messageApi'
import { useNavigate } from 'react-router-dom'

function ChatContainer({ currentUser, chatUser, socket }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const messagesRef = useRef(messages)
  const messageEl = useRef()

  useEffect(() => {
    const fetchMsg = async() => {
      const { data } = await messageAPI.getMessages({
        from: currentUser._id,
        to: chatUser._id
      })
      const formatMsg = data.messages.map(msg => ({
        message: msg.message,
        fromSelf: msg.sender === currentUser._id
      }))
      setMessages(formatMsg)
    }
    fetchMsg()
  }, [currentUser, chatUser])

  const handleMessageSend = async (evt, currentMessage) => {
    evt.preventDefault()
    // 打 API 存 DB
    await messageAPI.postMessage({
      message: currentMessage,
      from: currentUser._id,
      to: chatUser._id
    })
    // 新增 fromSelf 屬性
    setMessages((prev) => ([...prev, {
      message: currentMessage,
      fromSelf: true
    }]))

    // socket emit
    socket.current.emit('input-message', {
      message: currentMessage,
      from: currentUser._id,
      to: chatUser._id
    })
  }

  const handleLogout = () => {
    socket.current.emit('logout', currentUser._id)
    localStorage.removeItem(process.env.REACT_APP_LOCAL_KEY)
    navigate('/login')
  }

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    const handler = ({ message, from }) => {
      if (chatUser._id === from) { // 如果正在聊天的人和傳訊的人相同才加入顯示
        setMessages([...messagesRef.current, {
          message,
          fromSelf: false
        }])
      }
    }
    const currentWs = socket.current
    currentWs.on('client-receive-msg',handler)
    return () => {
      currentWs.off('client-receive-msg',handler)
    }
  }, [chatUser])

  useEffect(() => {
    messageEl.current?.scrollIntoView({ behavior: 'smooth' })
  },[messages])

  return (
    <ChatWrapper>
      <ChatHeader 
        chatUser={chatUser} 
        handleLogout={handleLogout} />
      <div className='messages'>
        { messages.length > 0 && messages.map((msg, index) => (
          <p ref={messageEl} className={`message ${msg.fromSelf ? 'sended' : 'received'}`}
             key={index}>
            {msg.message}
          </p>
        ))}
      </div>
      <ChatInput handleMessageSend={handleMessageSend} />
    </ChatWrapper>
  )
}

const ChatWrapper = styled.div `
  background-color: #080420;
  display: grid;
  grid-template-rows: 15% 75% 10%;
  gap: 4px;
  overflow: hidden;

  .messages {
    padding: 0 1rem;
    font-size: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow: auto;

    &::-webkit-scrollbar {
        background-color: #080420;
        width: 6px;
        &-thumb {
          background-color: #ffffff34;
          border-radius: 8px;
        }
      }

    .message {
      padding: 0.5rem 1rem;
      color: #d1d1d1;
      color: #080420;
      border-radius: 20px;
      max-width: 48%;
      line-break: anywhere;
      line-height: 1.25rem;

      &.sended {
        background-color: #4f04ff21;
        background-color: papayawhip;
        align-self: flex-end;
      }

      &.received {
        background-color: #9900ff20;
        background-color: palevioletred;
        align-self: flex-start;
      }
    }
  }
`

export default ChatContainer