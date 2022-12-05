import React from 'react'
import styled from 'styled-components'
import RoomContactCard from './RoomContactCard'

function RoomContacts({ contacts, handleUserSelected, handleAddRoom }) {
  return (
    <CardContainer>
      <h2 className='chat'>Add Friends</h2>
      <div className='chat-wrapper'>
        <div className="contacts hidden">
        {
          contacts.map((contact, index) => (
            <RoomContactCard
              key={`${index} - ${contact.username}`}
              handleUserSelected={handleUserSelected}
              contact={contact} />
          ))
        }
        </div>
      </div>
    </CardContainer>
  )
}

const CardContainer = styled.div `
  grid-row: 2 / 3;
  overflow: hidden;
  background: #00000076;
  padding: 1.5rem 1rem 0.5rem;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  @media screen and (min-width: 768px) {
    grid-row: 1 / 3;
    grid-column: 1 / 2;
    border-top-right-radius: 0;
  }

  .hidden {
    /* display: none; */
  }

  .chat {
    margin: 1rem 0;
  }

  .chat-wrapper {
    height: calc(100% - 40px);
    overflow-y: auto;
    padding: 0 16px 0 12px;

    &::-webkit-scrollbar {
      background-color: #080420;
      width: 4px;
      &-thumb {
        background-color: #ffffff34;
        border-radius: 8px;
      }
    }
  }
`

export default RoomContacts