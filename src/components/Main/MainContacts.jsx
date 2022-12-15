import React, { useContext } from 'react'
import styled from 'styled-components'
import { BiChevronDown, BiChevronUp } from "react-icons/bi"
import ChatContactCard from '../Chat/ChatContactCard'
import ChatContext from '../../chatContext'
import { useEffect } from 'react'
import { useState } from 'react'
import { WsContext } from '../../wsContext'

function MainContacts({ updateContactUnreadCount }) {
  const { userContacts, userRooms, currentUser, chatTarget } = useContext(ChatContext)
  const { value: { onlineUsers } } = useContext(WsContext)

  const [userContactsWithOnlineStatus, setUserContactsWithOnlineStatus] = useState([])
  const [userRoomsWithOnlineStatus, setUserRoomsWithOnlineStatus] = useState([])

  const [showRooms, setShowRooms] = useState(true)
  const [showContacts, setShowContacts] = useState(true)

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
    <CardContainer className={`${chatTarget?._id && 'target-selected'}`}>
      <h2 className='chat'>Chats</h2>
      <div className='chat-wrapper'>
        <div className='chat-category'>
          <div
            className="type"
            onClick={() => setShowRooms(prev => !prev)}>
            Rooms ({userRoomsWithOnlineStatus.length})
            {
              userRoomsWithOnlineStatus.length > 0 &&
              <span className='chevron'>
                { showRooms ? <BiChevronUp /> : <BiChevronDown />}
              </span>
            }
          </div>
          {
            showRooms &&
              <div className="contacts">
                {
                  userRoomsWithOnlineStatus.map((room, index) => (
                      <ChatContactCard
                        key={`${index} - ${room.roomname}`}
                        contact={room}
                        updateContactUnreadCount={ updateContactUnreadCount }
                      />
                  ))
                }
              </div>
          }
        </div>
        <div className="chat-category">
          <div 
            className="type"  
            onClick={() => setShowContacts(prev => !prev)}>
            Contacts ({userContactsWithOnlineStatus.length})
            {
              userContactsWithOnlineStatus.length > 0 &&
              <span className='chevron'>
                { showContacts ? <BiChevronUp /> : <BiChevronDown />}
              </span>
            }
          </div>
          {
            showContacts &&
            <div className="contacts">
              {
                userContactsWithOnlineStatus.map((contact, index) => (
                    <ChatContactCard
                      key={`${index} - ${contact.username}`}
                      contact={contact}
                      updateContactUnreadCount={updateContactUnreadCount}
                    />
                ))
              }
              </div>
          }
        </div>
      </div>
    </CardContainer>
  )
}

const CardContainer = styled.div `
  width: 100%;
  min-height: 0;
  flex: 1;
  display: block;

  &.target-selected {
    display: none;
  }

  @media screen and (min-width: 768px){
    width: 300px;
    flex: 0 0 auto;

    &.target-selected {
      display: block;
    }
  }

  .chat {
    margin: 1rem 0;
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
        cursor: pointer;
      }

      .chevron {
        margin: 2px;
      }

      .contacts {
        height: 100%;
      }
    }
  }
`

export default MainContacts