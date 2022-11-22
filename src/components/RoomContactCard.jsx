import React, { useState } from 'react'
import styled from 'styled-components'

function RoomContactCard() {
  const [check, setCheck] = useState(true)

  return (
    <Card>
      <img src='/talking.png' alt='user-avatar'/>
      <div className='user-wrapper'>
        <h2 className='user-name'>User name</h2>
      </div>
      <div className="radio-button">
        <input type="checkbox" checked={check} onChange={() => setCheck(prev => !prev)} name="userName" />
      </div>
    </Card>
  )
}


const Card = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 250px;
  padding: 0.75rem;
  background-color: #131324;
  border-radius: 8px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  img {
    height: 4rem;
    width: 4rem;
  }

  .user-wrapper {
    flex-grow: 1;
    padding-right: 8px;

    .user-name {
      font-size: 1.25rem;
      font-weight: 600;
    }
  }

  input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid gray;

    transition: 0.2s all linear;
    margin-right: 5px;
    margin-top: 5px;
  }

  input[type="checkbox"] {
    display: grid;
    place-content: center;
  }

  input[type="checkbox"]::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: scale(0);
    transition: 0.1s all ease-in;
    box-shadow: inset 1em 1em #997af0;
  }

  input[type="checkbox"]:checked {
    border: 2px solid #997af0;
  }

  input[type="checkbox"]:checked::before {
    transform: scale(1);
  }
`

export default RoomContactCard