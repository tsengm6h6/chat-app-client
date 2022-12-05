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
  height: calc(100vh - 60px);

  img {
    max-width: 40%;
    object-fit: cover;

    @media screen and (min-width: 768px) {
      max-width: 60%;
    }
  }
`

export default Loading