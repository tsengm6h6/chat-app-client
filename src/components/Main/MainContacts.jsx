import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ChatContactCard from '../Chat/ChatContactCard'
import { userAPI } from '../../api/userApi'
import { roomAPI } from '../../api/roomApi'

function MainContacts({ currentUser }) {
  const [contactUsers, setContactUsers] = useState([])
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const fetchUsers = async() => {
      const { data } = await userAPI.getUsers()
      setContactUsers(data.data.filter(({ _id}) => _id !== currentUser._id))
    }

    const fetchUserRooms = async() => {
      const { data } = await roomAPI.getUserRooms({ userId: currentUser._id })
      console.log('fetch room', data, currentUser._id)
      setRooms(data.data)
    }

    fetchUsers()
    fetchUserRooms()
  }, [currentUser])

  return (
    <CardContainer>
      <h2 className='chat'>Chats</h2>
      <div className='chat-wrapper'>
        <div className='chat-category'>
          <div className="type">Rooms</div>
          <div className="contacts">
            {
              rooms.map((room, index) => (
                  <ChatContactCard
                    key={`${index} - ${room.roomname}`}
                    contact={room}
                  />
              ))
            }
          </div>
        </div>
        <div className="chat-category">
          <div className="type">Contacts</div>
          <div className="contacts">
          {
            contactUsers.map((contact, index) => (
                <ChatContactCard
                  key={`${index} - ${contact.username}`}
                  contact={contact}
                />
            ))
          }
          </div>
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
    height: calc(100vh - 80px);
    overflow-y: auto;
    border-radius: 8px;

    &::-webkit-scrollbar {
      background-color: #080420;
      width: 4px;
      &-thumb {
        background-color: #ffffff34;
        border-radius: 8px;
      }
    }

    .chat-category {
      &:not(:last-child) {
        margin-bottom: 2rem;
      }

      .type {
        color: gray;
        margin-bottom: 8px;
      }

      .contacts {
        height: 100%;
      }
    }
  }
`

export default MainContacts