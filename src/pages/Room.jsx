import React, { useState, useEffect, useContext, useMemo } from 'react'
import styled from 'styled-components'
import RoomContacts from '../components/Room/RoomContacts'
import RoomHeader from '../components/Room/RoomHeader'
import MainHeader from '../components/Main/MainHeader'
import { useNavigate } from 'react-router-dom'
import { roomAPI } from '../api/roomApi'
import { Buffer } from 'buffer'
import axios from "axios";
import Loading from '../components/Loading'
import ChatContext from '../chatContext'
import { toastError } from '../utils/toastOptions'
import { roomCreated } from '../socket/emit'

function Room() {
  const navigate = useNavigate()
  const { userContacts, userRooms, currentUser, fetchRooms } = useContext(ChatContext)

  const [loading, setLoading] = useState(false)
  const [userOptions, setUserOptions] = useState([])
  const [roomName, setRoomName] = useState('')
  const [roomAvatar, setRoomAvatar] = useState(null)

  const selectedUser = useMemo(() => {
    console.log('useMemo')
    return userOptions.filter(user => user.selected)
  }, [userOptions])

  useEffect(() => {
    console.log('room', currentUser, userContacts)
    if (currentUser && userContacts) {
      console.log('set room info')
      setRoomName(`${currentUser.username}'s room`)
      setUserOptions(userContacts.map(contact => ({ ...contact, selected: false })))
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
    setUserOptions(prev => {
      return prev.map(user => user._id === userId ? {...user, selected: !user.selected } : user)
    })
  }

  const onAddRoom = async() => {
    const roomNameExisted = userRooms.some(({ roomname }) => roomname === roomName)
    if (roomNameExisted) {
      return toastError('Room name has been used !')
    }

    const roomUsers = [currentUser].concat(selectedUser)

    try {
      const response = await roomAPI.postRoom({ 
        roomname: roomName,
        users: roomUsers.map(user => user._id),
        avatarImage: roomAvatar
      })
      if (response.status) {
        roomCreated({
          roomname: roomName,
          creator: currentUser.username,
          invitedUser: selectedUser.map(user => user._id)
        })
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
        currentUser &&
        <>
          <MainHeader />
            <div className="room-inner">
              {
                loading
                ? <Loading />
                : <RoomHeader
                    roomAvatar={roomAvatar}
                    roomName={roomName}
                    handleRoomNameChange={onRoomNameChange}
                  />
              }
              <RoomContacts 
                loading={loading}
                contacts={userOptions}
                handleUserSelected={onUserSelected}
              />
              <div className={`button-wrapper ${loading ? 'loading-control' : ''}`}>
                <button className='add-button' onClick={onAddRoom}>Add Room</button>
              </div>
            </div>
        </>
      }
    </RoomContainer>
  )
}

const RoomContainer = styled.div `
  width: 100%;
  height: 100%;

  .room-inner {
    height: calc(100vh - 60px);
    display: grid;
    grid-template-rows: 165px 1fr 90px;

    @media screen and (min-width: 768px) {
      grid-template-rows: 1fr 90px 90px;
      grid-template-columns: 300px 1fr;
    }
  }

  .button-wrapper {
    background: #00000076;
    grid-row: 3 / 4;
    padding: 1.5rem;
    display: flex;
    justify-content: center;

    &.loading-control {
      display: none;
    }

    @media screen and (min-width: 768px) {
      background: none;
      grid-row: 2 / 3;
      grid-column: 2 / 3;
      z-index: 2;

      &.loading-control {
        display: flex;
      }
    }
  }

  .add-button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 20px 80px / 120px;
    background-color: #997af0;
    color: white;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    transition: all 0.2s ease-out;

    &:hover {
      background-color: #4e0eff;
      border-radius: 20px 20px / 120px;
    }
  }
`

export default Room