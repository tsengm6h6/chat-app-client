import React from 'react'
import styled from 'styled-components'
import RoomContacts from '../components/RoomContacts'
import RoomHeader from '../components/RoomHeader'

function Room() {
  return (
    <RoomContainer>
      <RoomHeader />
      <RoomContacts />
    </RoomContainer>
  )
}

const RoomContainer = styled.div `
  width: 100%;
  height: 100%;
`

export default Room