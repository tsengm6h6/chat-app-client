import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Setting from './pages/Setting'
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import Room from './pages/Room';
import { ChatProvider } from './chatContext'
import { WsContextProvider } from './wsContext.js'

// TODO: 
// 5. themeStyle dark mode
// 6. edit avatar

function App() {
  return (
    <Conatiner>
      <ChatProvider>
        <WsContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/setting" element={<Setting />}></Route>
            <Route path="/room" element={<Room />}></Route>
          </Routes>
        </Router>
        </WsContextProvider>
        </ChatProvider>
      <ToastContainer />
    </Conatiner>
  );
}

const Conatiner = styled.div `
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #131324;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`

export default App;
