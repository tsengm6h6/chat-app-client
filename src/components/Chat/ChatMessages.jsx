import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import ChatContext from '../../chatContext'

function ChatMessages({ messages }) {
  const { userContacts } = useContext(ChatContext)
  const [messagesWithAvatar, setMessageWithAvatar] = useState([])
  const messageEl = useRef()

  const timeFormatter = (time) => {
    if (!time) return
    const [hour, min] = time.split('T')[1].split(':')
    return hour + ':' + min
  }

  useEffect(() => {
    setMessageWithAvatar(messages.map(msg => ({ 
      ...msg,
      avatar: userContacts.find(({ _id }) => msg.sender === _id)?.avatarImage || null
    })))
  }, [messages, userContacts])

  useEffect(() => {
    messageEl.current?.scrollIntoView({ behavior: 'smooth' })
  },[messages, messagesWithAvatar])

  return (
    <MessagesWrapper>
      {
        messagesWithAvatar.map((msg, index) => (
          <div
            ref={messageEl}
            key={index}
            className={`message-wrapper ${msg.fromSelf ? 'sended' : 'received'}`}>
            { 
              !msg.unread && msg.fromSelf &&
              <span>已讀</span>
            }
            <span>{timeFormatter(msg.time)}</span>
            <div
              className={`message ${msg.fromSelf ? 'sended' : 'received'}`}>
              <p>{msg.message}</p>
            </div>
            { ! msg.fromSelf && 
              <img 
                src={`data:image/svg+xml;base64,${msg.avatar}`} 
                alt="user-avatar"
                className="avatar" />
            }
          </div>
        ))
      }
    </MessagesWrapper>
  )
}

const MessagesWrapper = styled.div `
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;

  &::-webkit-scrollbar {
      background-color: #080420;
      width: 4px;
      &-thumb {
        background-color: #ffffff34;
        border-radius: 8px;
      }
    }

  .message-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 4px;

    &.sended {
      align-self: flex-end;
    }

    &.received {
      align-self: flex-start;
      flex-direction: row-reverse;
    }

    span {
      display: block;
      margin-top: 4px;
      color: #878688;
      font-size: 12px;
      font-weight: 300;
      text-align: end;
      letter-spacing: 1px;
    }
  }

  .message {
    border: 1px solid #d1d1d1;
    border: 1px solid #080420;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    max-width: 80%;
    color: #d1d1d1;
    color: #080420;

    &.sended {
      background-color: #4f04ff21;
      background-color: papayawhip;
    }

    &.received {
      background-color: #9900ff20;
      background-color: palevioletred;
    }
  }

  .avatar {
    width: 2rem;
    height: 2rem;
    margin: 2px;
  }
`

export default ChatMessages