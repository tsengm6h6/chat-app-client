import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { toastError } from '../utils/toastOptions'
import { authAPI } from '../api/authApi'
import BrandLogo from '../components/BrandLogo'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCAL_KEY)) {
      navigate('/')
    }
  }, [navigate])

  const handleSubmit = async(evt) => {
    evt.preventDefault()
    if (validation()) {
      const { username, password } = formData
      const { data } = await authAPI.login({ username, password })
      if (data.status) {
        localStorage.setItem(process.env.REACT_APP_LOCAL_KEY, JSON.stringify(data.user))
        navigate('/')
      } else {
        toastError(data.msg);
      }
    }
  }
  
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value })
  }

  const validation = () => {
    const { username,password } = formData
    if (!username || !password) {
      toastError('All fields are required');
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
          type='password' 
          name='password' 
          placeholder='Password' 
          value={formData.password} 
          onChange={handleChange} />
        <button type='submit'>Login</button>
        <span>Do not have an account ? <Link to="/register">Register</Link></span>
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

export default Login