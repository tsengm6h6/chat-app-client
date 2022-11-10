import React from 'react'
import styled from 'styled-components'
import { BiLogOutCircle } from "react-icons/bi";

function ChatHeader({ chatUser, handleLogout }) {
  return (
    <HeaderContainer>
      <div className="user">
        <img src={`data:image/svg+xml;base64,${chatUser.avatarImage}`} alt='user-avatar'/>
        <h3>{chatUser.username}</h3>
      </div>
      <button className="logout" onClick={handleLogout}>
        <BiLogOutCircle className='logout-icon'/>
      </button>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;

    .user {
      display: flex;
      align-items: center;

      h3 {
        font-weight: 400;
        text-transform: capitalize;
      }

      img {
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
        margin-right: 0.5rem;
        object-fit: cover;
      }
    }

    .logout {
      width: 2rem;
      height: 2rem;
      font-size: 1rem;
      transform: rotate(90deg);
      background-color: #9a86f3;
      color: white;
      border-radius: 4px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all .2s ease-in;

      &:focus {
        outline: none;
      }

      &:hover {
        background-color: #b1a2f0;
      }
    }
`

export default ChatHeader