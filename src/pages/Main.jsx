import React from 'react'
import styled from 'styled-components'
import MainHeader from '../components/MainHeader'
import ChatContacts from '../components/ChatContacts'

function Main() {
  return (
    <MainContainer>
      <MainHeader />
      <ChatContacts />
    </MainContainer>
  )
}

const MainContainer = styled.div `
  width: 100%;
  height: 100%;
`

export default Main