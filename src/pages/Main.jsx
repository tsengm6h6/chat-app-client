import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import MainHeader from '../components/Main/MainHeader'
import MainContacts from '../components/Main/MainContacts'
import { useNavigate } from 'react-router-dom'
import ChatContext from '../chatContext'

function Main() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(ChatContext)

  useEffect(() => {
    if (!currentUser) {
      const existedUser = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_KEY))
      if (existedUser) {
        setCurrentUser(existedUser)
      } else {
        navigate('/login')
      }
    } else if (currentUser.avatarImage === '') {
      navigate('/setting')
    } 
  }, [navigate, currentUser, setCurrentUser])

  return (
    <MainContainer>
      { currentUser && (
        <>
          <MainHeader currentUser={currentUser} />
          <MainContacts currentUser={currentUser} />
        </>
      )}
    </MainContainer>
  )
}

const MainContainer = styled.div `
  width: 100%;
  height: 100%;
`

export default Main