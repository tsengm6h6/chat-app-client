import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { BiLeftArrowCircle } from "react-icons/bi"
import ChatContext from '../../chatContext'
import { WsContext } from '../../wsContext'
import { leaveRoom } from '../../socket/emit'

function ChatHeader() {
  const [chatUserHeaderInfo, setChatUserHeaderInfo] = useState({})
  const [chatRoomUsersData, setChatRoomUsersData] = useState([])
  
  const { userContacts, currentUser, chatTarget, setChatTarget } = useContext(ChatContext)
  const { value : { onlineUsers } }= useContext(WsContext)

  // online display
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

  // chatRoom member online display
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

  
  const onClickBack = () => {
    // leave room
    if (chatTarget?.type === 'room' ) {
      leaveRoom({ roomId: chatTarget._id, message:  `${currentUser.username} 已離開聊天`})
    }
    setChatTarget(null)
  }

  return (
    <Header>
      <div onClick={() => onClickBack()} className="icon">
        <BiLeftArrowCircle/>
      </div>
      <div className='room-members'>
        {
          chatRoomUsersData.map(({ _id, avatarImage, isOnline }) => (
            <div 
              key={_id} 
              className={`img-wrapper ${isOnline ? 'online' : 'offline'}`} >
              <img
                src={`data:image/svg+xml;base64,${avatarImage}`} 
                alt="user-avatar" />
            </div>
          ))
        }
      </div>
      <div className="room-info">
        <div className={`avatar-wrapper ${chatUserHeaderInfo.isOnline ? 'online' : 'offline'}`} >
          <img 
            src={`data:image/svg+xml;base64,${chatUserHeaderInfo?.avatarImage}`} 
            alt="user-avatar" />
        </div>
        <h1>{chatUserHeaderInfo.name}</h1>
      </div>
    </Header>
  )
}

const Header = styled.header `
  position: relative;

  .icon {
    position: absolute;
    font-size: 2rem;
    color: #997af0;
    top: 1.5rem;
    left: 1rem;

    @media screen and (min-width: 768px){
      display: none;
    }
  }

  .room-info {
    margin-top: 0.5rem;

    .avatar-wrapper {
      width: 4rem;
      height: 4rem;
      margin: 0 auto;
      transform: scale(1.25);
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
        filter: grayscale(0) drop-shadow(0px 0px 2px #997af0);
        opacity: 1;
        z-index: 2;
      }

      &.offline {
        border: 1px dotted #997af0;
        filter: grayscale(60%);
        opacity: 0.8;
        z-index: 1;
    }
    }

    h1 {
      font-size: 1rem;
      margin: 1rem 0;
      width: 100%;
      text-align: center;
    }
  }

  .room-members {
    position: absolute;
    top: 1.5rem;
    right: 2px;
    display: flex;

    .img-wrapper {
      width: 1.5rem;
      height: 1.5rem;
      transform: scale(1.25);
      border-radius: 50%;
      padding: 1px;
      transition: all 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }

      &.online {
        border: 2px solid #997af0;
        filter: grayscale(0);
        opacity: 1;
        z-index: 2;
      }

      &.offline {
        border: 1px dotted #997af0;
        filter: grayscale(60%);
        opacity: 0.8;
        z-index: 1;
      }
    }

    @media screen and (min-width: 768px){
      .img-wrapper {
        width: 2rem;
        height: 2rem;
        transform: scale(1.25);
      }
    }
  }
`

export default ChatHeader