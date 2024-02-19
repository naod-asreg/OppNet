import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import { GoogleOAuthProvider } from '@react-oauth/google';



function App() {
  return (
  
    <GoogleOAuthProvider clientId='176150502414-dl4hvgllhk6s6gndttt6c5t7d42afdar.apps.googleusercontent.com'>
       <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
   
    
    /*
    <>
     <Landing/>
      <Login/>
    </>
   */

  );
}

export default App;
