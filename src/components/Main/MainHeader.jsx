import React, { useContext } from 'react'
import styled from 'styled-components'
import { BiSearchAlt, BiGroup, BiCog, BiLogOutCircle } from "react-icons/bi"
import { useNavigate, Link } from 'react-router-dom'
import ChatContext from '../../chatContext'
import SocketContext from '../../socketContext'

function MainHeader() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(ChatContext)
  const { socket } = useContext(SocketContext)

  const onLogout = () => {
    socket.emit('USER_OFFLINE', currentUser._id) // 先更新才能切斷連線
    socket.disconnect()
    localStorage.removeItem(process.env.REACT_APP_LOCAL_KEY)
    setCurrentUser(null)
    navigate('/login')
  }
  
  return (
    <Header>
      <div className="user-card">
        <div className='avatar-wrapper online'>
          <img src={`data:image/svg+xml;base64,${currentUser.avatarImage}`} alt="user-avatar" />
        </div>
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
          <BiLogOutCircle onClick={onLogout}/>
      </button>
      </div>
    </Header>
  )
}

const Header = styled.header `
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 1.5rem 1rem;

  .user-card {
    display: flex;
    align-items: center;
    gap: 8px;

    .avatar-wrapper {
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 50%;
      padding: 3px;
      transition: all 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }

      &.online {
        border: 1.5px solid #997af0;
        filter: drop-shadow(0px 0px 2px #997af0);
        opacity: 1;
      }
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