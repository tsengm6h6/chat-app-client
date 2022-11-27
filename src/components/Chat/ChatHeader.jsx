import React from 'react'
import styled from 'styled-components'
import { BiLeftArrowCircle } from "react-icons/bi"
import { Link } from 'react-router-dom'

function ChatHeader({ chatUserId }) {
  return (
    <Header>
      <Link to="/main" className="icon">
        <BiLeftArrowCircle/>
      </Link>
      <div className="room-info">
        <img src="/talking.png" alt="user-avatar" />
        <h1>User Name</h1>
        <span>{chatUserId}</span>
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