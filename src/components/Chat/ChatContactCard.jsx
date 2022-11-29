import React, { useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import ChatContext from '../../chatContext'

function ChatContactCard({ contact }) {
  const navigate = useNavigate()
  const { setChatTarget } = useContext(ChatContext)

  const handleCardClick = () => {
    setChatTarget(contact)
    navigate(`/chat?${contact.username ? 'user' : 'room'}=${contact._id}`)
  }

  return (
    <Card onClick={handleCardClick}>
      <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt='user-avatar'/>
      <div className='wrapper user-wrapper'>
        <h2 className='user-name'>{contact.username || contact.roomname}</h2>
        <p className='user-message truncate'>Lorem ipsum dolor sit amet?</p>
      </div>
      <div className="wrapper">
        <span className='time'>time</span>
        <div className='notify'>
          <span>4</span>
        </div>
      </div>
    </Card>
  )
}


const Card = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 250px;
  padding: 0.75rem;
  background-color: #131324;
  border-radius: 8px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  img {
    height: 4rem;
    width: 4rem;
  }

  .user-wrapper {
    flex-grow: 1;
    padding-right: 8px;

    .user-name {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .user-message {
      flex-wrap: wrap;
      font-size: 1rem;
      color: gray;
      
      // TODO:
      .truncate { 
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
      }
    }
  }

  .time,
  .notify {
    display: block;
  }

  .time {
    font-size: 1rem;
    color: gray;
    margin-bottom: 8px;
  }

  .notify {
    width: 1.25rem;
    height: 1.25rem;
    line-height: 1.25rem;
    font-size: 0.75rem;
    border-radius: 50%;
    background-color: #997af0;
    text-align: center;
    margin-left: auto;
  }
`

export default ChatContactCard