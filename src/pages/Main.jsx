import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import MainHeader from '../components/Main/MainHeader'
import MainContacts from '../components/Main/MainContacts'
import { useNavigate } from 'react-router-dom'

function Main() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)

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