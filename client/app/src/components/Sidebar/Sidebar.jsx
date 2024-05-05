import React, { useContext, useState, useEffect } from "react";
import "./sidebar.css";
import { IoHomeOutline, IoCalendarOutline } from "react-icons/io5";
import { FaRegBell, FaRegClipboard } from "react-icons/fa";
import { MdOutlinePerson, MdOutlineEventNote } from "react-icons/md";
import { CiChat2 } from "react-icons/ci";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import axios from "axios";

function Sidebar() {
  const { token, currentUser, setToken } = useContext(UserContext);
  const [recruiters, setRecruiters] = useState([]);

  const handleSignOut = () => {
    // Set token to null
    setToken(null);

    // Redirect to the login page or any other desired destination
    navigate("/login"); // Assuming '/login' is your login page route
  };

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/application/${currentUser._id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const userApplications = response.data;
        const allRecruiters = userApplications.flatMap(
          (application) => application.recruiter
        );
        setRecruiters(allRecruiters);
      } catch (error) {
        console.error("Error fetching recruiters:", error);
      }
    };

    fetchRecruiters();
  }, [currentUser._id, token]);
  const navigate = useNavigate();

  return (
    <div className="Sidebar">
      <div className="sidebar-logo">
        <span>OppNet</span>
      </div>
      <div className="sidebar-menu">
        <div className="menu-item" onClick={() => navigate("/home")}>
          <IoHomeOutline />
          <span>All Jobs</span>
        </div>
        <div className="menu-item" onClick={() => navigate("/chat")}>
          <CiChat2 />
          <span>Chat</span>
        </div>
        <div className="menu-item" onClick={() => navigate("/dashboard")}>
          <FaRegClipboard />
          <span>Dashboard</span>
        </div>
       
        <div className="menu-item" onClick={() => navigate("/calendar")}>
          <IoCalendarOutline />
          <span>Calendar</span>
        </div>
      </div>
      <div className="sidebar-section">
        Recruiters:
        {recruiters.map((recruiter, index) => (
          <div key={index} className="menu-item">
            <MdOutlinePerson />
            <span>{recruiter}</span>
          </div>
        ))}
      </div>
      <div className="sidebar-profile">
        <img src={currentUser.picture || "defaultProfile.png"} alt="profile" />
        <div>
          <span>{currentUser.name}</span>
          <span>{currentUser.email}</span>
        </div>
      </div>
      <div className="sidebar-settings">
        <div className="menu-item">
          <MdOutlinePerson onClick={()=>{navigate('/profile')}}/>
          <span>Settings</span>
        </div>
        <div className="menu-item" onClick={handleSignOut}>
          <IoHomeOutline />
          <span>Sign Out</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
