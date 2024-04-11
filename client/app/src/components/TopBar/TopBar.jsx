import React from 'react';
import './topBar.css';
import Button from '../Button/Button';
import Logo from "../../assets/Logo.png";
import { useNavigate } from 'react-router-dom';

function TopBar({ loggedIn }) {
  const navigate = useNavigate();

  const goLoginPage = () => {
    navigate("/login");
  };

  const goChatTestPage = () => {
    navigate("/chatTest")
  }

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
      <div className="topBar_titles">
        <div className="topBar_titles_title" onClick={goToHome}>
          <h4>Track Applications</h4>
        </div>
        <div className="topBar_titles_title" onClick={goChatTestPage}>
          <h4>Connect</h4>
        </div>
        <div className="topBar_titles_title">
          {/* Make the "Chat" title a button */}
          <h4>Chat</h4>
        </div>
        <div className="topBar_titles_title">
          <h4>More</h4>
        </div>
      </div>
      <div className="topBar_buttons">
        {loggedIn ?
          <>
            <Button content={'Sign Up'} />
            <Button content={'Login'} color='black' onClick={goLoginPage} />
          </>
          :
          <Button content={'Log out'} />
        }
      </div>
    </div>
  );
}

export default TopBar;
