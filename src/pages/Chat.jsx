import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import ChatContainer from '../components/ChatContainer'
import ChatContact from '../components/ChatContact'
import ChatWelcome from '../components/ChatWelcome'
import { io } from 'socket.io-client'

function Chat() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [chatUser, setChatUser] = useState(null)
  const ws = useRef(null)


  useEffect(() => {
    const socket = io(`http://localhost:${process.env.REACT_APP_SERVER_PORT}`)
    socket.on('connect', () => {
      console.log(`socket connect ${socket.id}`)
      socket.emit('add-user', currentUser._id)
    })
    ws.current = socket
    return () => {
      socket.close()
    }
  }, [currentUser])

  useEffect(() => {
    const getLocalStorageUser = async () => {
      const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_KEY))
      if (!user) {
        navigate('/login')
      } else if (user.avatarImage === '') {
        navigate('/setting')
      } else {
        setCurrentUser(user)
      }
    }
    getLocalStorageUser()
  }, [navigate])

  return (
    <Container>
      <ChatWrapper>
        {
          currentUser && (
            <>
              <ChatContact 
                currentUser={currentUser} 
                handleChatSelect={setChatUser}
                chatUser={chatUser} />
              { chatUser 
                ? <ChatContainer 
                    currentUser={currentUser} 
                    chatUser={chatUser}
                    socket={ws} />
                : <ChatWelcome />
              }
            </>
          )
        }
      </ChatWrapper>
    </Container>
  )
}

const Container = styled.div `
  width: 100vw;
  height: 100vh;
  padding: 3rem 5rem;
  overflow: hidden;
  background-color: #131324;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`

const ChatWrapper = styled.div `
  background-color: #00000076;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 30% 70%;
`

export default Chat