import React from 'react'
import styled from 'styled-components'

export default function BrandLogo() {
  return (
    <Brand>
      <img src='/talking.png' alt='brand-logo'/>
      <h1 className='brand-name'>Talk talk</h1>
    </Brand>
  )
}


const Brand = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  img {
    height: 4rem;
    width: 4rem;
  }

  .brand-name {
    font-size: 1.5rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }
`