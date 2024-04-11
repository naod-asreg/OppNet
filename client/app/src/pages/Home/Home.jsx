import React, { useContext } from "react";
import TopBar from "../../components/TopBar/TopBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./home.css";
import NewEntryForm from "../../components/New Entry/NewEntryForm";
import axios from "axios";
import { useEffect, useState } from "react";
import EntryFocused from "../../components/EntryFocused/EntryFocused";
import Button from "../../components/Button/Button";
import { UserContext } from "../../App";
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

  let { currentUser, token } = useContext(UserContext);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/application/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [applications]);

  return (
    <div className="Home">
      <TopBar />
      <div className="home_content">
        <Sidebar />

        <div className="container mx-auto">
          <table className="table">
            <thead className="thead">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Job Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Notifications
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expand
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.applicationId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.jobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.notifications ? "ON" : "OFF"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {
                      <Button
                        content={"Expand"}
                        color={"black"}
                        onClick={() => openPopup(application)}
                      />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <NewEntryForm userId={currentUser._id} />
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
