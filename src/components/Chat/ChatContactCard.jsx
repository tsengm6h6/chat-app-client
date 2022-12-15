import React, { useContext } from 'react'
import styled from 'styled-components'
import ChatContext from '../../chatContext'
import { enterRoom, leaveRoom } from '../../socket/emit'

function ChatContactCard({ contact, updateContactUnreadCount }) {
  const { currentUser, chatTarget, setChatTarget } = useContext(ChatContext)

  const timeFormatter = (time) => {
    if (!time) return
    const [hour, min] = time.split('T')[1].split(':')
    return hour + ':' + min
  }

  const onContactClick = async (contact) => {
    // enter room
    if (contact.type === 'room' && contact._id !== chatTarget?._id) {
      enterRoom({ roomId: contact._id, message: `${currentUser.username} 已加入聊天` })
    }
    // leave room
    if (chatTarget?.type === 'room' && contact._id !== chatTarget?._id) {
      leaveRoom({ roomId: chatTarget._id, message:  `${currentUser.username} 已離開聊天`})
    }

    updateContactUnreadCount(contact._id, 0, contact.type)
    setChatTarget(contact)
  }

  return (
    <Card onClick={() => onContactClick(contact)}>
      <div className={`avatar-wrapper ${contact.isOnline ? 'online' : 'offline'}`}>
        {
          contact.avatarImage
          ? <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt='user-avatar'/>
          : <img src="/user.png" alt="default-avatar" />
        }
      </div>
      <div className='user-wrapper'>
        <h2 className='user-name'>{contact.username || contact.roomname}</h2>
        <p className='user-message truncate'>{contact.latestMessage || ''}</p>
      </div>
      <div className="unread-wrapper">
        { contact?.unreadCount !== 0 &&
          <div className='notify'>
            <span>{contact.unreadCount}</span>
          </div>
        }
        <span className='time'>{contact.latestMessageUpdatedAt ? timeFormatter(contact.latestMessageUpdatedAt) : ''}</span>
      </div>
    </Card>
  )
}


const Card = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 250px;
  padding: 0.75rem;
  background-color: #131324;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    position: relative;
    bottom: 1px;
  }

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  .avatar-wrapper {
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
    padding: 4px;
    transition: all 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    &.online {
      border: 2px solid #997af0;
      filter: grayscale(0) drop-shadow(0px 0px 4px #997af0);
      opacity: 1;
    }

    &.offline {
      border: 2px dotted #997af0;
      filter: grayscale(60%);
      opacity: 0.8;
    }
  }

  .user-wrapper {
    flex-grow: 1;
    padding-right: 8px;

    .user-name {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .user-message {
      flex-wrap: wrap;
      font-size: 1rem;
      color: gray;
      
      // TODO:
      .truncate { 
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
      }
    }
  }

  .unread-wrapper {
    align-self: flex-end;
  }

  .notify {
    width: 1.25rem;
    height: 1.25rem;
    line-height: 1.25rem;
    font-size: 0.75rem;
    border-radius: 50%;
    background-color: #997af0;
    text-align: center;
    margin-left: auto;
    margin-bottom: 0.5rem;
  }

  .time {
    display: block;
    color: gray;
    font-size: 0.5rem;
    font-weight: 300;
    margin-bottom: 4px;
  }
`

export default ChatContactCard