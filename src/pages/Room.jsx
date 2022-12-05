import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import RoomContacts from '../components/Room/RoomContacts'
import RoomHeader from '../components/Room/RoomHeader'
import { useNavigate } from 'react-router-dom'
import { roomAPI } from '../api/roomApi'
import { Buffer } from 'buffer'
import axios from "axios";
import Loading from '../components/Loading'
import ChatContext from '../chatContext'
import { toastError } from '../utils/toastOptions'

function Room() {
  const navigate = useNavigate()
  const { userContacts, userRooms, currentUser, fetchRooms } = useContext(ChatContext)

  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState([])
  const [roomName, setRoomName] = useState('')
  const [roomAvatar, setRoomAvatar] = useState(null)

  useEffect(() => {
    console.log('room', currentUser, userContacts)
    if (currentUser && userContacts) {
      console.log('set room info')
      setRoomName(`${currentUser.username}'s room`)
      setSelectedUser(userContacts.map(contact => ({ ...contact, selected: false })))
    }
  }, [currentUser, userContacts])

  useEffect(() => {
    const genRandomNum = () => Math.floor(Math.random() * 1000)
    const getAvatarsData = async () => {
      setLoading(true)
      const api = `https://api.multiavatar.com/${genRandomNum()}?apikey=${process.env.REACT_APP_AVATAR_KEY}`
      const { data } = await axios.get(api)
      const buffer = new Buffer(data)
      setRoomAvatar(buffer.toString('base64'))
      setLoading(false)
    }
    getAvatarsData()
  }, [navigate])

  const onRoomNameChange = (name) => {
    setRoomName(name)
  }

  const onUserSelected = (userId) => {
    setSelectedUser(prev => {
      return prev.map(user => user._id === userId ? {...user, selected: !user.selected } : user)
    })
  }

  const onAddRoom = async() => {
    const roomNameExisted = userRooms.some(({ roomname }) => roomname === roomName)
    if (roomNameExisted) {
      return toastError('Room name has been used !')
    }

    const roomUsers = [currentUser].concat(selectedUser.filter(user => user.selected))

    try {
      const response = await roomAPI.postRoom({ 
        roomname: roomName,
        users: roomUsers.map(user => user._id),
        avatarImage: roomAvatar
      })
      if (response.status) {
        await fetchRooms()
        navigate('/')
      }
    } catch(e) {
      toastError(e.message)
    }
  }

  return (
    <RoomContainer>
      {
        loading ? <Loading /> : (
          <>
            <RoomHeader 
              roomAvatar={roomAvatar}
              roomName={roomName}
              handleRoomNameChange={onRoomNameChange}
            />
            <RoomContacts 
              contacts={selectedUser}
              handleUserSelected={onUserSelected}
              handleAddRoom={onAddRoom}
            />
          </>
        )
      }
    </RoomContainer>
  )
}

const RoomContainer = styled.div `
  width: 100%;
  height: 100%;
`

export default Room