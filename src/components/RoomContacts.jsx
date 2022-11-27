import React from 'react'
import styled from 'styled-components'
import RoomContactCard from './RoomContactCard'

function RoomContacts() {
  return (
    <CardContainer>
      <h2 className='chat'>Add Friends</h2>
      <div className='chat-wrapper'>
        <div className="contacts">
          <RoomContactCard />
          <RoomContactCard />
          <RoomContactCard />
          <RoomContactCard />
          <RoomContactCard />
          <RoomContactCard />
          <RoomContactCard />
        </div>
      </div>
      <button>Add Room</button>
    </CardContainer>
  )
}

const CardContainer = styled.div `
  background: #00000076;
  width: 100%;
  height: calc(100% - 160px);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  .chat-wrapper {
    flex: 1;
    padding-right: 8px;
    height: 60vh;
    overflow-y: auto;
    border-radius: 20px;

    &::-webkit-scrollbar {
      background-color: #080420;
      width: 4px;
      &-thumb {
        background-color: #ffffff34;
        border-radius: 8px;
      }
    }
  }

  button {
    padding: 0.75rem 2rem;
    margin: 8px auto 0;
    border: none;
    border-radius: 20px 80px / 120px;
    background-color: #997af0;
    color: white;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    transition: all 0.5s ease-out;

    &:hover {
      background-color: #4e0eff;
      border-radius: 20px 20px / 120px;
    }
  }
`

export default RoomContacts