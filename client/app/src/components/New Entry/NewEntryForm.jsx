import React, { useState } from "react";
import "./newEntryFrom.css";
import Button from "../Button/Button";
import axios from 'axios'
export default function NewEntryForm() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    jobPosition: "",
    company: "",
    location: "",
    status: "",
  });

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      // Make an Axios request to your server
      const response = await axios.post("http://localhost:5555/application", formData);

      // Handle the response as needed
      console.log("Application submitted:", response.data);
    } catch (error) {
      console.error("Error submitting application:", error.message);
    }
  };
  return (
    <>
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded button"
      >
        Create New Entry
      </button>
      {showForm && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="number"
          >
            Number #
            <input
              type="text"
              name="number"
              id="number"
              className="mt-1 p-1 border border-gray-300 rounded-md"
            />
          </label>
          <label
            className="block mt-4 text-sm font-medium text-gray-700"
            htmlFor="jobPosition"
          >
            Job Position
            <input
              type="text"
              name="jobPosition"
              id="jobPosition"
              className="mt-1 p-1 border border-gray-300 rounded-md"
            />
          </label>
          <label
            className="block mt-4 text-sm font-medium text-gray-700"
            htmlFor="company"
          >
            Company
            <input
              type="text"
              name="company"
              id="company"
              className="mt-1 p-1 border border-gray-300 rounded-md"
            />
          </label>
          <label
            className="block mt-4 text-sm font-medium text-gray-700"
            htmlFor="location"
          >
            Location
            <input
              type="text"
              name="location"
              id="location"
              className="mt-1 p-1 border border-gray-300 rounded-md"
            />
          </label>
          <label
            className="block mt-4 text-sm font-medium text-gray-700"
            htmlFor="status"
          >
            Status
            <select
              name="status"
              id="status"
              className="mt-1 p-1 border border-gray-300 rounded-md"
            >
              <option value=""></option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <Button content={"Submit"} color={"black"} onClick={handleFormSubmit} />
        </div>
      )}
    </>
  );
}
