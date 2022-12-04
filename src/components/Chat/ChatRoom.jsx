import React, { useState, useEffect, useContext } from 'react'
import ChatHeader from '../Chat/ChatHeader'
import ChatMessages from '../Chat/ChatMessages'
import ChatInput from '../Chat/ChatInput'
import styled from 'styled-components'
import chatContext from '../../chatContext'

function ChatRoom({ chatTarget, handleContactSelected, onlineUsers, messages, handleMessageSend, isTyping, handleTyping }) {
  console.log('chat room render')
  const [chatRoomUsersData, setChatRoomUsersData] = useState([])
  const [chatUserHeaderInfo, setChatUserHeaderInfo] = useState({})

  const { userContacts, currentUser } = useContext(chatContext)

  useEffect(() => {
    if (chatTarget) {
      setChatUserHeaderInfo({
        ...chatTarget,
        name: chatTarget.type === 'room' ? chatTarget.roomname : chatTarget.username,
        isOnline: chatTarget.type === 'room' 
          ? chatTarget.users
            .filter(userId => userId !== currentUser._id)
            .some(userId => onlineUsers.indexOf(userId) > -1) // 聊天室有人上線就亮燈
          : onlineUsers.indexOf(chatTarget._id) > -1 // 一對一上線才亮燈
      })
    }
  }, [onlineUsers, chatTarget, currentUser])

  useEffect(() => {
    if (chatTarget.type === 'room' && chatTarget.users.length > 0) {
      setChatRoomUsersData(
        () => chatTarget.users
        .filter(userId => userId !== currentUser._id)
        .map(userId => {
          const userContact = userContacts.find(contact => contact._id === userId)
          return {
            ...userContact,
            avatarImage: userContact?.avatarImage  || '',
            isOnline: onlineUsers.indexOf(userId) > -1
          }
        })
      )
    } else {
      setChatRoomUsersData([])
    }
  }, [chatTarget, userContacts, currentUser, onlineUsers])

  return (
    <ChatWrapper className={`chat-control ${chatTarget?._id && 'target-selected'}`}>
      { chatTarget && (
        <>
        <ChatHeader
          handleContactSelected={handleContactSelected}
          chatUserHeaderInfo={chatUserHeaderInfo}
          chatRoomUsersData={chatRoomUsersData} />
        <ChatMessages 
          messages={messages}
          chatRoomUsersData={chatRoomUsersData} />
        <ChatInput 
          handleMessageSend={handleMessageSend}
          isTyping={isTyping}
          handleTyping={handleTyping} />
        </>
      )}
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

  &.chat-control {
    display: none;

    &.target-selected {
      display: flex;
    }

    @media screen and (min-width: 768px){
      display: flex;
    }
  }

  @media screen and (min-width: 768px){
    padding: 0 1rem;
  }
`

export default ChatRoom