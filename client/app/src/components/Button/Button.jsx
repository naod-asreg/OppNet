import React from 'react'
import './button.css'

function Button({content, color, width, onClick}) {


  const buttonStyle = {
    backgroundColor: color || 'white',
    color: color? 'white':'black',

    width: width? width: ''
    
  }
  return (
    <div style={buttonStyle} className='Button' onClick={onClick}>
        {content}
    </div>
  )
}

export default Button
