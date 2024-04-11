import React, { useState } from "react";
import axios from 'axios';
import './newEntryFrom.css';

// Sample JSON data for companies
const companyData = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Amazon" },
  { id: 3, name: "Microsoft" },
  { id: 4, name: "Google" }
  
];

// Sample JSON data for job positions
const jobPositionData = [
  { id: 1, title: "Software Engineer" },
  { id: 2, title: "Product Manager" },
  { id: 3, title: "Data Scientist" },
  { id: 4, title: "UX Designer" }
  
];

function NewEntryForm({ userId }) {
  const [showForm, setShowForm] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [entryData, setEntryData] = useState({
    userId: userId,
    type: "",
    jobTitle: "",
    company: "",
    university: ""
  });
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);

  const handleChangeType = (e) => {
    const selectedType = e.target.value;
    setEntryType(selectedType);
    setEntryData({ ...entryData, type: selectedType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Entry Data:", entryData);

    try {
      await axios.post('http://localhost:5555/application', entryData);
      console.log("New entry submitted successfully");
    } catch (error) {
      console.error('Error submitting new entry:', error.message);
    }

    setShowForm(false); // Hide the form after submission
    setEntryType("");
    setEntryData({ userId: userId, type: "", jobTitle: "", company: "", university: "" });
    setJobTitleSuggestions([]); // Clear suggestions
    setCompanySuggestions([]); // Clear suggestions
  };

  const handleJobTitle = (e) => {
    const userInput = e.target.value;
    setEntryData({ ...entryData, jobTitle: userInput });
    const filteredJobTitleSuggestions = jobPositionData.filter(job =>
      job.title.toLowerCase().startsWith(userInput.toLowerCase())
    ).slice(0, 10); // Limit suggestions to 10
    setJobTitleSuggestions(filteredJobTitleSuggestions);
  }

  const handleCompany = (e) => {
    const userInput = e.target.value;
    setEntryData({ ...entryData, company: userInput });
    const filteredCompanySuggestions = companyData.filter(company =>
      company.name.toLowerCase().startsWith(userInput.toLowerCase())
    ).slice(0, 10); // Limit suggestions to 10
    setCompanySuggestions(filteredCompanySuggestions);
  }

  const handleUniversity = (e) => {
    const userInput = e.target.value;
    setEntryData({ ...entryData, university: userInput });
  }

  const handleSuggestionClick = (suggestion, field) => {
    if (field === 'jobTitle') {
      setEntryData({ ...entryData, jobTitle: suggestion.title });
      setJobTitleSuggestions([]);
    } else if (field === 'company') {
      setEntryData({ ...entryData, company: suggestion.name });
      setCompanySuggestions([]);
    }
  };

  const handleAddEntryClick = () => {
    setShowForm(true); // Show the form when "Add Entry" button is clicked
  };

  return (
    <div className="new-entry-container">
      {!showForm ? (
        <button className="add-entry-button" onClick={handleAddEntryClick}>Add Entry</button>
      ) : (
        <form onSubmit={handleSubmit} className="new-entry-form">
          <label htmlFor="entryType">Select entry type:</label>
          <select id="entryType" value={entryType} onChange={handleChangeType}>
            <option value="">Select</option>
            <option value="JOB">Job</option>
            <option value="COLLEGE">College</option>
          </select>
          {entryType === "JOB" && (
            <>
              <label htmlFor="jobTitle">Job Position:</label>
              <input type="text" id="jobTitle" name="jobTitle" value={entryData.jobTitle} onChange={handleJobTitle} />
              <ul>
                {jobTitleSuggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion, 'jobTitle')}>
                    {suggestion.title}
                  </li>
                ))}
              </ul>
              <label htmlFor="company">Company:</label>
              <input type="text" id="company" name="company" value={entryData.company} onChange={handleCompany} />
              <ul>
                {companySuggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion, 'company')}>
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </>
          )}
          {entryType === "COLLEGE" && (
            <>
              <label htmlFor="university">University:</label>
              <input type="text" id="university" name="university" value={entryData.university} onChange={handleUniversity} />
            </>
          )}
          <button type="submit" className="submit-button">Submit</button>
        </form>
      )}
    </div>
  );
}

export default NewEntryForm;
