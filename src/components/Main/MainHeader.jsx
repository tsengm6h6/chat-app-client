import React, { useContext } from 'react'
import styled from 'styled-components'
import { BiSearchAlt, BiGroup, BiCog, BiLogOutCircle } from "react-icons/bi"
import { Link, useNavigate } from 'react-router-dom'
import ChatContext from '../../chatContext'

function MainHeader({ currentUser }) {
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(ChatContext)

  const logout = () => {
    // socket.current.emit('logout', currentUser._id)
    localStorage.removeItem(process.env.REACT_APP_LOCAL_KEY)
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <Header>
      <div className="user-card">
        <img src={`data:image/svg+xml;base64,${currentUser.avatarImage}`} alt="user-avatar" />
        <h1>{currentUser.username}</h1>
      </div>
      <div className='icons'>
        <button className="icon">
          <BiSearchAlt />
        </button>
        <Link to="/room" className="icon">
          <BiGroup />
        </Link>
        <button className="icon">
          <BiCog />
        </button>
        <button className="icon logout">
          <BiLogOutCircle onClick={() => logout()}/>
      </button>
      </div>
    </Header>
  )
}

const Header = styled.header `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;

  .user-card {
    display: flex;
    align-items: center;
    gap: 8px;

    img {
      width: 2rem;
      height: 2rem;
    }

    h1 {
      font-size: 1rem;
    }
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: 50%;
      /* background-color: white; */
      background-color: #00000076;
      color: #997af0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      
        &:hover, &:active {
          box-shadow: 1px 1px 2px #997af0;
        } 
    }
  }

  .logout {
    transform: rotate(180deg);
  }
`

export default MainHeader