import React from 'react'
import styled from 'styled-components'

function Loading() {
  return (
    <LoadingWrapper>
      <img src="https://raw.githubusercontent.com/koolkishan/chat-app-react-nodejs/master/public/src/assets/loader.gif" alt='loading' />
    </LoadingWrapper>
  )
}

const LoadingWrapper = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;

  img {
    max-width: 60%;
    object-fit: cover;
  }
`

export default Loading