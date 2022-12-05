import React from 'react'
import styled from 'styled-components'
import { BiLeftArrowCircle } from "react-icons/bi"
import { Link } from 'react-router-dom'

function RoomHeader({ roomAvatar, roomName, handleRoomNameChange }) {
  return (
    <Header>
      <Link to="/" className="icon">
        <BiLeftArrowCircle/>
      </Link>
      <div className="room-info">
        <img src={`data:image/svg+xml;base64,${roomAvatar}`} alt="room-avatar" />
        <input 
          type="text" 
          placeholder='Input a room name...' 
          name='roomName' 
          value={roomName}
          onChange={(evt) => handleRoomNameChange(evt.target.value)} />
      </div>
    </Header>
  )
}

const Header = styled.header `
  grid-row: 1 / 2;
  padding: 1.5rem 1rem;
  position: relative;

  @media screen and (min-width: 768px) {
    grid-column: 2 / 3;
    background: #00000076;
    padding: 1.5rem 1rem 0.5rem;
    border-top-right-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    position: absolute;
    font-size: 2rem;
    color: #997af0;
    top: 1.5rem;
    left: 1rem;
  }

  .room-info {
    margin: 1rem 0;
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

      @media screen and (min-width: 768px) {
        width: 10rem;
        height: 10rem;
      }
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

      @media screen and (min-width: 768px) {
        margin-top: 1rem;
      }
    }
  }
`

export default RoomHeader