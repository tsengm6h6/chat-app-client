import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

function ChatMessages({ messages, chatRoomUsersData }) {
  const messageEl = useRef()

  const timeFormatter = (time) => {
    const [hour, min] = time.split('T')[1].split(':')
    return hour + ':' + min
  }

  useEffect(() => {
    messageEl.current?.scrollIntoView({ behavior: 'smooth' })
  },[messages])

  return (
    <MessagesWrapper>
      {
        messages.map((msg, index) => (
          <div
            key={index}
            className={`message-wrapper ${msg.fromSelf ? 'sended' : 'received'}`}>
            <span>{timeFormatter(msg.time)}</span>
            {` sender: ${msg.sender}`}
            <div
              ref={messageEl}
              className={`message ${msg.fromSelf ? 'sended' : 'received'}`}>
              <p>{msg.message}</p>
            </div>
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

`

export default ChatMessages