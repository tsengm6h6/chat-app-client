import React, { useState, useEffect, useContext } from 'react'
import ChatHeader from '../Chat/ChatHeader'
import ChatMessages from '../Chat/ChatMessages'
import ChatInput from '../Chat/ChatInput'
import styled from 'styled-components'
import ChatContext from '../../chatContext'
import { toastNormal } from '../../utils/toastOptions'
import { messageAPI } from '../../api/messageApi'

import { WsContext } from '../../wsContext'
import { sendMessage } from '../../socket/emit'

function ChatRoom() {
  console.log('chat room render')

  const [messages, setMessages] = useState([])

  const { currentUser, chatTarget, setChatTarget } = useContext(ChatContext)
  const { value : { messageFromSocket, roomNotify } , setValue } = useContext(WsContext)

  // get history message
  useEffect(() => {
    if (currentUser && chatTarget) {
      const fetchMsg = async() => {
        const { data } = await messageAPI.getMessages({
          type: chatTarget.type,
          from: currentUser._id,
          to: chatTarget._id,
        })
        setMessages(formatMsg(data))
      }
      const formatMsg = (data) => {
        return data.messages.map(msg => ({
          message: msg.message,
          fromSelf: msg.sender === currentUser._id,
          sender: msg.sender,
          time: msg.updatedAt,
        }))
      }
      fetchMsg()
    }
  }, [currentUser, chatTarget, setChatTarget])

  // message send & receive
  useEffect(() => {
    const { type, message, senderId, time } = messageFromSocket
    if (type === 'room' || (type === 'user' && senderId === chatTarget._id)) {
        setMessages(prev => [...prev, {
        message,
        fromSelf: false,
        sender: senderId,
        time
      }])
    }
  }, [messageFromSocket, chatTarget])

  const onMessageSend = async (evt, newMessage) => {
    evt.preventDefault()
    const { data } = await messageAPI.postMessage({
        type: chatTarget.type,
        from: currentUser._id,
        to: chatTarget._id
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

    // 用 socket 即時通知對方
    sendMessage({
      type: chatTarget.type,
      message: newMessage,
      senderId: currentUser._id,
      receiverId: chatTarget._id,
      time: new Date().toISOString()
    })
  }

  // roomNotify
  useEffect(() => {
    if (roomNotify !== '' && chatTarget.type === 'room') {
      toastNormal(roomNotify)
      setValue(prevState => ({
        ...prevState,
        roomNotify: ''
      }))
    }
  }, [roomNotify, chatTarget, setValue])

  return (
    <ChatWrapper className={`${chatTarget?._id && 'target-selected'}`}>
        <ChatHeader />
        <ChatMessages 
          messages={messages} />
        <ChatInput 
          handleMessageSend={onMessageSend} />
    </ChatWrapper>
  )
}

const ChatWrapper = styled.div `
  width: 100%;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  display: none;

  &.target-selected {
    display: flex;
  }

  @media screen and (min-width: 768px){
    display: flex;
    padding: 0 1rem;
  }
`

export default ChatRoom