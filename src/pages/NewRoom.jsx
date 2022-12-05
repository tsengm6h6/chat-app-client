import React, { useContext } from 'react'
import ChatContext from '../chatContext'
import styled from 'styled-components'
import MainHeader from '../components/Main/MainHeader'
function NewRoom() {
  const { currentUser } = useContext(ChatContext)

  const onLogout = () => {

  }

  return (
    <MainContainer>
      {
        currentUser &&
        <>
          <MainHeader handleLogout={onLogout} />
          <div className="chat-container">
              
          </div>
        </>
      }
    </MainContainer>
  )
}

const MainContainer = styled.div `
  width: 100%;
  height: 100%;

  .chat-container {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: calc(100vh - 60px);
    overflow: hidden;
    background: #00000076;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

    @media screen and (min-width: 768px){
      padding: 1.5rem 1rem;
      flex-direction: row;
    }
  }
`

export default NewRoom