import React, { useEffect, useContext } from 'react'
import ChatHeader from '../Chat/ChatHeader'
import ChatMessages from '../Chat/ChatMessages'
import ChatInput from '../Chat/ChatInput'
import styled from 'styled-components'
import ChatContext from '../../chatContext'
import { toastError, toastNormal } from '../../utils/toastOptions'
import { messageAPI } from '../../api/messageApi'

import { WsContext } from '../../wsContext'
import { sendMessage, updateMessageStatus } from '../../socket/emit'

function ChatRoom({ messages, setMessages, updateContactLatestMessage }) {
  console.log('chat room render')

  const { currentUser, chatTarget, fetchContacts } = useContext(ChatContext)
  const { value : { roomNotify } , setValue } = useContext(WsContext)
  
  // 更新已讀、contact 未讀數
  useEffect(() => {
    console.log('chat room', chatTarget)
    if (chatTarget?._id) {
      messageAPI.updateReadStatus({ receiverId: currentUser._id })
      console.log('=== 更新已讀、socket 傳送已讀通知 ===')
      updateMessageStatus({ 
        type: chatTarget.type,
        readerId: currentUser._id,
        messageSender: chatTarget._id
      })
    }
  }, [currentUser, chatTarget, fetchContacts])

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
          unread: msg.unread
        }))
      }
      fetchMsg()
    }
  }, [currentUser, chatTarget, setMessages])

  const onMessageSend = async (evt, newMessage) => {
    evt.preventDefault()
    if (!newMessage) {
      return toastError('message is required !')
    }
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
      time: msg.updatedAt,
      unread: msg.unread
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

    updateContactLatestMessage({
      type: chatTarget.type,
      contactId: chatTarget._id, 
      message: newMessage, 
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