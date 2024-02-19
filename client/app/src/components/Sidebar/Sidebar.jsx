import React from "react";
import "./sidebar.css";
import Headshot from "../../assets/headshot.jpeg";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { MdOutlinePerson } from "react-icons/md";

function Sidebar() {
  return (
    <div className="Sidebar">
      <div className="sidebar_top">
        <div className="sidebar_top_square">
          <img src={JSON.parse(localStorage.getItem("user")).picture} alt=""/>
        </div>
      </div>
      <div className="sidebar_buttons">
        <div className="sidebar_buttons_button">
            <IoHomeOutline size={"1.8rem"}/>
        </div>
        <div className="sidebar_buttons_button">
            <FaRegBell size={"1.8rem"}/>
        </div>
        <div className="sidebar_buttons_button">
            <MdOutlinePerson size={"1.8rem"}/>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
