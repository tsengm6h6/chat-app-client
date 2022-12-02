import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Buffer } from 'buffer'
import axios from "axios";
import { toastError } from '../utils/toastOptions'
import Loading from '../components/Loading'
import { userAPI } from '../api/userApi'
import ChatContext from '../chatContext';

function ChatAvatarSetting() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [avatars, setAvatars] = useState([])
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null)
  const { currentUser, setCurrentUser } = useContext(ChatContext)

  useEffect(() => {
    if (!currentUser) {
      const existedUser = localStorage.getItem(process.env.REACT_APP_LOCAL_KEY)
      if (existedUser) {
        setCurrentUser(existedUser)
      } else {
        navigate('/login')
      }
    } else if (currentUser.avatarImage !== '') {
      navigate('/')
    } 
  }, [navigate, currentUser, setCurrentUser])

  useEffect(() => {
    setIsLoading(true)
    const genRandomNum = () => Math.floor(Math.random() * 1000)
    const getAvatarsData = async () => {
      return Promise.all(Array.from({ length: 4 }, async (v, i) => {
        const api = `https://api.multiavatar.com/${genRandomNum()}?apikey=${process.env.REACT_APP_AVATAR_KEY}`
        const { data } = await axios.get(api)
        const buffer = new Buffer(data)
        return buffer.toString('base64')
      }))
    }

    const setData = async() => {
      const response = await getAvatarsData()
      setAvatars(response)
      setIsLoading(false)
    }
    setData()
  }, [])

  const handleSetProfile = async() => {
    if (selectedAvatarIndex === null) {
      return toastError('Please select an avatar.');
    }
    const { data } = await userAPI.setAvatarImage(currentUser._id, {
      image: avatars[selectedAvatarIndex]
    })
    if (data.status) {
      localStorage.setItem(process.env.REACT_APP_LOCAL_KEY, JSON.stringify({
        ...currentUser,
        avatarImage: data.image
      }))
      setCurrentUser({
        ...currentUser,
        avatarImage: data.image
      })
      navigate('/')
    }
  }

  return (
    <AvatarContainer>
      { isLoading
        ? <Loading />
        : (
          <>
            <h1>Pick an avatar as your profile picture</h1>
            <div className='avatars'>
              { avatars.map((avatar, index) => (
                <div 
                  className={`avatar ${selectedAvatarIndex === index ? 'selected' : null}`}
                  key={index}
                  onClick={() => setSelectedAvatarIndex(index)}>
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleSetProfile}>Set as profile picture</button>
          </>
        )
      }
    </AvatarContainer>
)
}

const AvatarContainer = styled.div `
  max-width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  h1 {
    font-size: 1.5rem;
    text-align: center;
    line-height: 2rem;

    @media screen and (min-width: 720px){
      font-size: 2rem;
      line-height: 2.5rem;
    }
  }
  
  .avatars {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;

    .avatar {
      /* background-color: papayawhip; */
      width: 6rem;
      height: 6rem;
      padding: 0.5rem;
      cursor: pointer;
      border: 3px solid transparent;
      border-radius: 50%;
      transition: all 0.5s ease;

      &.selected {
        border: 3px solid #997af0;
      }

      img {
        object-fit: cover;
      }
    }

    @media screen and (min-width: 720px){
      flex-direction: row;
    }
  }

  button {
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 20px 80px / 120px;
    background-color: #997af0;
    color: white;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    transition: all 0.5s ease-out;
    line-height: 1.25rem;

    @media screen and (min-width: 720px){
      padding: 1rem 3rem;
    }

    &:hover {
      background-color: #4e0eff;
      border-radius: 20px 20px / 120px;
    }
  }
`

export default ChatAvatarSetting