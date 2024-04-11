import React, { useState } from "react";
import axios from 'axios';
import './newEntryFrom.css';

function NewEntryForm({ userId }) {
  const [showForm, setShowForm] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [entryData, setEntryData] = useState({
    userId: userId,
    type: ""
  });

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
      console.error("Error submitting new entry:", error.message);
    }

    setShowForm(false); // Hide the form after submission
    setEntryType("");
    setEntryData({ userId: userId, type: "" });
  };

  const handleChange = (e) => {
    setEntryData({ ...entryData, [e.target.name]: e.target.value });
    console.log(e.target.name)
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
              <label htmlFor="jobTitle">Job Title:</label>
              <input type="text" id="jobTitle" name="jobTitle" onChange={handleChange} />
              <label htmlFor="company">Company:</label>
              <input type="text" id="company" name="company" onChange={handleChange} />
            </>
          )}
          {entryType === "COLLEGE" && (
            <>
              <label htmlFor="university">University:</label>
              <input type="text" id="university" name="university" onChange={handleChange} />
            </>
          )}
          <button type="submit" className="submit-button">Submit</button>
        </form>
      )}
    </div>
  );
}

export default NewEntryForm;
