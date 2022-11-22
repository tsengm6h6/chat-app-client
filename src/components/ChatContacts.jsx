import React from 'react'
import styled from 'styled-components'
import ChatContactCard from './ChatContactCard'

function ChatContacts() {
  return (
    <CardContainer>
      <h2 className='chat'>Chats</h2>
      <div className='chat-wrapper'>
        <div className='chat-category'>
          <div className="type">Rooms</div>
          <div className="contacts">
            <ChatContactCard />
            <ChatContactCard />
          </div>
        </div>
        <div className="chat-category">
          <div className="type">Contacts</div>
          <div className="contacts">
            <ChatContactCard />
            <ChatContactCard />
            <ChatContactCard />
            <ChatContactCard />
            <ChatContactCard />
            <ChatContactCard />
            <ChatContactCard />
          </div>
        </div>
      </div>
    </CardContainer>
  )
}

const CardContainer = styled.div `
  background: #00000076;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 1.5rem 1rem;
  /* background-color: whitesmoke; */

  .chat {
    margin-bottom: 1rem;
  }

  .chat-wrapper {
    padding: 1rem 8px 5.5rem 4px;
    height: calc(100vh - 80px);
    overflow-y: auto;
    border-radius: 8px;

    &::-webkit-scrollbar {
      background-color: #080420;
      width: 6px;
      &-thumb {
        background-color: #ffffff34;
        border-radius: 8px;
      }
    }

    .chat-category {
      &:not(:last-child) {
        margin-bottom: 2rem;
      }

      .type {
        color: gray;
        margin-bottom: 8px;
      }

      .contacts {
        height: 100%;
      }
    }
  }
`

export default ChatContacts