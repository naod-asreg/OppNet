import React, { useContext, useState } from "react";
import axios from "axios";
import "./newEntryFrom.css";
import { UserContext } from "../../App";

// Sample JSON data for companies
const companyData = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Amazon" },
  { id: 3, name: "Microsoft" },
  { id: 4, name: "Google" },
];

// Sample JSON data for job positions
const jobPositionData = [
  { id: 1, title: "Software Engineer" },
  { id: 2, title: "Product Manager" },
  { id: 3, title: "Data Scientist" },
  { id: 4, title: "UX Designer" },
];

function NewEntryForm({ userId }) {
  let { currentUser, token } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [entryData, setEntryData] = useState({
    userId: userId,
    type: "",
    jobTitle: "",
    company: "",
    university: "",
    status: "",
    jobType: ""
  });
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleChangeType = (e) => {
    const selectedType = e.target.value;
    setEntryType(selectedType);
    setEntryData({ ...entryData, type: selectedType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("New Entry Data:", entryData);

    try {
      console.log("Sending", entryData)
      const response = await axios.post(
        "http://localhost:5555/application",
        entryData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      //  console.log("New entry submitted successfully");
      // console.log(response);
      if (response.status === 201) {
        createOrAddGroupChat();
      }
    } catch (error) {
      console.error("Error submitting new entry:", error.message);
    }

    setShowForm(false); // Hide the form after submission
    setEntryType("");
    setEntryData({
      userId: userId,
      type: "",
      jobTitle: "",
      company: "",
      university: "",
    });
    setJobTitleSuggestions([]); // Clear suggestions
    setCompanySuggestions([]); // Clear suggestions
    setShowPopup(false);
  };

  const createOrAddGroupChat = async () => {
    try {
      // Extract entry data
      const { company, jobTitle, university } = entryData;

      let existingGroupChatData;
      // Check if the group chat exists for company
      if (company) {
        const existingGroupChat = await fetch(
          `http://localhost:5555/chats/group/${company}_${jobTitle}`
        );
        existingGroupChatData = await existingGroupChat.json();
      }
      // Check if the group chat exists for university
      else if (university) {
        const existingGroupChat = await fetch(
          `http://localhost:5555/chats/group/${university}`
        );
        existingGroupChatData = await existingGroupChat.json();
      }

      if (existingGroupChatData.message === "Group chat not found.") {
        // Group chat doesn't exist, create a new chat
        const newChat = {
          participants: [userId],
          name: company ? `${company}_${jobTitle}` : university,
        };

        const createdChat = await fetch("http://localhost:5555/chats/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newChat),
        });

        const createdChatData = await createdChat.json();
        return createdChatData;
      } else {
        // Group chat exists, add user to the chat
        const updatedGroupChat = await fetch(
          `http://localhost:5555/chats/${existingGroupChatData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: userId }),
          }
        );

        const updatedGroupChatData = await updatedGroupChat.json();
        return updatedGroupChatData;
      }
    } catch (error) {
      console.error("Error creating or adding group chat:", error.message);
      throw error;
    }
  };

  const handleJobTitle = (e) => {
    const userInput = e.target.value;
    setEntryData({ ...entryData, jobTitle: userInput });
    const filteredJobTitleSuggestions = jobPositionData
      .filter((job) =>
        job.title.toLowerCase().startsWith(userInput.toLowerCase())
      )
      .slice(0, 10);
    setJobTitleSuggestions(filteredJobTitleSuggestions);
  };

  const handleCompany = (e) => {
    const userInput = e.target.value;
    setEntryData({ ...entryData, company: userInput });
    const filteredCompanySuggestions = companyData
      .filter((company) =>
        company.name.toLowerCase().startsWith(userInput.toLowerCase())
      )
      .slice(0, 10); // Limit suggestions to 10
    setCompanySuggestions(filteredCompanySuggestions);
  };

  const handleUniversity = (e) => {
    const userInput = e.target.value;
    setEntryData({ ...entryData, university: userInput });
  };

  const handleSuggestionClick = (suggestion, field) => {
    if (field === "jobTitle") {
      setEntryData({ ...entryData, jobTitle: suggestion.title });
      setJobTitleSuggestions([]);
    } else if (field === "company") {
      setEntryData({ ...entryData, company: suggestion.name });
      setCompanySuggestions([]);
    }
  };

  const handleAddEntryClick = () => {
    setShowForm(true); // Show the form when "Add Entry" button is clicked
    setShowPopup(true);
  };

  return (
    <div className="new-entry-container">
      <button className="add-entry-button" onClick={() => setShowPopup(true)}>
        Add Entry
      </button>
      {showPopup && (
        <div className="popup-background">
          <div className="popup">
            <button
              className="close-button"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
            <form onSubmit={handleSubmit} className="new-entry-form">
              <label htmlFor="entryType">Select entry type:</label>
              <select
                id="entryType"
                value={entryType}
                onChange={handleChangeType}
              >
                <option value="">Select</option>
                <option value="JOB">Job</option>
                <option value="COLLEGE">College</option>
              </select>
              {entryType === "JOB" && (
                <>
                  <label htmlFor="jobTitle">Job Position:</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={entryData.jobTitle}
                    onChange={handleJobTitle}
                  />
                  <ul className="suggestion-list">
                    {jobTitleSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleSuggestionClick(suggestion, "jobTitle")
                        }
                        className="suggestion-item"
                      >
                        {suggestion.title}
                      </li>
                    ))}
                  </ul>
                  <label htmlFor="company">Company:</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={entryData.company}
                    onChange={handleCompany}
                  />
                  <ul className="suggestion-list">
                    {companySuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleSuggestionClick(suggestion, "company")
                        }
                        className="suggestion-item"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                   {/* New dropdown for status */}
                   <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={entryData.status}
                    onChange={(e) =>
                      setEntryData({ ...entryData, status: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Interview">Interview</option>
                    <option value="Online Assesment">Online Assesment</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  {/* New dropdown for type */}
                  <label htmlFor="jobType">Type:</label>
                  <select
                    id="type"
                    name="type"
                    value={entryData.jobType}
                    onChange={(e) =>
                      setEntryData({ ...entryData, jobType: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Internship">Co-op</option>
                  </select>
                </>
              )}
              {entryType === "COLLEGE" && (
                <>
                  <label htmlFor="university">University:</label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={entryData.university}
                    onChange={handleUniversity}
                  />
                                     <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={entryData.status}
                    onChange={(e) =>
                      setEntryData({ ...entryData, status: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </>
              )}

              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewEntryForm;
