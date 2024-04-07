import React from "react";
import TopBar from "../../components/TopBar/TopBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./home.css";
import NewEntryForm from "../../components/New Entry/NewEntryForm";
import axios from 'axios';
import { useEffect, useState } from "react";
import EntryFocused from "../../components/EntryFocused/EntryFocused";
import Button from "../../components/Button/Button";

function Home() {
  const [applications, setApplications] = useState([]);
  const [focusedEntry, setFocusedEntry] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = (entry) => {
    setFocusedEntry(entry);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/application/${user.userId}`);
        setApplications(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="Home">
      <TopBar />
      <div className="home_content">
        <Sidebar />

        <div className="container mx-auto">
          <table className="table">
            <thead className="thead">
              <tr>
                <th>#</th>
                <th>Job Position</th>
                <th>Company</th>
                <th>Location</th>
                <th>Status</th>
                <th>Expand</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
              <tr key={application.id}>
                <td>{application.applicationId}</td>
                <td>{application.jobTitle}</td>
                <td>{application.company}</td>
                <td>{application.location}</td>
                <td>{application.status}</td>
                <td><Button content="Expand" color="black" onClick={() => openPopup(application)}/></td>
              </tr>
            ))}
            </tbody>
          </table>
          <NewEntryForm userId={user.userId} />
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup-background">
          <EntryFocused entry={focusedEntry} onClose={closePopup} />
        </div>
      )}
    </div>
  );
}

export default Home;
