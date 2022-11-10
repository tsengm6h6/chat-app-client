import React, { useState } from 'react'
import styled from 'styled-components'
import { BiSend, BiSmile } from "react-icons/bi";
import EmojiPicker from 'emoji-picker-react';

function ChatInput({
  handleMessageSend
}) {
  const [showEmoji, setShowEmoji] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')

  const handleEmojiClick = (emoji, evt) => {
    setCurrentMessage((prev) => prev += emoji.emoji)
    setShowEmoji(!showEmoji)
  }

  const onFormSubmit = (evt) => {
    handleMessageSend(evt, currentMessage)
    setCurrentMessage('')
  }

  return (
    <InputContainer>
        <div className="button emoji-button">
          <BiSmile onClick={() => setShowEmoji(!showEmoji)} />
          { showEmoji && <EmojiPicker className="emoji-picker"  onEmojiClick={handleEmojiClick}/> }
        </div>
        <form onSubmit={onFormSubmit}>
          <input 
            className='input-field' type="text"
            onChange={(evt) => setCurrentMessage(evt.target.value)}
            value={currentMessage}
          />
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
  padding: 1rem;
  display: flex;
  align-items: center;

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
      margin-right: 1rem;
      position: relative;
    }

    .EmojiPickerReact,
    .EmojiPickerReact.epr-main {
      position: absolute;
      bottom: 3.5rem;
      left: 0;
      background-color: #080420;
      box-shadow: 0 1px 10px #9a86f3;
      border-color: #9a86f3;
      
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
      flex: 1;
      background-color: #ffffff34;
      border-radius: 40px;
      display: flex;

      .input-field {
        flex: 1 1 auto;
        padding: 1rem 1rem;
        font-size: 1.25rem;
        background-color: transparent;
        border: none;
        outline: none;
        color: white;
      }

      .submit-button {
        padding: 4px 32px;
        font-size: 1.25rem;
        background-color: #9a86f3;
        color: white;
        border-radius: 40px;

        &:hover {
          background-color: #b1a2f0;
        }
      }
    }
`

export default ChatInput