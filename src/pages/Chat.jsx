import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import ChatHeader from '../components/ChatHeader'
import ChatInput from '../components/ChatInput'
import ChatMessages from '../components/ChatMessages'
import { io } from 'socket.io-client'

function Chat() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const ws = useRef(null)


  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_SERVER_URL}`)
    socket.on('connect', () => {
      console.log(`socket connect ${socket.id}`)
      socket.emit('add-user', currentUser._id)
    })
    ws.current = socket
    return () => {
      if (socket.readyState === 1) { // <-- This is important
        socket.close()
      }
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
      <ChatWrapper>
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </ChatWrapper>
  )
}

const ChatWrapper = styled.div `
  background-color: #00000076;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export default Chat