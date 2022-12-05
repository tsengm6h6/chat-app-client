import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NewMain from './pages/NewMain';
import Chat from './pages/Chat'
import Login from './pages/Login';
import Register from './pages/Register';
import Setting from './pages/Setting'
import { ToastContainer } from 'react-toastify';
// import Main from './pages/Main';
import styled from 'styled-components';
import Room from './pages/Room';
// import NewRoom from './pages/NewRoom';
import { ChatProvider } from './chatContext'

function App() {
  return (
    <Conatiner>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/chat" element={<Chat />}></Route>
            <Route path="/" element={<NewMain />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/setting" element={<Setting />}></Route>
            {/* <Route path="/room" element={<NewRoom />}></Route> */}
            {/* <Route path="/main" element={<Main />}></Route> */}
            <Route path="/room" element={<Room />}></Route>
          </Routes>
        </Router>
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
