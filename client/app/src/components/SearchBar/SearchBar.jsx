import React from 'react'
import './searchBar.css'

function SearchBar({style}) {
  return (
    <div className='SearchBar' style={style}>
      <input
        type='text'
        placeholder='Enter your email'></input>
    </div>
  )
}

export default SearchBar
