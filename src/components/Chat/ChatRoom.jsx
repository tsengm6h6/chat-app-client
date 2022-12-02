import React, { useState, useEffect, useContext } from 'react'
import ChatHeader from '../Chat/ChatHeader'
import ChatMessages from '../Chat/ChatMessages'
import ChatInput from '../Chat/ChatInput'
import styled from 'styled-components'
import chatContext from '../../chatContext'

function ChatRoom({ chatType, chatTarget, chatRoomUsers, messages, handleMessageSend, handleTyping }) {
  console.log('chatTarget', chatTarget)
  const [chatRoomUsersData, setChatRoomUsersData] = useState([])
  const { userContacts } = useContext(chatContext)

  useEffect(() => {
    if (chatType === 'room' && chatRoomUsers.length > 0) {
      setChatRoomUsersData(
        () => chatRoomUsers.reduce((prev, curr) => {
          const userContact = userContacts.find(contact => contact._id === curr.userId)
          return [...prev, { ...curr, avatarImage: userContact?.avatarImage || null }]
        }, [])
      )
    } else {
      setChatRoomUsersData([])
    }
  }, [chatType, chatRoomUsers, userContacts])

  return (
    <ChatWrapper className=''>
      <ChatHeader
        chatType={chatType}
        chatTarget={chatTarget}
        chatRoomUsersData={chatRoomUsersData} />
      <ChatMessages 
        messages={messages}
        chatRoomUsersData={chatRoomUsersData} />
      <ChatInput 
        handleMessageSend={handleMessageSend}
        handleTyping={handleTyping} />
    </ChatWrapper>
  )
}

const ChatWrapper = styled.div `
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;

  &.hidden {
    display: none;
  }

  @media screen and (min-width: 768px){
    padding: 0 1rem;
  }
`

export default ChatRoom