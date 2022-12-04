import React, { useContext } from 'react'
import styled from 'styled-components'
import ChatContactCard from '../Chat/ChatContactCard'
import ChatContext from '../../chatContext'
import { useEffect } from 'react'
import { useState } from 'react'

function MainContacts({ chatTarget, onlineUsers, handleContactSelected }) {
  const { userContacts, userRooms, currentUser } = useContext(ChatContext)
  const [userContactsWithOnlineStatus, setUserContactsWithOnlineStatus] = useState([])
  const [userRoomsWithOnlineStatus, setUserRoomsWithOnlineStatus] = useState([])

  useEffect(() => {
    setUserContactsWithOnlineStatus(
      userContacts.map(contact => ({ 
        ...contact, 
        isOnline : onlineUsers.indexOf(contact._id) > -1
      }))
    )
  }, [onlineUsers, userContacts])

  useEffect(() => {
    setUserRoomsWithOnlineStatus(
      userRooms.map(contact => ({ 
        ...contact, 
        isOnline : contact.users
        .filter(user => user !== currentUser._id)
        .some(userId => onlineUsers.indexOf(userId) > -1)
      }))
    )
  }, [onlineUsers, userRooms, currentUser])

  return (
    <CardContainer className={`chat-control ${chatTarget?._id && 'target-selected'}`}>
      <h2 className='chat'>Chats</h2>
      <div className='chat-wrapper'>
        <div className='chat-category'>
          <div className="type">Rooms</div>
          <div className="contacts">
            {
              userRoomsWithOnlineStatus.map((room, index) => (
                  <ChatContactCard
                    key={`${index} - ${room.roomname}`}
                    contact={room}
                    handleContactSelected={handleContactSelected}
                  />
              ))
            }
          </div>
        </div>
        <div className="chat-category">
          <div className="type">Contacts</div>
          <div className="contacts">
          {
            userContactsWithOnlineStatus.map((contact, index) => (
                <ChatContactCard
                  key={`${index} - ${contact.username}`}
                  contact={contact}
                  handleContactSelected={handleContactSelected}
                />
            ))
          }
          </div>
        </div>
      </div>
    </CardContainer>
  )
}

const CardContainer = styled.div `
  width: 100%;
  min-height: 0;
  flex: 1;

  &.chat-control {
    display: block;

    &.target-selected {
      display: none;
    }

    @media screen and (min-width: 768px){
      &.target-selected {
        display: block;
      }
    }
  }

  @media screen and (min-width: 768px){
    width: 300px;
    flex: 0 0 auto;
  }

  .chat {
    margin-bottom: 1rem;
  }

  .chat-wrapper {
    padding: 0 12px 8px;
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
    border-radius: 8px;

    @media screen and (min-width: 768px){
      height: calc(100% - 40px);
    }

    &::-webkit-scrollbar {
      background-color: #080420;
      width: 4px;
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

export default MainContacts