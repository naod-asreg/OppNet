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

  return (
    <div className='topBar'>
      <div className="topBar_logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="topBar_titles">
        <div className="topBar_titles_title">
          <button className="modernButton">Track Applications</button>
        </div>
        <div className="topBar_titles_title">
          <button className="modernButton">Connect</button>
        </div>
        <div className="topBar_titles_title">
          {/* Turn "Chat" title into a button */}
          <button className="modernButton" onClick={goToChatPage}>Chat</button>
        </div>
        <div className="topBar_titles_title">
          <button className="modernButton">More</button>
        </div>
      </div>
      <div className="topBar_buttons">
        {loggedIn ?
          <>
            <button className="modernButton">Sign Up</button>
            <button className="modernButton blackButton" onClick={goLoginPage}>Login</button>
          </>
          :
          <button className="modernButton">Log out</button>
        }
      </div>
    </div>
  );
}

export default TopBar;
