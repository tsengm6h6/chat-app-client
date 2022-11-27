import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { toastError } from '../utils/toastOptions'
import { authAPI } from '../api/authApi'
import BrandLogo from '../components/BrandLogo'
import ChatContext from '../chatContext'

function Register() {
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(ChatContext)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const existedUser = localStorage.getItem(process.env.REACT_APP_LOCAL_KEY)
    if (existedUser) {
      setCurrentUser(existedUser)
      navigate('/main')
    }
  }, [navigate, setCurrentUser])

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (validation()) {
      const { username, email, password } = formData
      const { data } = await authAPI.register({ username, email, password })
      if (data.status) {
        localStorage.setItem(process.env.REACT_APP_LOCAL_KEY, JSON.stringify(data.user))
        setCurrentUser(data.user)
        navigate('/main')
      } else {
        toastError(data.msg);
      }
    }
  }
  
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }

  const validation = () => {
    const { username, email, password, confirmPassword } = formData

    if (!username || !email || !password || !confirmPassword) {
      toastError('All fields are required');
      return false
    } else if (username.length < 3) {
      toastError('Username should be longer than 3 characters');
      return false
    } else if (password.length < 8) {
      toastError('Password should be equal or longer than 8 characters');
      return false
    } else if (password !== confirmPassword) {
      toastError('password and confirm password shoud be same');
      return false
    }
    return true
  }
  
  return (
    <Container>
      <BrandLogo />
      <form onSubmit={handleSubmit}>
        <input 
          type='text' 
          name='username' 
          placeholder='Username' 
          value={formData.username} 
          onChange={handleChange} />
        <input 
          type='email' 
          name='email' 
          placeholder='Email' 
          value={formData.email} 
          onChange={handleChange} />
        <input 
          type='password' 
          name='password' 
          placeholder='Password' 
          value={formData.password} 
          onChange={handleChange} />
        <input 
          type='password' 
          name='confirmPassword' 
          placeholder='Confirm Password' 
          value={formData.confirmPassword} 
          onChange={handleChange} />
        <button type='submit'>Create User</button>
        <span>Already have an account ? <Link to="/login">Login</Link></span>
      </form>
    </Container>
  )
}

const Container = styled.div `
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #00000076;
    padding:2rem;
    margin: 1rem;
    border-radius: 1rem;

    @media screen and (min-width: 720px){
      gap: 2rem;
      padding: 3rem 5rem;
    }

    .brand-name {
      font-size: 1.5rem;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    input {
      padding: 1rem;
      font-size: 1rem;
      border-radius: 20px 80px / 120px;
      background-color: transparent;
      border: 1px solid #4e0eff;
      color: white;
      width: 100%;

      &:focus {
        outline: none;
        border: 1px solid #997af0;
      }
    }

    button {
      width: 100%;
      padding: 1rem 3rem;
      border: none;
      border-radius: 20px 80px / 120px;
      background-color: #997af0;
      color: white;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
      transition: all 0.5s ease-out;

      &:hover {
        background-color: #4e0eff;
        border-radius: 20px 20px / 120px;
      }
    }

    span {
      font-size: 12px;
      text-transform: uppercase;
      text-align: center;
      letter-spacing: 1px;
      font-weight: 700;
      line-height: 24px;

      @media screen and (min-width: 720px){
        line-height: 12px;
      }


      a {
        font-size: 12px;
        text-decoration: none;
        color: #4e0eff;
      }
    }
  }
`

export default Register