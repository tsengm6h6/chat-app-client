import React from 'react'
import styled from 'styled-components'
import { BiSearchAlt, BiGroup, BiCog, BiLogOutCircle } from "react-icons/bi"
import { Link } from 'react-router-dom'

function MainHeader() {
  return (
    <Header>
      <div className="user-card">
        <img src="/talking.png" alt="user-avatar" />
        <h1>User name</h1>
      </div>
      <div className='icons'>
        <button className="icon">
          <BiSearchAlt />
        </button>
        <Link to="/room" className="icon">
          <BiGroup />
        </Link>
        <button className="icon">
          <BiCog />
        </button>
        <button className="icon logout">
          <BiLogOutCircle />
      </button>
      </div>
    </Header>
  )
}

const Header = styled.header `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;

  .user-card {
    display: flex;
    align-items: center;
    gap: 8px;

    img {
      width: 2rem;
      height: 2rem;
    }

    h1 {
      font-size: 1rem;
    }
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: 50%;
      /* background-color: white; */
      background-color: #00000076;
      color: #997af0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      
        &:hover, &:active {
          box-shadow: 1px 1px 2px #997af0;
        } 
    }
  }

  .logout {
    transform: rotate(180deg);
  }
`

export default MainHeader