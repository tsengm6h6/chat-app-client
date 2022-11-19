import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { userAPI } from '../api/userApi'
import BrandLogo from './BrandLogo'

function ChatContact({ currentUser, handleChatSelect, chatUser }) {
  const [contactUsers, setContactUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async() => {
      const { data } = await userAPI.getUsers()
      setContactUsers(data.data.filter(({ _id}) => _id !== currentUser._id))
    }

    fetchUsers()
  }, [currentUser])

  return (
    <ContactWrapper>
      <div className='user'>
        <img src={`data:image/svg+xml;base64,${currentUser.avatarImage}`} alt='user-avatar'/>
        <h1>{currentUser.username}</h1>
      </div>
      <div className='contacts'>
        { contactUsers.map((user) => (
          <div 
            className={`contact ${chatUser && chatUser._id === user._id && 'selected'}`}
            key={user._id} 
            onClick={() => handleChatSelect(user)}>
            <img src={`data:image/svg+xml;base64,${user.avatarImage}`} alt='user-avatar'/>
            <p>{user.username}</p>
          </div>
        ))}
      </div>
      <BrandLogo />
    </ContactWrapper>
  )
}

const ContactWrapper = styled.div `
 background-color: #080420;
 display: grid;
 grid-template-rows: 12% 73% 15%;
 overflow: hidden;
 padding: 1rem;
 gap: 8px;

 .user, .contacts, .brand {
    img {
      border-radius: 50%;
      margin-right: 0.5rem;
      object-fit: cover;
    }
 }

 .user {
    display: flex;
    align-items: center;
    justify-content: center;

    h1 {
      font-size: 1.5rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    img {
      height: 4rem;
      width: 4rem;
    }
 }

 .contacts {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: scroll;
    padding: 0 1rem 0.5rem;

      &::-webkit-scrollbar {
        width: 0.5rem;
        &-thumb {
          background-color: #ffffff39;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }

    .contact {
      display: flex;
      align-items: center;
      background-color: #ffffff34;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.5s ease-in-out;

      &.selected {
        background-color: #9a86f3;
      }
    }

    img {
      height: 4rem;
      width: 4rem;
    }
 }
`

export default ChatContact