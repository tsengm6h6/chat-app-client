import React, { useState } from 'react'
import styled from 'styled-components'
import { BiLeftArrowCircle } from "react-icons/bi"
import { Link } from 'react-router-dom'

function RoomHeader() {
  const [roomName, setRoomName] = useState('')

  return (
    <Header>
      <Link to="/main" className="icon">
        <BiLeftArrowCircle/>
      </Link>
      <div className="room-info">
        <img src="/talking.png" alt="room-avatar" />
        <input 
          type="text" 
          placeholder='Input a room name...' 
          name='roomName' 
          value={roomName}
          onChange={(evt) => setRoomName(evt.target.value)} />
      </div>
    </Header>
  )
}

const Header = styled.header `
  padding: 1.5rem 1rem;
  position: relative;

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

    input {
      font-size: 1rem;
      max-width: 200px;
      padding: 0.5rem 1rem;
      background-color: #00000076;
      border: none;
      border-radius: 8px;
      outline: none;
      color: white;
    }
  }
`

export default RoomHeader