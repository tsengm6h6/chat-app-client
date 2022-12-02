import React from 'react'
import styled from 'styled-components'

function ChatWelcome() {
  return (
    <ChatWrapper>
      <img src="https://raw.githubusercontent.com/koolkishan/chat-app-react-nodejs/master/public/src/assets/robot.gif" alt="welcome" />
    </ChatWrapper>
  )
}

const ChatWrapper = styled.div `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 500px;
    height: 500px;
    object-fit: cover;
  }
`

export default ChatWelcome