import React from "react";
import "./searchBar.css";

function SearchBar({ style, placeholder, onChange }) {
  const handleChange = (e) => {
    const query = e.target.value;
    onChange(query); // Pass the search query to the onChange function
  };

  return (
    <div className="SearchBar" style={style}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange} // Call handleChange when input changes
      />
      <span className="search-icon">&#x1F50D;</span> {/* Unicode for magnifying glass icon */}
    </div>
  );
}

export default SearchBar;
