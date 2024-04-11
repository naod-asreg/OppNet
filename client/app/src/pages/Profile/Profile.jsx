import React, {useContext, useState} from 'react'
import "./profile.css"
import Sidebar from '../../components/Sidebar/Sidebar'
import Headshot from "../../assets/headshot.jpeg";
import Button from '../../components/Button/Button';
import { LuBell, LuHelpCircle, LuLock, LuPencil } from "react-icons/lu";
import { GoGear } from "react-icons/go";
import axios from 'axios'; // Import Axios for making HTTP requests
import { UserContext } from '../../App';

function Profile() {
  const {currentUser} = useContext(UserContext)
  const [firstName, setFirstName] = useState(currentUser.name.split(" ")[0]);
  const [lastName, setLastName] = useState(currentUser.name.split(" ")[1]);
  const [username, setUsername] = useState("");

  const handleSave = () => {
    // Send a request to update user's information in the database
    axios.put(`http://localhost:5555/users/${currentUser._id}`, {
      name : firstName + " " + lastName,
      username, 
    })
    .then(response => {
      // Handle successful update
      console.log('User information updated successfully:', response.data);
      currentUser.name = firstName + " " + lastName;
      currentUser.username = username;

    })
    .catch(error => {
      // Handle error
      console.error('Error updating user information:', error);
    });
  };
  return (
    <div className='Profile'>
      <Sidebar/>
      <div className="profile_section">
        <div className="profile_section_menu">
          <div className="profile_section_menu_title">
            <h2>Settings</h2>
          </div>
          <div className="profile_section_menu_buttons">
            <div className="profile_section_menu_buttons_button">
              <LuPencil size={"1.3rem"}/>
              <h3>Edit Profile</h3>
            </div>
            <div className="profile_section_menu_buttons_button">
              <LuBell size={"1.3rem"}/>
              <h3>Notifications</h3>
            </div>
            <div className="profile_section_menu_buttons_button">
              <LuLock size={"1.3rem"}/>
              <h3>Security</h3>
            </div>
            <div className="profile_section_menu_buttons_button">
              <GoGear size={"1.3rem"}/>
              <h3>Appearance</h3>
            </div>
            <div className="profile_section_menu_buttons_button">
              <LuHelpCircle size={"1.3rem"}/>
              <h3>Help</h3>
            </div>
          </div>
        </div>
        <div className="profile_section_content">
            <div className="profile_section_content_edit">
              <div className="profile_section_content_edit_top">
                  <h1>Edit Profile</h1>
                  <h3>{currentUser.name}</h3>
                  <div className="profile_section_content_edit_profileImg">
                      <img src={currentUser.picture} alt=''/>
                  </div>
              </div>

              <div className="profile_section_content_edit_middle">
                  <div className="profile_section_content_edit_middle_name">
                      <div className="profile_section_content_edit_middle_name_label_box">
                        <label>First name</label>
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>

                      <div className="profile_section_content_edit_middle_name_label_box">
                        <label>Last name</label>
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                  </div>

                  <div className="profile_section_content_edit_middle_email">
                        <label>Email</label>
                        <input type={"text"} placeholder="abc@lehigh.edu" value={currentUser.email}></input>
                  </div>

                  <div className="profile_section_content_edit_middle_email">
                        <label>Username</label>
                        <input type="text" placeholder="abcde" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="profile_section_content_edit_middle_email">
                        <label>Password</label>
                        <input type={"text"} placeholder="*****" readOnly></input>
                  </div>
                  <div className="profile_section_content_edit_middle_buttons">
                  <Button content="Save" onClick={handleSave} />
                    <Button content={"Cancel"} color={'black'}/>
                  </div>
              </div>
            </div>
        </div>
      </div>  
    </div>
  )
}

export default Profile
