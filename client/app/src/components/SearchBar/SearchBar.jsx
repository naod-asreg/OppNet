import React from 'react'
import './searchBar.css'

function SearchBar({style}) {
  return (
    <div className='SearchBar' style={style}>
      <input
        type='text'
        placeholder='Search Amazon Product Now'></input>
    </div>
  )
}

export default SearchBar
