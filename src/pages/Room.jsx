import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import RoomContacts from '../components/Room/RoomContacts'
import RoomHeader from '../components/Room/RoomHeader'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../api/userApi'
import { Buffer } from 'buffer'
import axios from "axios";
import Loading from '../components/Loading'

function Room() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [contactUsers, setContactUsers] = useState([])
  const [roomName, setRoomName] = useState('')
  const [roomAvatar, setRoomAvatar] = useState(null)

  useEffect(() => {
    if (currentUser) {
      const fetchUsers = async() => {
        const { data } = await userAPI.getUsers()
        const users = data.data.filter(({ _id}) => _id !== currentUser._id)
        setContactUsers(users.map(user => ({...user, checked: false })))
      }
      fetchUsers()
        setRoomName(`${currentUser.username}'s room`)
    }
  }, [currentUser])

  // TODO: add loading
  useEffect(() => {
    setLoading(true)
    const getLocalStorageUser = async () => {
      const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_KEY))
      if (!user) {
        navigate('/login')
      } else if (user.avatarImage === '') {
        navigate('/setting')
      } else {
        await getAvatarsData()
        setCurrentUser(user)
        setLoading(false)
      }
    }
    const genRandomNum = () => Math.floor(Math.random() * 1000)
    const getAvatarsData = async () => {
      const api = `https://api.multiavatar.com/${genRandomNum()}?apikey=${process.env.REACT_APP_AVATAR_KEY}`
      const { data } = await axios.get(api)
      const buffer = new Buffer(data)
      setRoomAvatar(buffer.toString('base64'))
    }
    getLocalStorageUser()
  }, [navigate])

  const onRoomNameChange = (name) => {
    setRoomName(name)
  }

  const onUserSelected = (userId) => {
    setContactUsers(prev => {
      return prev.map(user => user._id === userId ? {...user, checked: !user.checked } : user)
    })
  }

  const onAddRoom = () => {
    // TODO: fetch API
    const invitedUsers = [currentUser].concat(contactUsers.filter(user => user.checked))
    console.log('room name', roomName)
    console.log('room users', invitedUsers)
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
              contacts={contactUsers}
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