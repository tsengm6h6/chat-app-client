import React from 'react'
import styled from 'styled-components'
import { BiLeftArrowCircle } from "react-icons/bi"

function ChatHeader({ handleContactSelected, chatUserHeaderInfo, chatRoomUsersData }) {
  
  const onClickBack = () => {
    handleContactSelected(null)
  }

  return (
    <Header>
      <div onClick={onClickBack} className="icon">
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