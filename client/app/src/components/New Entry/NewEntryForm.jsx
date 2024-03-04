// NewEntryForm.js
import React, { useState } from "react";
import axios from 'axios';

function NewEntryForm({ userId }) { // Change parameter name to userId (camelCase)
  const [entryType, setEntryType] = useState("");
  const [entryData, setEntryData] = useState({
    userId: userId, // Correct the assignment to userId variable (remove quotes)
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
      // Post new entry data to the application
      await axios.post('http://localhost:5555/application', entryData);
      console.log("New entry submitted successfully");
    } catch (error) {
      console.error('Error submitting new entry:', error.message);
    }

    // Reset form fields
    setEntryType("");
    setEntryData({ userId: userId, type: "" }); // Reset entryData with correct userId value
  };

  const handleChange = (e) => {
    setEntryData({ ...entryData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select entry type:
        <select value={entryType} onChange={handleChangeType}>
          <option value="">Select</option>
          <option value="JOB">Job</option>
          <option value="COLLEGE">College</option>
        </select>
      </label>
      {entryType === "JOB" && (
        <>
          <label>
            Job Title:
            <input type="text" name="jobTitle" onChange={handleChange} />
          </label>
          <label>
            Company:
            <input type="text" name="company" onChange={handleChange} />
          </label>
        </>
      )}
      {entryType === "COLLEGE" && (
        <label>
          University:
          <input type="text" name="university" onChange={handleChange} />
        </label>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}

export default NewEntryForm;
