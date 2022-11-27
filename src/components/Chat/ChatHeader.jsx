import React, { useContext } from 'react'
import styled from 'styled-components'
import { BiLeftArrowCircle } from "react-icons/bi"
import { Link } from 'react-router-dom'
import ChatContext from '../../chatContext'

function ChatHeader() {
  const { chatTarget } = useContext(ChatContext)

  return (
    <Header>
      <Link to="/main" className="icon">
        <BiLeftArrowCircle/>
      </Link>
      <div className="room-info">
        <img src={`data:image/svg+xml;base64,${chatTarget.avatarImage}`} alt="user-avatar" />
        <h1>{chatTarget.username}</h1>
      </div>
    </Header>
  )
}

const Header = styled.header `
  padding: 1.5rem 1rem;
  position: relative;
  background-color: #131324;

  .icon {
    position: absolute;
    font-size: 2rem;
    color: #997af0;
    top: 1.5rem;
    left: 1rem;
  }

  .room-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    img {
      width: 4rem;
      height: 4rem;
      background-color: papayawhip;
      border-radius: 50%;
    }

    h1 {
      font-size: 1rem;
      max-width: 200px;
    }
  }
`

export default ChatHeader