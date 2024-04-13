import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home/Home';

import ChatTest from './pages/Chat/chat_test';
import Chat from './pages/Chat/chat';
import { createContext, useState } from 'react';

export const UserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null)
  return (
  <UserContext.Provider value={{currentUser, setCurrentUser, token, setToken }}>
    <GoogleOAuthProvider clientId='176150502414-dl4hvgllhk6s6gndttt6c5t7d42afdar.apps.googleusercontent.com'>
       <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>} />
          {token && (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/home" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chatTest" element={<ChatTest />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </UserContext.Provider>
    
   
    
    /*
    <>
     <Landing/>
      <Login/>
    </>
   */

  );
}

export default App;
