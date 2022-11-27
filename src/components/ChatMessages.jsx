import React from 'react'
import styled from 'styled-components'

function ChatMessages() {
  return (
    <MessagesWrapper>
      <div className="message sended">
        <p>This is message one.</p>
        <span>time</span>
      </div>
      <div className="message received">
        <p>Message Two is here.</p>
        <span>time</span>
      </div>
      <div className="message received">
        <p>loream</p>
        <span>time</span>
      </div>
      <div className="message sended">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dignissimos voluptatum expedita animi sunt placeat eligendi minus esse pariatur odio, voluptas, dolores explicabo adipisci. Reiciendis commodi minus voluptates animi iure!</p>
        <span>time</span>
      </div>
      <div className="message received">Message Two is here.</div>
      <div className="message received">loream</div>
      <div className="message sended">Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias nam ullam dolores placeat officia illum reiciendis hic voluptas vel debitis possimus reprehenderit corporis id dolore iure enim tempora, necessitatibus deleniti.</div>
    </MessagesWrapper>
  )
}

const MessagesWrapper = styled.div `
  padding: 1rem;
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

  .message {
    border: 1px solid #d1d1d1;
    border: 1px solid #080420;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    max-width: 80%;
    color: #d1d1d1;
    color: #080420;

    span {
      display: block;
      margin-top: 4px;
      color: #888888;
      color: #2d2b39;
      font-size: 14px;
      font-weight: 400;
      text-align: end;
    }

    &.sended {
      align-self: flex-end;
      background-color: #4f04ff21;
      background-color: papayawhip;
    }

    &.received {
      align-self: flex-start;
      background-color: #9900ff20;
      background-color: palevioletred;
    }
  }

`

export default ChatMessages