import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { BiSend, BiSmile } from "react-icons/bi";
import EmojiPicker from 'emoji-picker-react';

function ChatInput({ handleMessageSend, handleTyping, isTyping }) {
  const [showEmoji, setShowEmoji] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')

  const typingRef = useRef()

  useEffect(() => {
    setCurrentMessage('')
  }, [])

  useEffect(() => {
    typingRef.current = currentMessage === ''
  }, [currentMessage])

  const handleEmojiClick = (emoji, evt) => {
    setCurrentMessage((prev) => prev += emoji.emoji)
    setShowEmoji(!showEmoji)
  }

  const onFormSubmit = (evt) => {
    handleMessageSend(evt, currentMessage)
    handleTyping(false)
    setCurrentMessage('')
  }

  const handleInputChange = useCallback((evt) => {
    setCurrentMessage(evt.target.value)
    if (isTyping !== typingRef.current) {
      handleTyping(typingRef.current)
    }
  }, [isTyping, handleTyping])

  return (
    <InputContainer>
        <form onSubmit={onFormSubmit}>
          <input 
            className='input-field' type="text"
            onChange={handleInputChange}
            value={currentMessage}
          />
          <div className="button emoji-button">
            <BiSmile onClick={() => setShowEmoji(!showEmoji)} />
            { showEmoji && <EmojiPicker className="emoji-picker"  onEmojiClick={handleEmojiClick}/> }
          </div>
          <button 
            className='button submit-button'
            type='submit'
          >
            <BiSend />
          </button>
        </form>
      </InputContainer>
  )
}

const InputContainer = styled.div `

    .button {
      font-size: 1.25rem;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }

    .emoji-button {
      background-color: transparent;
      color: white;
      font-size: 1.75rem;
      margin-right: 0.5rem;
      position: relative;
    }

    .EmojiPickerReact,
    .EmojiPickerReact.epr-main {
      width: 300px !important;
      height: 450px !important;
      position: absolute;
      bottom: 3.5rem;
      right: 50%;
      transform: translateX(13%);
      background-color: #080420;
      box-shadow: 0 1px 10px #9a86f3;
      border-color: #9a86f3;

      @media screen and (min-width: 768px) {
        width: 350px !important;
        height: 480px !important;
      }
      
      .epr-body::-webkit-scrollbar {
        background-color: #080420;
        width: 6px;
        &-thumb {
          background-color: #9a86f3;
          border-radius: 8px;
        }
      }
      
      .epr-category-nav {
        button {
          filter: contrast(1);
        }
      }
      .epr-search {
        background-color: transparent;
        border-color: #9a86f3;
        color: white;

        &:focus {
          background-color: transparent;
          border-color: #9a86f3;
        }
      }

      .epr-body,
      .epr-emoji-category-label {
        background-color: #080420;
      }
    }
    

    form {
      background-color: #ffffff34;
      border-radius: 40px;
      display: flex;
      justify-content: space-between;

      .input-field {
        flex: 1 1 auto;
        min-width: none;
        padding: 0.75rem 1rem;
        font-size: 1.25rem;
        background-color: transparent;
        border: none;
        outline: none;
        color: white;
      }

      .submit-button {
        padding: 4px 12px;
        font-size: 1.25rem;
        background-color: #9a86f3;
        color: white;
        border-top-left-radius: 4px;
        border-top-right-radius: 40px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 40px;

        &:hover {
          background-color: #b1a2f0;
        }
      }
    }
`

export default ChatInput