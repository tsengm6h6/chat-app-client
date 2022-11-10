import React from 'react'
import styled from 'styled-components'

function ChatLoading() {
  return (
    <Loading>
      <img src="https://raw.githubusercontent.com/koolkishan/chat-app-react-nodejs/master/public/src/assets/loader.gif" alt='loading' />
    </Loading>
  )
}

const Loading = styled.div `
  max-width: 60%;

  img {
    width: 100%;
    object-fit: cover;
  }
`

export default ChatLoading