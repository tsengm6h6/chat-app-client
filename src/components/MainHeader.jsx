import React from 'react'
import styled from 'styled-components'
import { BiSearchAlt, BiGroup, BiCog } from "react-icons/bi"

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
        <button className="icon">
          <BiGroup />
        </button>
        <button className="icon">
          <BiCog />
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
      width: 1.5rem;
      height: 1.5rem;
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
`

export default MainHeader