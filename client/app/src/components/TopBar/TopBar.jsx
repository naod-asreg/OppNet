import React from 'react'
import './topBar.css'
import Button from '../Button/Button'
import Logo from "../../assets/Logo.png"
import { useNavigate } from 'react-router-dom';
function TopBar() {
  let navigate = useNavigate();
  const goLoginPage = () =>{
    navigate("/login")
  }
  return (
    <div className='topBar'>
      <div className="topBar_logo">
        <img src={Logo}/>
      </div>
      <div className="topBar_titles">
        <div className="topBar_titles_title">
            <h4>Track Applications</h4>
        </div>
        <div className="topBar_titles_title">
            <h4>Connect</h4>
        </div>
        <div className="topBar_titles_title">
            <h4>Chat</h4>
        </div>
        <div className="topBar_titles_title">
            <h4>More</h4>
        </div>
      </div>
      <div className="topBar_buttons">
        <Button content={'Sign Up'}/>
        <Button content={'Login'} color='black' onClick={goLoginPage}/>
      </div>
    </div>
  )
}

export default TopBar
