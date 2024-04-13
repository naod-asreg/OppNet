import React, { useEffect, useState } from "react";
import TopBar from "../../components/TopBar/TopBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./home.css";
import NewEntryForm from "../../components/New Entry/NewEntryForm";
import EntryFocused from "../../components/EntryFocused/EntryFocused";
import Button from "../../components/Button/Button";
import axios from 'axios';

function Home() {
  const [applications, setApplications] = useState([]);
  const [focusedEntry, setFocusedEntry] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/application/${user.userId}`);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const openPopup = (entry) => {
    setFocusedEntry(entry);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/application/${id}`);
      setApplications(applications.filter(app => app.applicationId !== id));
    } catch (error) {
      console.error('Error deleting entry:', error.message);
    }
  };

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
                <th>Delete</th> {/* Add Delete column header */}
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.applicationId}>
                  <td>{application.applicationId}</td>
                  <td>{application.jobTitle}</td>
                  <td>{application.company}</td>
                  <td>{application.location}</td>
                  <td>{application.status}</td>
                  <td><Button content="Expand" color="black" onClick={() => openPopup(application)}/></td>
                  <td><Button content="Delete" color="red" onClick={() => deleteEntry(application.applicationId)}/></td> {/* Delete Button */}
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
