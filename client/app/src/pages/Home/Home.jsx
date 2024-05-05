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
import SearchBar from "../../components/SearchBar/SearchBar";
function Home() {
  const [applications, setApplications] = useState([]);
  const [focusedEntry, setFocusedEntry] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [viewMode, setViewMode] = useState("Job");
  // Event handlers for dropdown changes
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const openPopup = (entry) => {
    setFocusedEntry(entry);
    setPopupOpen(true);
  };
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };

  let { currentUser, token } = useContext(UserContext);

  const columns =
    viewMode === "Job"
      ? ["#", "Job Position", "Company", "Type", "Status", "Actions"]
      : ["#", "University", "Type", "Status", "Actions"];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/application/${currentUser._id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [applications, currentUser._id, token]);

  useEffect(() => {
    let filtered = applications;

    if (viewMode === "Job") {
      filtered = filtered.filter((app) => app.type === "JOB");
    } else if (viewMode === "College") {
      filtered = filtered.filter((app) => app.type === "COLLEGE");
    }

    if (status) {
      filtered = filtered.filter((app) => app.status === status);
    }
    if (type) {
      filtered = filtered.filter((app) => app.jobType === type);
    }

    setFilteredApplications(filtered);
  }, [status, type, applications, viewMode]);

  // Search functionality
  const handleSearch = (query) => {
    if (!query) {
      // If search query is empty, reset filtered applications to all applications
      setFilteredApplications(applications);
    } else {
      // Otherwise, filter applications based on search query
      const filtered = applications.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
          app.company.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredApplications(filtered);
    }
  };

  return (
    <div className="Home">
     
      <div className="home_content">
        <Sidebar />
        <div className="container mx-auto">
          <div className="home_content_top">
            <div className="home_content_titles">
              <h4 color="grey" className="home_content_titles_small">
                Welcome back!
              </h4>
              <h1 className="home_content_titles_big">{currentUser.name}</h1>
            </div>

            <div className="home_content_top_filter_section">
              <div className="home_content_top_filter_section_title">
                <h3>Applications</h3>
               
              </div>
              <div className="home_content_top_filter_section_subtitle">
                All ({applications.length}) | Job ({applications.length}) |
                College ({applications.length})
              </div>
            </div>
            <div className="home_content_top_filter_section_filters">
              <SearchBar
                style={{ width: "35%", fontSize: "1rem" }}
                placeholder={"Search Application by name"}
                onChange={handleSearch}
              />
              <select
                className="dropdown-nav"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="">Select Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Interview">Interview</option>
                <option value="Online Assessment">Online Assessment</option>
                <option value="Offer">Offer</option>
                <option value="Dropped">Dropped</option>
              </select>

              <select
                className="dropdown-nav"
                value={type}
                onChange={handleTypeChange}
              >
                <option value="">Select Type</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
                <option value="Co-op">Co-op</option>
              </select>

              
              <Button
                  content={"Job"}
                  color={"black"}
                  onClick={() => handleViewModeChange("Job")}
                />
                <Button
                  content={" College"}
                  color={"black"}
                  onClick={() => handleViewModeChange("College")}
                />
            </div>
          </div>

          <table className="table">
            <thead className="thead">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="th">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id} className="tr">
                  <td className="td number">{application.applicationId}</td>
                  <td className="td title">
                    {application.jobTitle || application.university}
                  </td>
                  {viewMode === "Job" && ( // Only render company column if in Job view mode
                    <td className="td company">{application.company}</td>
                  )}
                  <td className="td applications">{application.jobType}</td>
                  <td className="td status">{application.status}</td>
                  <td className="td view-details">
                    <button
                      className="details-button"
                      onClick={() => openPopup(application)}
                    >
                      Expand
                    </button>
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
