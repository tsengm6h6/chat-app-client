import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import Setting from './pages/Setting'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Chat />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/setting" element={<Setting />}></Route>
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
