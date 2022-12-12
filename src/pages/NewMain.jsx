import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import MainHeader from '../components/Main/MainHeader'
import MainContacts from '../components/Main/MainContacts'
import { useNavigate } from 'react-router-dom'
import ChatContext from '../chatContext'
import ChatRoom from '../components/Chat/ChatRoom'
import ChatWelcome from '../components/ChatWelcome'
import { userOnline } from '../socket/emit'
import { WsContext } from '../wsContext'
import { toastNormal } from '../utils/toastOptions'

function NewMain() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, chatTarget, fetchRooms } = useContext(ChatContext)
  const { value: { globalNotify }, setValue } = useContext(WsContext)

  // 導航守衛
  useEffect(() => {
    if (!currentUser) {
      const existedUser = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_KEY))
      if (existedUser) {
        setCurrentUser(existedUser)
        userOnline(existedUser._id)
      } else {
        navigate('/login')
      }
    } else if (currentUser.avatarImage === '') {
      navigate('/setting')
    }
  }, [navigate, currentUser, setCurrentUser])

   // globalNotify
   useEffect(() => {
    if (globalNotify !== '') {
      toastNormal(globalNotify)
      fetchRooms()
      setValue(prevState => ({
        ...prevState,
        globalNotify: ''
      }))
    }
  }, [globalNotify, setValue, fetchRooms])


  return (
    <MainContainer>
      {
        currentUser &&
        <>
          <MainHeader />
          <div className={`chat-container ${chatTarget?._id ? 'target-selected' : ''}`}>
            <MainContacts />
              {
                chatTarget === null
                ? <ChatWelcome />
                : <ChatRoom />
              }
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

export default NewMain