import React from 'react';
import './topBar.css';
import Logo from "../../assets/Logo.png";
import { useNavigate } from 'react-router-dom';

function TopBar({ loggedIn }) {
  const navigate = useNavigate();

  const goLoginPage = () => {
    navigate("/login");
  };

  const goToChatPage = () => {
    navigate("/chat");
  };

  const goToHome = () => { 
    navigate("/home")
  }

  return (
    <div className='topBar'>
      <div className="topBar_logo">
        <img src={Logo} alt="Logo" />
      </div>
      
      <div className="topBar_buttons">
        
          <button className="modernButton" onClick={goLoginPage}>Log in</button>
        
      </div>
    </div>
  );
}

export default TopBar;
