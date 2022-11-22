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
        <div>
          <button>Add Room</button>
        </div>
      </div>
    </CardContainer>
  )
}

const CardContainer = styled.div `
  background: #00000076;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 1.5rem 1rem;
  /* background-color: whitesmoke; */

  .chat {
    margin-bottom: 1rem;
  }

  .chat-wrapper {
    padding: 1rem 8px 5.5rem 4px;
    height: calc(100vh - 160px);
    overflow-y: auto;
    border-radius: 8px;

    &::-webkit-scrollbar {
      background-color: #080420;
      width: 6px;
      &-thumb {
        background-color: #ffffff34;
        border-radius: 8px;
      }
    }

    .chat-category {
      margin-bottom: 2rem;
      
      &:last-child {
        margin-bottom: 5rem;
      }

      .type {
        color: gray;
        margin-bottom: 8px;
      }

      .contacts {
        height: 100%;
      }
    }

    button {
      display: block;
      margin: 1rem auto;
      padding: 0.75rem 2rem;
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
  }
`

export default RoomContacts